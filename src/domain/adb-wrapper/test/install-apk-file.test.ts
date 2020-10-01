import { ADBConnection, ADBInterfaceError, ADBInterfaceException } from '..'

import { MementoMock } from '../../../infra/memento/memento-mock'
import { NetHelpersMock } from '../../net-helpers/net-helpers-mock'
import { ConsoleInterfaceMock } from '../../console/console-interface/console-interface-mock'
const mementoMock = new MementoMock()
const netHelperMock = new NetHelpersMock()

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBConnection(
  cimock,
  mementoMock,
  netHelperMock
)

test('APK File installed successfully', async () => {
  const expected = `Installed "C:/file.apk" with success`
  // try {
  cimock.setConsoleOutput('List of devices')
  cimock.setConsoleOutput(`Performing Streamed Install
Success`)

  const result = await adbInterfaceInstance.InstallApkOnDevice('C:/file.apk')
  expect(result).toBe(expected)
  // } catch (e) {
  //   expect(e).toBeInstanceOf(ADBInterfaceError)
  // }
})

test('Throw exception when not found devices', async () => {
  const expected = `Installed "C:/file.apk" with success`
  try {
    cimock.setConsoleOutput('List of devices')
    cimock.setConsoleOutput(`Performing Push Install
adb: error: failed to get feature set: no devices found`)

    const result = await adbInterfaceInstance.InstallApkOnDevice('C:/file.apk')
    expect(result).toBe(expected)
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceException)
  }
})

test('Throw Error when not found devices', async () => {
  const expected = `Installed "C:/file.apk" with success`
  try {
    cimock.setConsoleOutput('List of devices')
    cimock.setConsoleOutput(`Performing Streamed Install
adb: failed to install C:/file.apk`)

    const result = await adbInterfaceInstance.InstallApkOnDevice('C:/file.apk')
    expect(result).toBe(expected)
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})
