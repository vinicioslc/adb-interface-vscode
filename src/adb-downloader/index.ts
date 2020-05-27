import * as os from 'os'

const getAndroidStudioPath = ({ userName, currentOS }) => {
  switch (currentOS) {
    case 'win':
      return `C:/Users/${userName}/AppData/Local/Android/Sdk/platform-tools`
    default:
      throw new TypeError('Invalid Platform')
  }
}
