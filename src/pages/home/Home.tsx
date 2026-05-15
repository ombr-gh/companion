import {
  IconSquareRotated,
  IconSquareRotatedFilled,
  IconSquareRoundedFilled,
} from '@tabler/icons-react';
import { DeviceCard } from '../../components/common';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-page__devices">
        <DeviceCard
          name="Hayden's Geo"
          model="Geo Mk1"
          modelIcon={
            <IconSquareRotated className="device-card__model-icon" size={15} />
          }
          elevated={true}
          signalStrength={4}
          connected={true}
        />

        <DeviceCard
          name="Daniel's Geo"
          model="Geo Mk2"
          modelIcon={
            <IconSquareRotatedFilled className="device-card__model-icon" size={15} />
          }
          elevated={true}
          signalStrength={5}
          connected={true}
        />

        <DeviceCard
          name="Max's Geo"
          model="Geo Mk3"
          modelIcon={
            <IconSquareRoundedFilled className="device-card__model-icon" size={15} />
          }
          elevated={true}
          signalStrength={3}
          connected={true}
        />
      </div>
    </div>
  );
}
