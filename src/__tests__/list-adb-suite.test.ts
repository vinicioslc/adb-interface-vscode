import { ADBChannel, ADBResultState, ADBResult } from '../adb-manager'
import { ConsoleInterfaceMock } from '../console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBChannel(cimock)

test('Test ADB Listed Devices', async () => {
  cimock.setConsoleOutput(`* daemon not running; starting now at tcp:5037
  * daemon started successfully
  List of devices attached
  
  `)
  const result = await adbInterfaceInstance.FindConnectedDevices()

  expect(typeof result).toStrictEqual(typeof Array())
})
