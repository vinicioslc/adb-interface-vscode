import * as os from 'os'
// TODO Verificar e executar comandos adb na pasta indicada.
const getAndroidStudioPath = ({ osType, homeDir }) => {
  switch (osType) {
    case 'Windows_NT':
      return `${homeDir}/AppData/Local/Android/Sdk/platform-tools`
    case 'Darwin':
      return `${homeDir}/Library/Android/sdk/platform-tools`
    case 'Linux':
      return `${homeDir}/Android/Sdk`
    default:
      throw new TypeError('Android Path Error: Invalid Platform')
  }
}

const getDownloadADBUrl = ({ osType }) => {
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
