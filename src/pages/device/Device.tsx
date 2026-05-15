import {
  IconArrowLeft,
  IconBattery2,
  IconBluetoothConnected,
  IconClock,
  IconMapPin,
  IconRadar,
  IconWifi,
} from '@tabler/icons-react';
import { formatLastSeen, formatUptime, type DeviceInfo } from '../../lib/devices';
import './Device.css';

interface DevicePageProps {
  device: DeviceInfo;
  onBack: () => void;
}

const formatConnectionStatus = (device: DeviceInfo) => {
  if (device.connected) {
    return device.signalStrength >= 4 ? 'Excellent' : 'Connected';
  }

  return 'Disconnected';
};

export default function DevicePage({ device, onBack }: DevicePageProps) {
  const connectionStatus = formatConnectionStatus(device);

  return (
    <section className="device-page" aria-label={`${device.name} details`}>
      <button className="device-page__back" type="button" onClick={onBack}>
        <IconArrowLeft size={16} />
        Back to devices
      </button>

      <div className="device-page__hero">
        <div className="device-page__visual-panel">
          <div className="device-page__image-shell" role="img" aria-label={`${device.name} image`}>
            <img
              className="device-page__image"
              src={`https://picsum.photos/seed/${encodeURIComponent(device.name)}/720/1080`}
              alt={device.name}
            />
          </div>

          <div className="device-page__status-row">
            <span className="device-page__pill device-page__pill--success">
              <IconBluetoothConnected size={14} />
              {device.connected ? 'Connected' : 'Offline'}
            </span>
            <span className="device-page__pill">
              <IconWifi size={14} />
              {connectionStatus}
            </span>
            <span className="device-page__pill">
              <IconRadar size={14} />
              {device.statusLabel}
            </span>
          </div>
        </div>

        <div className="device-page__summary">
          <p className="device-page__eyebrow">Device info</p>
          <h1>{device.name}</h1>
          <p className="device-page__model">{device.model.name}</p>
          <p className="device-page__description">{device.statusLabel}</p>

          <div className="device-page__metrics">
            <article className="device-page__metric-card">
              <span className="device-page__metric-label">
                <IconBattery2 size={14} />
                Battery
              </span>
              <strong>{device.batteryPercent}%</strong>
              <span>Current charge level</span>
            </article>

            <article className="device-page__metric-card">
              <span className="device-page__metric-label">
                <IconMapPin size={14} />
                Location
              </span>
              <strong>{device.location}</strong>
              <span>Most recent reported position</span>
            </article>

            <article className="device-page__metric-card">
              <span className="device-page__metric-label">
                <IconClock size={14} />
                Last seen
              </span>
              <strong>{formatLastSeen(device.lastSeenMinutesAgo)}</strong>
              <span>{device.activity}</span>
            </article>
          </div>
        </div>
      </div>

      <div className="device-page__details-grid">
        <article className="device-page__panel">
          <h2>Overview</h2>
          <dl className="device-page__definition-list">
            <div>
              <dt>Firmware</dt>
              <dd>{device.firmware}</dd>
            </div>
            <div>
              <dt>Uptime</dt>
              <dd>{formatUptime(device.uptimeHours)}</dd>
            </div>
            <div>
              <dt>Pairing</dt>
              <dd>{device.pairingState}</dd>
            </div>
            <div>
              <dt>Signal</dt>
              <dd>{device.signalStrength}/5 bars</dd>
            </div>
          </dl>
        </article>

        <article className="device-page__panel">
          <h2>Recent activity</h2>
          <div className="device-page__activity">
            <p>{device.activity}</p>
            <p>
              The device is currently {device.connected ? 'online' : 'offline'} and the last
              sync was {formatLastSeen(device.lastSeenMinutesAgo)}.
            </p>
            <p>
              Use this page to review connection status, health metrics, and the latest location
              details for the selected device.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
