/* istanbul ignore file */
export default {
  CONNECTED_TO: () => 'connected to',
  DISCONNECTED_EVERTHING: () => 'disconnected everything',
  RESTARTING_PORT: (port = '5555') => `restarting in TCP mode port: ${port}`,
  MISSING_PORT: (ipAddress = '192.168.1.100') =>
    `* daemon not running; starting now at tcp:5037
* daemon started successfully
missing port in specification: tcp:${ipAddress}`,
  CONNECTION_REFUSED: (ipAddress = '192.168.1.100', port = '5555') =>
    `cannot connect to ${ipAddress}:${port}: No connection could be made because the target machine actively refused it. (10061)`,
  LISTING_DEVICES: () => 'List of devices attached',
  NO_DEVICES_FOUND: () => `error: no devices/emulators found`,
  ALREADY_CONNECTED_TO: () => 'already connected to',
  ADB_KILLED_SUCCESS_RETURN: () => '',
  APK_INSTALLED_SUCCESS: () => 'Success'
}
