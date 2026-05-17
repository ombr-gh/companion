import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IconSettings, IconUserCircle } from '@tabler/icons-react';
import { CurrentPage } from './types';
import Home from './pages/home/Home';
import StatsPage from './pages/stats/Stats';
import SettingsPage from './pages/settings/Settings';
import ProfilePage from './pages/profile/Profile';
import DevicePage from './pages/device/Device';
import SetupPage from './pages/setup/Setup';
import { IconButton } from './components/common';
import { type DeviceInfo } from './lib/devices';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import styles from './App.module.css';

function App() {
  const [page, setPage] = useState<CurrentPage>('home');
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [isSearchingForGeoDevices, setIsSearchingForGeoDevices] = useState(true);
  const devicesTabRef = useRef<HTMLButtonElement | null>(null);
  const statsTabRef = useRef<HTMLButtonElement | null>(null);
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });

  const isPrimaryPage = page === 'home' || page === 'stats';

  useEffect(() => {
    const updateTabIndicator = () => {
      if (!isPrimaryPage) {
        setTabIndicator({ left: 0, width: 0 });
        return;
      }

      const activeTab = page === 'home' ? devicesTabRef.current : statsTabRef.current;

      if (!activeTab) {
        setTabIndicator({ left: 0, width: 0 });
        return;
      }

      setTabIndicator({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
      });
    };

    updateTabIndicator();
    window.addEventListener('resize', updateTabIndicator);

    return () => {
      window.removeEventListener('resize', updateTabIndicator);
    };
  }, [isPrimaryPage, page]);

  const shellStyle = {
    '--tab-indicator-left': `${tabIndicator.left}px`,
    '--tab-indicator-width': `${tabIndicator.width}px`,
  } as CSSProperties;

  useEffect(() => {
    let cancelled = false;
    let unlistenDevices: (() => void) | undefined;

    const seedDevices = async () => {
      try {
        const initialDevices = await invoke<DeviceInfo[]>('get_ble_devices');

        if (!cancelled) {
          setDevices(initialDevices);
        }
      } catch (error) {
        console.error('Failed to load BLE devices', error);
      } finally {
        if (!cancelled) {
          setIsSearchingForGeoDevices(false);
        }
      }
    };

    void seedDevices();

    void listen<DeviceInfo[]>('ble-devices-updated', (event) => {
      setDevices(event.payload);
    }).then((unlisten) => {
      if (cancelled) {
        unlisten();
        return;
      }

      unlistenDevices = unlisten;
    });

    return () => {
      cancelled = true;
      unlistenDevices?.();
    };
  }, []);

  useEffect(() => {
    if (!selectedDevice) {
      return;
    }

    const refreshedDevice = devices.find((device) => device.id === selectedDevice.id);

    if (refreshedDevice && refreshedDevice !== selectedDevice) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedDevice(refreshedDevice);
      return;
    }

    if (!refreshedDevice && (page === 'device' || page === 'setup')) {
      setSelectedDevice(null);
      setPage('home');
    }
  }, [devices, page, selectedDevice]);

  const openDevice = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setPage(device.setupComplete ? 'device' : 'setup');
  };

  const goBackToDevices = () => {
    setPage('home');
  };

  const completeDeviceSetup = (updatedDevice: DeviceInfo) => {
    setDevices((currentDevices) =>
      currentDevices.map((device) => (device.id === updatedDevice.id ? updatedDevice : device)),
    );
    setSelectedDevice(updatedDevice);
    setPage('device');
  };

  return (
    <div
      className={styles['app-shell']}
      style={shellStyle}
      onContextMenu={(event) => event.preventDefault()}
    >
      <header className={styles['app-topbar']}>
        <div className={styles['app-topbar__left']}>
          <span className={styles['brand-mark']}>
            <img
              src={new URL('./assets/logo.svg', import.meta.url).href}
              alt="Nimbus"
              className={styles['brand-mark__img']}
            />
          </span>

          <nav
            className={`${styles['app-tabs']} ${!isPrimaryPage ? styles['app-tabs--indicator-hidden'] : ''}`}
            aria-label="Primary"
          >
            <button
              ref={devicesTabRef}
              className={`${styles['app-tabs__item']} ${page === 'home' ? styles['app-tabs__item--active'] : ''}`}
              type="button"
              onClick={() => setPage('home')}
              aria-current={page === 'home' ? 'page' : undefined}
            >
              Devices
            </button>
            <button
              ref={statsTabRef}
              className={`${styles['app-tabs__item']} ${page === 'stats' ? styles['app-tabs__item--active'] : ''}`}
              type="button"
              onClick={() => setPage('stats')}
              aria-current={page === 'stats' ? 'page' : undefined}
            >
              Stats
            </button>
            <span className={styles['app-tabs__indicator']} aria-hidden="true"></span>
          </nav>
        </div>

        <div className={styles['app-topbar__right']}>
          <IconButton
            className={`${styles['app-icon-button']} ${page === 'settings' ? styles['app-icon-button--active'] : ''}`}
            icon={<IconSettings size={18}></IconSettings>}
            onClick={() => setPage('settings')}
            aria-label="Settings"
          ></IconButton>
          <IconButton
            className={`${styles['app-icon-button']} ${page === 'profile' ? styles['app-icon-button--active'] : ''}`}
            icon={<IconUserCircle size={18}></IconUserCircle>}
            onClick={() => setPage('profile')}
            aria-label="Account"
          ></IconButton>
        </div>
      </header>

      <main className={styles['app-content']}>
        {page === 'home' && (
          <Home
            devices={devices}
            isSearchingForGeoDevices={isSearchingForGeoDevices}
            onOpenDevice={openDevice}
          />
        )}
        {page === 'stats' && <StatsPage />}
        {page === 'settings' && <SettingsPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'setup' && selectedDevice ? (
          <SetupPage
            key={selectedDevice.id}
            device={selectedDevice}
            onBack={goBackToDevices}
            onComplete={completeDeviceSetup}
          />
        ) : null}
        {page === 'device' && selectedDevice ? (
          <DevicePage device={selectedDevice} onBack={goBackToDevices} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
