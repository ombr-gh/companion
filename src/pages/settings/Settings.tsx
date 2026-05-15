import { useState } from 'react';
import {
  IconActivity,
  IconArrowsExchange,
  IconHome2,
  IconInfoCircle,
  IconMessageCircle,
} from '@tabler/icons-react';
import { Toggle } from '../../components/common';
import './Settings.css';

type SettingsSection = 'general' | 'updates' | 'feedback' | 'analytics' | 'about';

type ToggleState = {
  launchOnLogin: boolean;
  systemNotifications: boolean;
  recommendations: boolean;
};

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [toggles, setToggles] = useState<ToggleState>({
    launchOnLogin: true,
    systemNotifications: true,
    recommendations: true,
  });

  const toggleSetting = (key: keyof ToggleState) => {
    setToggles((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <section className="settings-page" aria-label="Settings">
      <aside className="settings-page__sidebar">
        <nav className="settings-page__nav" aria-label="Settings sections">
          <button
            className={`settings-page__item ${activeSection === 'general' ? 'settings-page__item--active' : ''}`}
            type="button"
            onClick={() => setActiveSection('general')}
          >
            <IconHome2 size={18}></IconHome2>
            General
          </button>
          <button
            className={`settings-page__item ${activeSection === 'updates' ? 'settings-page__item--active' : ''}`}
            type="button"
            onClick={() => setActiveSection('updates')}
          >
            <IconArrowsExchange size={18}></IconArrowsExchange>
            Updates
          </button>
          <button
            className={`settings-page__item ${activeSection === 'feedback' ? 'settings-page__item--active' : ''}`}
            type="button"
            onClick={() => setActiveSection('feedback')}
          >
            <IconMessageCircle size={18}></IconMessageCircle>
            Share Feedback
          </button>
          <button
            className={`settings-page__item ${activeSection === 'analytics' ? 'settings-page__item--active' : ''}`}
            type="button"
            onClick={() => setActiveSection('analytics')}
          >
            <IconActivity size={18}></IconActivity>
            Analytics
          </button>
          <button
            className={`settings-page__item ${activeSection === 'about' ? 'settings-page__item--active' : ''}`}
            type="button"
            onClick={() => setActiveSection('about')}
          >
            <IconInfoCircle size={18}></IconInfoCircle>
            About
          </button>
        </nav>
      </aside>

      <div className="settings-page__content">
        <h3 className="settings-page__title">
          {activeSection === 'general'
            ? 'General Settings'
            : activeSection === 'updates'
              ? 'Updates'
              : activeSection === 'feedback'
                ? 'Share Feedback'
                : activeSection === 'analytics'
                  ? 'Analytics'
                  : 'About'}
        </h3>
        {activeSection === 'general' && (
          <>
            <div className="settings-page__group">
              <div className="settings-page__row">
                <div className="settings-page__copy">
                  <h4>Launch app on login</h4>
                  <p>Always start after logging in</p>
                </div>
                <Toggle
                  checked={toggles.launchOnLogin}
                  onChange={() => toggleSetting('launchOnLogin')}
                />
              </div>
            </div>

            <hr className="settings-page__divider" />

            <div className="settings-page__group">
              <h4 className="settings-page__group-title">Notifications</h4>

              <div className="settings-page__row">
                <div className="settings-page__copy">
                  <h4>System Notifications</h4>
                  <p>Allow desktop notifications</p>
                </div>
                <Toggle
                  checked={toggles.systemNotifications}
                  onChange={() => toggleSetting('systemNotifications')}
                />
              </div>

              <div className="settings-page__row">
                <div className="settings-page__copy">
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
        {activeSection === 'updates' && (
          <p>Manage update channels and release preferences.</p>
        )}
        {activeSection === 'feedback' && (
          <p>Share product feedback and diagnostics preferences.</p>
        )}
        {activeSection === 'analytics' && (
          <p>Control usage analytics collection and reporting.</p>
        )}
        {activeSection === 'about' && (
          <p>Version, licenses, and platform information.</p>
        )}
      </div>
    </section>
  );
}
