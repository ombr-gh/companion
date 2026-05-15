export type DeviceModelId = 'geo-mk1' | 'geo-mk2' | 'geo-mk3';

export interface DeviceModel {
  id: DeviceModelId;
  name: string;
}

export interface DeviceInfo {
  id: string;
  name: string;
  model: DeviceModel;
  signalStrength: number;
  connected: boolean;
  statusLabel: string;
  location: string;
  lastSeenMinutesAgo: number;
  firmware: string;
  batteryPercent: number;
  temperatureC: number;
  uptimeHours: number;
  pairingState: string;
  activity: string;
}

export const deviceModels: Record<DeviceModelId, DeviceModel> = {
  'geo-mk1': { id: 'geo-mk1', name: 'Geo Mk1' },
  'geo-mk2': { id: 'geo-mk2', name: 'Geo Mk2' },
  'geo-mk3': { id: 'geo-mk3', name: 'Geo Mk3' },
};

export function getModelName(model: DeviceModel | DeviceModelId) {
  return typeof model === 'string' ? deviceModels[model].name : model.name;
}

export function formatLastSeen(minutesAgo: number) {
  return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
}

export function formatUptime(hours: number) {
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (days === 0) {
    return `${hours} hours`;
  }

  return `${days} days ${remainingHours} hours`;
}

export const devices: DeviceInfo[] = [
  {
    id: 'haydens-geo',
    name: "Hayden's Geo",
    model: deviceModels['geo-mk1'],
    signalStrength: 4,
    connected: true,
    statusLabel: 'Online and reporting normally',
    location: 'North Terrace, Portland',
    lastSeenMinutesAgo: 2,
    firmware: 'v2.8.4',
    batteryPercent: 84,
    temperatureC: 21.4,
    uptimeHours: 412,
    pairingState: 'Paired with phone and desktop',
    activity: 'Collected 124 new location samples today',
  },
  {
    id: 'daniels-geo',
    name: "Daniel's Geo",
    model: deviceModels['geo-mk2'],
    signalStrength: 5,
    connected: true,
    statusLabel: 'Strong connection and healthy battery',
    location: 'Studio District, Seattle',
    lastSeenMinutesAgo: 1,
    firmware: 'v3.0.1',
    batteryPercent: 91,
    temperatureC: 20.1,
    uptimeHours: 227,
    pairingState: 'Linked to companion and cloud sync',
    activity: 'Completed a route sync 12 minutes ago',
  },
  {
    id: 'maxs-geo',
    name: "Max's Geo",
    model: deviceModels['geo-mk3'],
    signalStrength: 3,
    connected: true,
    statusLabel: 'Stable connection with moderate signal strength',
    location: 'Harbor Walk, San Francisco',
    lastSeenMinutesAgo: 3,
    firmware: 'v2.9.7',
    batteryPercent: 76,
    temperatureC: 22,
    uptimeHours: 138,
    pairingState: 'Paired and awaiting a firmware update',
    activity: 'Logged 18 handoffs in the last hour',
  },
];

export const getDeviceById = (deviceId: string) => {
  return devices.find((device) => device.id === deviceId);
};
