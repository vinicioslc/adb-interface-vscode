import * as os from 'os'
import * as path from 'path'

export const getAndroidStudioPath = ({ osType, homeDir }) => {
  switch (osType) {
    case 'Windows_NT':
      return path.win32.join(
        homeDir,
        '/AppData/Local/Android/Sdk/platform-tools'
      )
    case 'Darwin':
      return path.posix.join(homeDir, '/Library/Android/sdk/platform-tools')
    case 'Linux':
      return path.posix.join(homeDir, '/Android/Sdk')
    default:
      throw new TypeError('Android Path Error: Invalid Platform')
  }
}

export const getDownloadADBUrl = ({ osType }) => {
  switch (osType) {
    case 'Windows_NT':
      return 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip'
    case 'Darwin':
      return 'https://dl.google.com/android/repository/platform-tools-latest-darwin.zip'
    case 'Linux':
      return 'https://dl.google.com/android/repository/platform-tools-latest-linux.zip'
    default:
      throw new TypeError('Invalid Platform')
  }
}
