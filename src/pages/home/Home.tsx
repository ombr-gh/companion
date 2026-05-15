import { useEffect, useRef, useState } from 'react';
import {
  IconActivity,
  IconArrowsExchange,
  IconHome2,
  IconInfoCircle,
  IconMessageCircle,
  IconSettings,
  IconUserCircle,
} from '@tabler/icons-react';
import { DeviceCard, IconButton, Toggle } from '../../components/common';
import './Home.css';

type SettingsSection = 'general' | 'updates' | 'feedback' | 'analytics' | 'about';

type ToggleState = {
  launchOnLogin: boolean;
  systemNotifications: boolean;
  recommendations: boolean;
};

export default function Home() {
  const [activeNav, setActiveNav] = useState<'devices' | 'stats' | 'settings' | 'profile'>('devices');
  const [activePrimaryNav, setActivePrimaryNav] = useState<'devices' | 'stats'>('devices');
  const [activeSettingsNav, setActiveSettingsNav] = useState<SettingsSection>('general');
  const [tabIndicator, setTabIndicator] = useState({ left: 0, width: 0 });
  const devicesTabRef = useRef<HTMLButtonElement | null>(null);
  const statsTabRef = useRef<HTMLButtonElement | null>(null);
  const [toggles, setToggles] = useState<ToggleState>({
    launchOnLogin: true,
    systemNotifications: true,
    recommendations: true,
  });

  const toggleSetting = (key: keyof ToggleState) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  };

  useEffect(() => {
    const updateTabIndicator = () => {
      const tabMap = {
        devices: devicesTabRef.current,
        stats: statsTabRef.current,
      };
      const activeTab = tabMap[activePrimaryNav];

      if (!activeTab) {
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
  }, [activePrimaryNav]);

  return (
    <div className="home-shell">
      <header className="home-topbar">
        <div className="home-topbar__left">
          <span className="brand-mark">
            O
          </span>

          <nav
            className="home-tabs"
            aria-label="Primary"
            style={{
              '--tab-indicator-left': `${tabIndicator.left}px`,
              '--tab-indicator-width': `${tabIndicator.width}px`,
            } as React.CSSProperties}
          >
            <button
              ref={devicesTabRef}
              className={`home-tabs__item ${activePrimaryNav === 'devices' ? 'home-tabs__item--active' : ''}`}
              type="button"
              onClick={() => {
                setActivePrimaryNav('devices');
                setActiveNav('devices');
              }}
              aria-current={activePrimaryNav === 'devices' ? 'page' : undefined}
            >
              Devices
            </button>
            <button
              ref={statsTabRef}
              className={`home-tabs__item ${activePrimaryNav === 'stats' ? 'home-tabs__item--active' : ''}`}
              type="button"
              onClick={() => {
                setActivePrimaryNav('stats');
                setActiveNav('stats');
              }}
              aria-current={activePrimaryNav === 'stats' ? 'page' : undefined}
            >
              Stats
            </button>
            <span className="home-tabs__indicator" aria-hidden="true"></span>
          </nav>
        </div>

        <div className="home-topbar__right">
          <IconButton
            className="home-icon-button"
            icon={<IconSettings size={18}></IconSettings>}
            onClick={() => setActiveNav('settings')}
            aria-label="Settings"
          ></IconButton>
          <IconButton
            className="home-icon-button"
            icon={<IconUserCircle size={18}></IconUserCircle>}
            onClick={() => setActiveNav('profile')}
            aria-label="Account"
          ></IconButton>
        </div>
      </header>

      <main className="home-content">
        {activeNav === 'devices' && (
          <div className="device-card-container">
            <DeviceCard name="Hayden's Geo" elevated={true} signalStrength={4} connected={true}></DeviceCard>
          </div>
        )}

        {activeNav === 'stats' && (
          <section className="home-panel" aria-label="Stats">
            <h2>Stats</h2>
            <p>Statistical data is coming soon.</p>
          </section>
        )}

        {activeNav === 'settings' && (
          <section className="settings-layout" aria-label="Settings">
            <aside className="settings-sidebar">
              <nav className="settings-sidebar__nav" aria-label="Settings sections">
                <button
                  className={`settings-sidebar__item ${activeSettingsNav === 'general' ? 'settings-sidebar__item--active' : ''}`}
                  type="button"
                  onClick={() => setActiveSettingsNav('general')}
                >
                  <IconHome2 size={18}></IconHome2>
                  General
                </button>
                <button
                  className={`settings-sidebar__item ${activeSettingsNav === 'updates' ? 'settings-sidebar__item--active' : ''}`}
                  type="button"
                  onClick={() => setActiveSettingsNav('updates')}
                >
                  <IconArrowsExchange size={18}></IconArrowsExchange>
                  Updates
                </button>
                <button
                  className={`settings-sidebar__item ${activeSettingsNav === 'feedback' ? 'settings-sidebar__item--active' : ''}`}
                  type="button"
                  onClick={() => setActiveSettingsNav('feedback')}
                >
                  <IconMessageCircle size={18}></IconMessageCircle>
                  Share Feedback
                </button>
                <button
                  className={`settings-sidebar__item ${activeSettingsNav === 'analytics' ? 'settings-sidebar__item--active' : ''}`}
                  type="button"
                  onClick={() => setActiveSettingsNav('analytics')}
                >
                  <IconActivity size={18}></IconActivity>
                  Analytics
                </button>
                <button
                  className={`settings-sidebar__item ${activeSettingsNav === 'about' ? 'settings-sidebar__item--active' : ''}`}
                  type="button"
                  onClick={() => setActiveSettingsNav('about')}
                >
                  <IconInfoCircle size={18}></IconInfoCircle>
                  About
                </button>
              </nav>
            </aside>

            <div className="settings-content">
              <h3>{activeSettingsNav === 'general' ? 'General Settings' : activeSettingsNav === 'updates' ? 'Updates' : activeSettingsNav === 'feedback' ? 'Share Feedback' : activeSettingsNav === 'analytics' ? 'Analytics' : 'About'}</h3>
              {activeSettingsNav === 'general' && (
                <>
                  <div className="settings-group">
                    <div className="settings-row">
                      <div className="settings-row__copy">
                        <h4>Launch app on login</h4>
                        <p>Always start after logging in</p>
                      </div>
                      <Toggle
                        checked={toggles.launchOnLogin}
                        onChange={() => toggleSetting('launchOnLogin')}
                      />
                    </div>
                  </div>

                  <hr className="settings-divider" />

                  <div className="settings-group">
                    <h4 className="settings-group__title">Notifications</h4>

                    <div className="settings-row">
                      <div className="settings-row__copy">
                        <h4>System Notifications</h4>
                        <p>Allow desktop notifications</p>
                      </div>
                      <Toggle
                        checked={toggles.systemNotifications}
                        onChange={() => toggleSetting('systemNotifications')}
                      />
                    </div>

                    <div className="settings-row">
                      <div className="settings-row__copy">
                        <h4>Recommendations</h4>
                        <p>Selectively recommend devices and experiences that are relevant to you</p>
                      </div>
                      <Toggle
                        checked={toggles.recommendations}
                        onChange={() => toggleSetting('recommendations')}
                      />
                    </div>
                  </div>
                </>
              )}
              {activeSettingsNav === 'updates' && (
                <p>Manage update channels and release preferences.</p>
              )}
              {activeSettingsNav === 'feedback' && (
                <p>Share product feedback and diagnostics preferences.</p>
              )}
              {activeSettingsNav === 'analytics' && (
                <p>Control usage analytics collection and reporting.</p>
              )}
              {activeSettingsNav === 'about' && (
                <p>Version, licenses, and platform information.</p>
              )}
            </div>
          </section>
        )}

        {activeNav === 'profile' && (
          <section className="home-panel" aria-label="Profile">
            <h2>Profile</h2>
            <p>Account and cloud profile options are available here.</p>
          </section>
        )}
      </main>
    </div>
  );
}
