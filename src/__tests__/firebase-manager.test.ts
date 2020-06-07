import { ADBResultState, ADBInterfaceError } from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
import { FirebaseManagerChannel } from './../firebase-actions/index'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new FirebaseManagerChannel(cimock)
const missingArgumentsMessage = `usage: setprop NAME VALUE

Sets an Android system property.

setprop: Need 2 arguments`

const noDevicesFoundMessage = `error: no devices/emulators found`

test('No devices attached', async () => {
  try {
    cimock.setConsoleOutput(noDevicesFoundMessage)
    adbInterfaceInstance.enableFirebaseDebugView('com.package')
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('No Devices informed', async () => {
  try {
    cimock.setConsoleOutput(missingArgumentsMessage)
    adbInterfaceInstance.enableFirebaseDebugView('com.package')
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('Disable firebase debugview', async () => {
  try {
    cimock.setConsoleOutput('')
    const result = await adbInterfaceInstance.disableFirebaseDebugView()
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('Enable firebase debugview success', async () => {
  cimock.setConsoleOutput('')
  const result = await adbInterfaceInstance.enableFirebaseDebugView(
    'com.package'
  )
  expect(result.state).toStrictEqual(ADBResultState.Success)
})
