import {
  IconAntennaBars1,
  IconAntennaBars2,
  IconAntennaBars3,
  IconAntennaBars4,
  IconAntennaBars5,
  IconAntennaBarsOff,
  IconBluetooth,
  IconBluetoothOff,
} from '@tabler/icons-react';
import './DeviceCard.css';

export interface DeviceCardProps {
  name: string;
  onClick?: () => void;
  elevated?: boolean;
  signalStrength: number; // 0 to 5
  connected: boolean;
}

export const DeviceCard = ({
  name,
  onClick,
  elevated = false,
  signalStrength,
  connected,
}: DeviceCardProps) => {
  return (
    <div
      className={`device-card ${elevated ? 'card--elevated' : ''}`}
      onClick={onClick}
    >
      <div className="device-card__meta">
        <span className="device-card__name">{name}</span>
        <div className="device-card__status-icons" aria-label="Device status">
          <span className="device-card__status-icon" title="Wireless signal">
            {signalStrength >= 5 ? (
              <IconAntennaBars5 size={16} />
            ) : signalStrength === 4 ? (
              <IconAntennaBars4 size={16} />
            ) : signalStrength === 3 ? (
              <IconAntennaBars3 size={16} />
            ) : signalStrength === 2 ? (
              <IconAntennaBars2 size={16} />
            ) : signalStrength === 1 ? (
              <IconAntennaBars1 size={16} />
            ) : (
              <IconAntennaBarsOff size={16} style={{ opacity: 0.3 }} />
            )}
          </span>
          {connected ? (
            <span className="device-card__status-icon" title="Bluetooth">
              <IconBluetooth size={16} />
            </span>
          ) : (
            <span className="device-card__status-icon" title="Not connected">
              <IconBluetoothOff size={16} style={{ opacity: 0.3 }} />
            </span>
          )}
        </div>
      </div>

      <div className="device-card__hero" role="img" aria-label={`${name} mouse`}>
        <div className="device-card__mouse"></div>
      </div>
    </div>
  );
};
