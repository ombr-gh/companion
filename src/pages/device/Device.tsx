import {
  IconAdjustmentsHorizontal,
  IconArrowLeft,
  IconBattery2,
  IconBluetoothConnected,
  IconClock,
  IconDroplet,
  IconDatabase,
  IconGauge,
  IconSettings,
  IconRadar,
  IconTemperature,
  IconWifi,
} from '@tabler/icons-react';
import { useState, type ComponentType } from 'react';
import { formatLastSeen, formatUptime, type DeviceInfo } from '../../lib/devices';
import './Device.css';

interface DevicePageProps {
  device: DeviceInfo;
  onBack: () => void;
}

type DeviceSection = 'dashboard' | 'controls' | 'data' | 'settings';

const sections: Array<{ id: DeviceSection; label: string; icon: ComponentType<{ size?: number }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: IconGauge },
  { id: 'controls', label: 'Controls', icon: IconAdjustmentsHorizontal },
  { id: 'data', label: 'Data', icon: IconDatabase },
  { id: 'settings', label: 'Settings', icon: IconSettings },
];

const formatConnectionStatus = (device: DeviceInfo) => {
  if (device.connected) {
    return device.signalStrength >= 4 ? 'Excellent' : 'Connected';
  }

  return 'Disconnected';
};

export default function DevicePage({ device, onBack }: DevicePageProps) {
  const [activeSection, setActiveSection] = useState<DeviceSection>('dashboard');
  const connectionStatus = formatConnectionStatus(device);

  const activeSectionLabel = sections.find((section) => section.id === activeSection)?.label ?? 'Dashboard';

  const dashboardSection = (
    <div className="device-page__stacked-grid">
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
                <IconClock size={14} />
                Last seen
              </span>
              <strong>{formatLastSeen(device.lastSeenMinutesAgo)}</strong>
            </article>

            <article className="device-page__metric-card">
              <span className="device-page__metric-label">
                <IconTemperature size={14} />
                Temperature
              </span>
              <strong>{device.temperatureC}°C</strong>
              <span>Current temperature</span>
            </article>

            <article className="device-page__metric-card">
              <span className="device-page__metric-label">
                <IconDroplet size={14} />
                Humidity
              </span>
              <strong>{device.humidityPercent}%</strong>
              <span>Current humidity level</span>
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
              <dt>Signal</dt>
              <dd>{device.signalStrength}/5 bars</dd>
            </div>
            <div>
              <dt>Connection</dt>
              <dd>{connectionStatus}</dd>
            </div>
          </dl>
        </article>

        <article className="device-page__panel">
          <h2>Activity</h2>
          <div className="device-page__activity">
            <p>{device.name} has been stable for the last session window.</p>
            <p>Telemetry is updating normally and the current health state is within expected range.</p>
          </div>
        </article>
      </div>
    </div>
  );

  const controlsSection = (
    <div className="device-page__stacked-grid">
      <article className="device-page__panel">
        <h2>Controls</h2>
        <div className="device-page__control-list">
          <button className="device-page__action-button" type="button">Ping device</button>
          <button className="device-page__action-button" type="button">Sync time</button>
          <button className="device-page__action-button" type="button">Restart radio</button>
          <button className="device-page__action-button" type="button">Mark maintenance</button>
        </div>
      </article>

      <article className="device-page__panel">
        <h2>Quick actions</h2>
        <div className="device-page__activity">
          <p>Use these actions to test connectivity, confirm the device is responding, or prepare it for a service window.</p>
        </div>
      </article>
    </div>
  );

  const dataSection = (
    <div className="device-page__stacked-grid">
      <article className="device-page__panel">
        <h2>Data</h2>
        <dl className="device-page__definition-list device-page__definition-list--wide">
          <div>
            <dt>Battery</dt>
            <dd>{device.batteryPercent}%</dd>
          </div>
          <div>
            <dt>Temperature</dt>
            <dd>{device.temperatureC}°C</dd>
          </div>
          <div>
            <dt>Humidity</dt>
            <dd>{device.humidityPercent}%</dd>
          </div>
          <div>
            <dt>Uptime</dt>
            <dd>{formatUptime(device.uptimeHours)}</dd>
          </div>
        </dl>
      </article>

      <article className="device-page__panel">
        <h2>Recent readings</h2>
        <div className="device-page__reading-list">
          <div>
            <span>Signal</span>
            <strong>{device.signalStrength}/5 bars</strong>
          </div>
          <div>
            <span>Last seen</span>
            <strong>{formatLastSeen(device.lastSeenMinutesAgo)}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>{device.statusLabel}</strong>
          </div>
        </div>
      </article>
    </div>
  );

  const settingsSection = (
    <div className="device-page__stacked-grid">
      <article className="device-page__panel">
        <h2>Settings</h2>
        <div className="device-page__setting-list">
          <div className="device-page__setting-row">
            <div>
              <h3>Auto reconnect</h3>
              <p>Reconnect when the device drops offline.</p>
            </div>
            <span className="device-page__setting-value">Enabled</span>
          </div>
          <div className="device-page__setting-row">
            <div>
              <h3>Telemetry interval</h3>
              <p>Collect readings every 60 seconds.</p>
            </div>
            <span className="device-page__setting-value">60s</span>
          </div>
          <div className="device-page__setting-row">
            <div>
              <h3>Notifications</h3>
              <p>Send alerts for offline status and low battery.</p>
            </div>
            <span className="device-page__setting-value">On</span>
          </div>
        </div>
      </article>
    </div>
  );

  return (
    <section className="device-page" aria-label={`${device.name} details`}>
      <div className="device-page__shell">
        <aside className="device-page__sidebar">
          <button className="device-page__back" type="button" onClick={onBack}>
            <IconArrowLeft size={16} />
            Back to devices
          </button>

          <nav className="device-page__nav" aria-label="Device sections">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`device-page__nav-item ${activeSection === id ? 'device-page__nav-item--active' : ''}`}
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

        <div className="device-page__content">
          <div className="device-page__content-header">
            <p className="device-page__eyebrow">Device view</p>
            <h1>{activeSectionLabel}</h1>
            <p className="device-page__description">
              {device.name} · {device.model.name}
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
