import {
  IconAdjustmentsHorizontal,
  IconArrowLeft,
  IconAntennaBars3,
  IconClock,
  IconDatabase,
  IconGauge,
  IconSettings,
  IconWifiOff,
} from '@tabler/icons-react';
import { useState, type ComponentType } from 'react';
import { formatLastSeen, formatRssi, signalStrengthLabel, type DeviceInfo } from '../../lib/devices';
import styles from './Device.module.css';

interface DevicePageProps {
  readonly device: DeviceInfo;
  readonly onBack: () => void;
}

type DeviceSection = 'dashboard' | 'controls' | 'data' | 'settings';

const sections: Array<{ id: DeviceSection; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: IconGauge },
  { id: 'controls', label: 'Controls', icon: IconAdjustmentsHorizontal },
  { id: 'data', label: 'Data', icon: IconDatabase },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

export default function DevicePage({ device, onBack }: Readonly<DevicePageProps>) {
  const [activeSection, setActiveSection] = useState<DeviceSection>('dashboard');

  const activeSectionLabel = sections.find((section) => section.id === activeSection)?.label ?? 'Dashboard';

  const dashboardSection = (
    <div className={styles['device-page__stacked-grid']}>
      <div className={styles['device-page__hero']}>
        <div className={styles['device-page__metrics']}>
          <article className={styles['device-page__metric-card']}>
            <span className={styles['device-page__metric-label']}>
              <IconWifiOff size={14} />
              RSSI
            </span>
            <strong>{formatRssi(device.rssi)}</strong>
          </article>

          <article className={styles['device-page__metric-card']}>
            <span className={styles['device-page__metric-label']}>
              <IconClock size={14} />
              Last seen
            </span>
            <strong>{formatLastSeen(device.lastSeenSecondsAgo)}</strong>
          </article>

          <article className={styles['device-page__metric-card']}>
            <span className={styles['device-page__metric-label']}>
              <IconAntennaBars3 size={14} />
              Signal
            </span>
            <strong>{signalStrengthLabel(device.signalStrength)}</strong>
          </article>
        </div>
      </div>
    </div>
  );

  const controlsSection = (
    <div className={styles['device-page__stacked-grid']}>
      <article className={styles['device-page__panel']}>
        <h2>Controls</h2>
        <div className={styles['device-page__control-list']}>
          <button className={styles['device-page__action-button']} type="button">Rescan nearby devices</button>
          <button className={styles['device-page__action-button']} type="button">Copy BLE address</button>
          <button className={styles['device-page__action-button']} type="button">Inspect services</button>
          <button className={styles['device-page__action-button']} type="button">Pin device</button>
        </div>
      </article>

      <article className={styles['device-page__panel']}>
        <h2>Quick actions</h2>
        <div className={styles['device-page__activity']}>
          <p>Use these actions to validate advertisement visibility, confirm a stable RSSI, or capture the BLE identifiers for follow-up work.</p>
        </div>
      </article>
    </div>
  );

  const dataSection = (
    <div className={styles['device-page__stacked-grid']}>
      <article className={styles['device-page__panel']}>
        <h2>Data</h2>
        <dl className={`${styles['device-page__definition-list']} ${styles['device-page__definition-list--wide']}`.trim()}>
          <div>
            <dt>RSSI</dt>
            <dd>{formatRssi(device.rssi)}</dd>
          </div>
          <div>
            <dt>Signal</dt>
            <dd>{device.signalStrength}/5 bars</dd>
          </div>
          <div>
            <dt>Manufacturer data</dt>
            <dd>{device.manufacturerData.length > 0 ? device.manufacturerData.join(', ') : 'None'}</dd>
          </div>
          <div>
            <dt>Service UUIDs</dt>
            <dd>{device.serviceUuids.length > 0 ? device.serviceUuids.join(', ') : 'None'}</dd>
          </div>
        </dl>
      </article>

      <article className={styles['device-page__panel']}>
        <h2>Recent readings</h2>
        <div className={styles['device-page__reading-list']}>
          <div>
            <span>Advertisement</span>
            <strong>{device.connected ? 'Visible' : 'Not visible'}</strong>
          </div>
          <div>
            <span>Last seen</span>
            <strong>{formatLastSeen(device.lastSeenSecondsAgo)}</strong>
          </div>
        </div>
      </article>
    </div>
  );

  const settingsSection = (
    <div className={styles['device-page__stacked-grid']}>
      <article className={styles['device-page__panel']}>
        <h2>Settings</h2>
        <div className={styles['device-page__setting-list']}>
          <div className={styles['device-page__setting-row']}>
            <div>
              <h3>Auto refresh</h3>
              <p>Keep the BLE scan stream updated as new advertisements are discovered.</p>
            </div>
            <span className={styles['device-page__setting-value']}>On</span>
          </div>
          <div className={styles['device-page__setting-row']}>
            <div>
              <h3>Refresh window</h3>
              <p>Retain devices for 30 seconds after their last observed advertisement.</p>
            </div>
            <span className={styles['device-page__setting-value']}>30s</span>
          </div>
          <div className={styles['device-page__setting-row']}>
            <div>
              <h3>Notifications</h3>
              <p>Send alerts when a visible advertiser disappears or a new device appears.</p>
            </div>
            <span className={styles['device-page__setting-value']}>On</span>
          </div>
        </div>
      </article>
    </div>
  );

  return (
    <section className={styles['device-page']} aria-label={`${device.name} details`}>
      <div className={styles['device-page__shell']}>
        <aside className={styles['device-page__sidebar']}>
          <button className={styles['device-page__back']} type="button" onClick={onBack}>
            <IconArrowLeft size={16} />
            Back to devices
          </button>

          <nav className={styles['device-page__nav']} aria-label="Device sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`${styles['device-page__nav-item']} ${activeSection === id ? styles['device-page__nav-item--active'] : ''}`.trim()}
                type="button"
                onClick={() => setActiveSection(id)}
                aria-current={activeSection === id ? 'page' : undefined}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <div className={styles['device-page__content']}>
          <div className={styles['device-page__content-header']}>
            <p className={styles['device-page__eyebrow']}>Device view</p>
            <h1>{activeSectionLabel}</h1>
            <p className={styles['device-page__description']}>
              {device.name} · {device.address}
            </p>
          </div>

          {activeSection === 'dashboard' && dashboardSection}
          {activeSection === 'controls' && controlsSection}
          {activeSection === 'data' && dataSection}
          {activeSection === 'settings' && settingsSection}
        </div>
      </div>
    </section>
  );
}
