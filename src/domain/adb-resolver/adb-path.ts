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
