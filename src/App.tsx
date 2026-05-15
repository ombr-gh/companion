import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { IconSettings, IconUserCircle } from '@tabler/icons-react';
import { CurrentPage } from './types';
import Home from './pages/home/Home';
import StatsPage from './pages/stats/Stats';
import SettingsPage from './pages/settings/Settings';
import ProfilePage from './pages/profile/Profile';
import DevicePage from './pages/device/Device';
import { IconButton } from './components/common';
import { type DeviceInfo } from './lib/devices';
import './App.css';

function App() {
  const [page, setPage] = useState<CurrentPage>('home');
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
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

  const openDevice = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setPage('device');
  };

  const goBackToDevices = () => {
    setPage('home');
  };

  return (
    <div
      className="app-shell"
      style={shellStyle}
      onContextMenu={(event) => event.preventDefault()}
    >
      <header className="app-topbar">
        <div className="app-topbar__left">
          <span className="brand-mark">
            <img
              src={new URL('./assets/logo.svg', import.meta.url).href}
              alt="Nimbus"
              className="brand-mark__img"
            />
          </span>

          <nav
            className={`app-tabs ${!isPrimaryPage ? 'app-tabs--indicator-hidden' : ''}`}
            aria-label="Primary"
          >
            <button
              ref={devicesTabRef}
              className={`app-tabs__item ${page === 'home' ? 'app-tabs__item--active' : ''}`}
              type="button"
              onClick={() => setPage('home')}
              aria-current={page === 'home' ? 'page' : undefined}
            >
              Devices
            </button>
            <button
              ref={statsTabRef}
              className={`app-tabs__item ${page === 'stats' ? 'app-tabs__item--active' : ''}`}
              type="button"
              onClick={() => setPage('stats')}
              aria-current={page === 'stats' ? 'page' : undefined}
            >
              Stats
            </button>
            <span className="app-tabs__indicator" aria-hidden="true"></span>
          </nav>
        </div>

        <div className="app-topbar__right">
          <IconButton
            className={`app-icon-button ${page === 'settings' ? 'app-icon-button--active' : ''}`}
            icon={<IconSettings size={18}></IconSettings>}
            onClick={() => setPage('settings')}
            aria-label="Settings"
          ></IconButton>
          <IconButton
            className={`app-icon-button ${page === 'profile' ? 'app-icon-button--active' : ''}`}
            icon={<IconUserCircle size={18}></IconUserCircle>}
            onClick={() => setPage('profile')}
            aria-label="Account"
          ></IconButton>
        </div>
      </header>

      <main className="app-content">
        {page === 'home' && <Home onOpenDevice={openDevice} />}
        {page === 'stats' && <StatsPage />}
        {page === 'settings' && <SettingsPage />}
        {page === 'profile' && <ProfilePage />}
        {page === 'device' && selectedDevice ? (
          <DevicePage device={selectedDevice} onBack={goBackToDevices} />
        ) : null}
      </main>
    </div>
  );
}

export default App;
