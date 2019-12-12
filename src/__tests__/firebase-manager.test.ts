import { ADBChannel, ADBResultState, ADBResult } from '../adb-manager'
import { ConsoleInterfaceMock } from '../console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'
import { FirebaseManagerChannel } from './../firebase-actions/index'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new FirebaseManagerChannel(cimock)

test('No devices attached', async () => {
  cimock.setConsoleOutput(`error: no devices/emulators found`)
  const result = await adbInterfaceInstance.enableFirebaseDebugView(
    'com.package'
  )
  expect(result.state).toStrictEqual(4)
})

test('No Devices informed', async () => {
  cimock.setConsoleOutput(`usage: setprop NAME VALUE

Sets an Android system property.

setprop: Need 2 arguments`)

  const result = await adbInterfaceInstance.enableFirebaseDebugView(
    'com.package'
  )
  expect(result.state).toStrictEqual(ADBResultState.Error)
})

test('Disable firebase debugview', async () => {
  cimock.setConsoleOutput('')
  const result = await adbInterfaceInstance.disableFirebaseDebugView()

  expect(result.state).toStrictEqual(ADBResultState.Success)
})
