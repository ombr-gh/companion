import {
  IconSquareRotated,
  IconSquareRotatedFilled,
  IconSquareRoundedFilled,
} from '@tabler/icons-react';
import { DeviceCard } from '../../components/common';
import { devices, type DeviceInfo } from '../../lib/devices';
import './Home.css';

interface HomeProps {
  onOpenDevice: (device: DeviceInfo) => void;
}

const getDeviceModelIcon = (modelId: string) => {
  switch (modelId) {
    case 'geo-mk1':
      return <IconSquareRotated size={15} />;
    case 'geo-mk2':
      return <IconSquareRotatedFilled size={15} />;
    case 'geo-mk3':
      return <IconSquareRoundedFilled size={15} />;
    default:
      return null;
  }
};

export default function Home({ onOpenDevice }: HomeProps) {
  return (
    <div className="home-page">
      <div className="home-page__devices">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            name={device.name}
            model={device.model.name}
            modelIcon={getDeviceModelIcon(device.model.id)}
            elevated={true}
            signalStrength={device.signalStrength}
            connected={device.connected}
            onClick={() => onOpenDevice(device)}
          />
        ))}
      </div>
    </div>
  );
}
