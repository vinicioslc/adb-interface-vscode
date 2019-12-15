/* istanbul ignore file */
export default {
  /**
   * Shows an list of devices attached to adb and restart adb server if it as killed before
   */
  ADB_DEVICES: () => 'adb devices',
  /**
   * Kills ADB Server needing some command to restart
   */
  ADB_KILL_SERVER: () => 'adb kill-server',
  ADB_DISCONNECT_ALL: () => `adb disconnect`,
  CONNECT_IP_AND_PORT: (deviceIP: string = '192.168.1.100', port = '5555') =>
    `adb connect ${deviceIP}:${port}`,
  RESET_PORTS: (port = 5555) => `adb tcpip ${port}`,
  SHELL_GETPROP_ROPRODUCTMODEL: (deviceIP = '192.168.1.100') =>
    `adb -s ${deviceIP} shell getprop ro.product.model`
}
