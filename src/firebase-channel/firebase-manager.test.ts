import { ADBInterfaceError } from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../Infraestructure/console/console-interface/console-interface-mock'
import { FirebaseManagerChannel } from './index'

// Mocked ConsoleInterface
const missingArgumentsMessage = `usage: setprop NAME VALUE

Sets an Android system property.

setprop: Need 2 arguments`

const noDevicesFoundMessage = `error: no devices/emulators found`

test('No devices attached', async () => {
  try {
    const cimock = new ConsoleInterfaceMock()
    const adbInterfaceInstance = new FirebaseManagerChannel(cimock)
    cimock.setConsoleOutput('List of devices attached')
    await cimock.setConsoleOutput(noDevicesFoundMessage)
    await adbInterfaceInstance.enableFirebaseDebugView('com.package')
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('No Devices informed', async () => {
  try {
    const cimock = new ConsoleInterfaceMock()
    const adbInterfaceInstance = new FirebaseManagerChannel(cimock)
    cimock.setConsoleOutput('List of devices attached')
    cimock.setConsoleOutput(missingArgumentsMessage)
    adbInterfaceInstance.enableFirebaseDebugView('')
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('Disable firebase debugview', async () => {
  try {
    const cimock = new ConsoleInterfaceMock()
    const adbInterfaceInstance = new FirebaseManagerChannel(cimock)
    cimock.setConsoleOutput('List of devices attached')
    cimock.setConsoleOutput('')
    await adbInterfaceInstance.disableFirebaseDebugView()
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})

test('Enable firebase debugview success', async () => {
  const cimock = new ConsoleInterfaceMock()
  cimock.setConsoleOutput('List of devices attached')
  cimock.setConsoleOutput(' ')
  const adbInterfaceInstance = new FirebaseManagerChannel(cimock)
  const result = await adbInterfaceInstance.enableFirebaseDebugView(
    'com.package'
  )
  expect(result).toStrictEqual(
    `Setted firebase debug mode to [com.package] app`
  )
})
