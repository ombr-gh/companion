export type DeviceModelId = 'geo-mk1' | 'geo-mk2' | 'geo-mk3';

export interface DeviceModel {
  id: DeviceModelId;
  name: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  modelId: DeviceModelId;
  address: string;
  rssi: number | null;
  signalStrength: number;
  connected: boolean;
  connectable: boolean;
  lastSeenSecondsAgo: number;
  txPowerLevel: number | null;
  manufacturerData: string[];
  serviceUuids: string[];
}

export const DEVICE_MODELS: Record<DeviceModelId, DeviceModel> = {
  'geo-mk1': { id: 'geo-mk1', name: 'Geo Mk1' },
  'geo-mk2': { id: 'geo-mk2', name: 'Geo Mk2' },
  'geo-mk3': { id: 'geo-mk3', name: 'Geo Mk3' },
};

export function signalStrengthLabel(signalStrength: number) {
  if (signalStrength >= 5) {
    return 'Excellent';
  }

  if (signalStrength === 4) {
    return 'Strong';
  }

  if (signalStrength === 3) {
    return 'Good';
  }

  if (signalStrength === 2) {
    return 'Weak';
  }

  if (signalStrength === 1) {
    return 'Very weak';
  }

  return 'No signal';
}

export function formatLastSeen(secondsAgo: number) {
  if (secondsAgo < 5) {
    return 'Just now';
  }

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }

  const minutesAgo = Math.max(1, Math.round(secondsAgo / 60));

  return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
}

export function formatRssi(rssi: number | null) {
  if (rssi === null) {
    return 'Unavailable';
  }

  return `${rssi} dBm`;
};
