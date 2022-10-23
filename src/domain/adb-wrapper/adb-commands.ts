/* istanbul ignore file */
export default {
  /**
   * Shows an list of devices attached to adb and restart adb server if it as killed before
   */
  LIST_ADB_DEVICES: () => 'adb devices',
  /**
   * Kills ADB Server needing some command to restart
   */
  ADB_KILL_SERVER: () => 'adb kill-server',
  ADB_INSTALL_APK: (
    apkFilePath = 'app.apk',
    installInSysMemory = false,
    installCanDowngrade = true,
    installOnUSB = true,
    installAsTestApk = true
  ) => {
    const onUSBdevice = installOnUSB ? ' -d' : ''
    const canDowngrade = installCanDowngrade ? ' -d' : ''
    const onSysMemory = installInSysMemory ? ' -f' : ''
    const asTestApk = installAsTestApk ? ' -t' : ''
    return `adb${onUSBdevice} install${canDowngrade}${onSysMemory}${asTestApk} "${apkFilePath}"`
  },
  ADB_DISCONNECT_ALL: () => `adb disconnect`,
  CONNECT_IP_AND_PORT: (deviceIP = '192.168.1.100', port = '5555') =>
    `adb connect ${deviceIP}:${port}`,
  RESET_PORTS: (port = '5555') => `adb tcpip ${port}`,
  GET_DEVICE_MODEL: (deviceIP = '192.168.1.100') =>
    `adb -s ${deviceIP} shell getprop ro.product.model`,
  GET_DEVICE_MANUFACTURER: (deviceIP = '192.168.1.100') =>
    `adb -s ${deviceIP} shell getprop ro.product.manufacturer`
}
