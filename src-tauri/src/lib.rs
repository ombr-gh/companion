#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let app_handle = app.handle().clone();
            let device_store = BleDeviceStore::default();

            app.manage(device_store.clone());

            tauri::async_runtime::spawn(async move {
                if let Err(error) = scan_ble_devices(app_handle, device_store).await {
                    eprintln!("failed to scan BLE devices: {error}");
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_ble_devices])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

use btleplug::api::{Central, Manager as _, Peripheral as _, ScanFilter};
use btleplug::platform::Manager as BtManager;
use serde::Serialize;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};
use tauri::{AppHandle, Emitter, Manager as _, State};

const BLE_DEVICES_UPDATED_EVENT: &str = "ble-devices-updated";
const DEVICE_RETENTION_WINDOW: Duration = Duration::from_secs(30);
const SCAN_INTERVAL: Duration = Duration::from_secs(3);
const FIRMWARE_SERVICE_UUID: &str = "01171718-ce62-6a9a-5541-b839b04a7bd1";
const FIRMWARE_MANUFACTURER_ID: u16 = 0x4F4D;

#[derive(Clone, Default)]
struct BleDeviceStore {
    devices: Arc<Mutex<Vec<BleDeviceSnapshot>>>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct BleDeviceSnapshot {
    id: String,
    name: String,
    model_id: String,
    address: String,
    rssi: Option<i16>,
    signal_strength: u8,
    connected: bool,
    connectable: bool,
    status_label: String,
    last_seen_seconds_ago: u64,
    tx_power_level: Option<i16>,
    manufacturer_data: Vec<String>,
    service_uuids: Vec<String>,
}

#[tauri::command]
fn get_ble_devices(store: State<'_, BleDeviceStore>) -> Vec<BleDeviceSnapshot> {
    store.devices.lock().unwrap().clone()
}

async fn scan_ble_devices(app: AppHandle, store: BleDeviceStore) -> Result<(), String> {
    let manager = BtManager::new().await.map_err(|error| error.to_string())?;
    let adapters = manager
        .adapters()
        .await
        .map_err(|error| error.to_string())?;

    let Some(adapter) = adapters.into_iter().next() else {
        let empty_devices = Vec::new();
        *store.devices.lock().unwrap() = empty_devices.clone();
        let _ = app.emit(BLE_DEVICES_UPDATED_EVENT, empty_devices);
        return Err("no Bluetooth adapters were found".to_string());
    };

    adapter
        .start_scan(ScanFilter::default())
        .await
        .map_err(|error| error.to_string())?;

    eprintln!(
        "BLE scan started; expecting manufacturer ID 0x{FIRMWARE_MANUFACTURER_ID:04x} and optional service UUID {}",
        FIRMWARE_SERVICE_UUID
    );

    let mut seen_devices: HashMap<String, (BleDeviceSnapshot, Instant)> = HashMap::new();

    loop {
        let now = Instant::now();
        let peripherals = adapter
            .peripherals()
            .await
            .map_err(|error| error.to_string())?;

        for peripheral in peripherals {
            let Some(properties) = peripheral
                .properties()
                .await
                .map_err(|error| error.to_string())?
            else {
                eprintln!("BLE scan saw peripheral without properties; skipping");
                continue;
            };

            let advertised_service_uuids = properties
                .services
                .iter()
                .map(|service_uuid| service_uuid.to_string())
                .collect::<Vec<_>>();
            let advertised_manufacturer_ids = properties
                .manufacturer_data
                .keys()
                .map(|company_id| format!("0x{company_id:04x}"))
                .collect::<Vec<_>>();

            let has_firmware_service_uuid = advertised_service_uuids
                .iter()
                .any(|service_uuid| service_uuid == FIRMWARE_SERVICE_UUID);
            let has_firmware_manufacturer_marker = properties
                .manufacturer_data
                .contains_key(&FIRMWARE_MANUFACTURER_ID);

            eprintln!(
                "BLE scan saw address={} name={:?} rssi={:?} services={:?} manufacturer_ids={:?} matches={{service_uuid: {}, manufacturer_id: {}}}",
                properties.address,
                properties.local_name,
                properties.rssi,
                advertised_service_uuids,
                advertised_manufacturer_ids,
                has_firmware_service_uuid,
                has_firmware_manufacturer_marker,
            );

            if !has_firmware_manufacturer_marker {
                eprintln!(
                    "BLE scan skipping address={} because it does not advertise the firmware manufacturer marker",
                    properties.address
                );
                continue;
            }

            let address = properties.address.to_string();
            let name = properties
                .local_name
                .clone()
                .filter(|value| !value.trim().is_empty())
                .unwrap_or_else(|| format!("BLE device {}", address));
            let rssi = properties.rssi;
            let signal_strength = signal_strength_from_rssi(rssi);
            let model_id = "geo-mk1".to_string();
            let connectable = properties.rssi.is_some();
            let manufacturer_data = properties
                .manufacturer_data
                .iter()
                .map(|(company_id, value)| format!("0x{company_id:04x}: {}", format_bytes(value)))
                .collect::<Vec<_>>();
            let service_uuids = advertised_service_uuids;

            let snapshot = BleDeviceSnapshot {
                id: address.clone(),
                name,
                address: address.clone(),
                model_id,
                rssi,
                signal_strength,
                connected: false,
                connectable,
                status_label: status_label(rssi, connectable),
                last_seen_seconds_ago: 0,
                tx_power_level: properties.tx_power_level,
                manufacturer_data,
                service_uuids,
            };

            seen_devices.insert(address, (snapshot, now));
        }

        seen_devices.retain(|_, (_, seen_at)| seen_at.elapsed() <= DEVICE_RETENTION_WINDOW);

        let mut active_devices = seen_devices
            .iter_mut()
            .map(|(_, (snapshot, seen_at))| {
                snapshot.last_seen_seconds_ago = seen_at.elapsed().as_secs();
                snapshot.clone()
            })
            .collect::<Vec<_>>();

        active_devices.sort_by(|left, right| right.signal_strength.cmp(&left.signal_strength));

        *store.devices.lock().unwrap() = active_devices.clone();
        let _ = app.emit(BLE_DEVICES_UPDATED_EVENT, active_devices);

        tokio::time::sleep(SCAN_INTERVAL).await;
    }
}

fn signal_strength_from_rssi(rssi: Option<i16>) -> u8 {
    match rssi {
        Some(value) if value >= -55 => 5,
        Some(value) if value >= -65 => 4,
        Some(value) if value >= -75 => 3,
        Some(value) if value >= -85 => 2,
        Some(_) => 1,
        None => 0,
    }
}

fn status_label(rssi: Option<i16>, connectable: bool) -> String {
    let signal_label = match signal_strength_from_rssi(rssi) {
        5 => "Excellent",
        4 => "Strong",
        3 => "Good",
        2 => "Weak",
        1 => "Very Weak",
        _ => "Unavailable",
    };

    if connectable {
        format!("{signal_label} and connectable")
    } else {
        format!("{signal_label} advertising signal")
    }
}

fn format_bytes(bytes: &[u8]) -> String {
    bytes
        .iter()
        .map(|byte| format!("{byte:02x}"))
        .collect::<Vec<_>>()
        .join(" ")
}
