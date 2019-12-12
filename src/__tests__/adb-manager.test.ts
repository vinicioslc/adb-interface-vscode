import { ADBChannel, ADBResultState, ADBResult } from '../adb-manager'
import { ConsoleInterfaceMock } from '../console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBChannel(cimock)

test('Test ADB Server has killed', async () => {
  cimock.setConsoleOutput('')
  const result = await adbInterfaceInstance.KillADBServer()

  const expected = await new ADBResult(
    ADBResultState.Success,
    'ADB Server killed'
  )

  expect(JSON.stringify(result)).toBe(JSON.stringify(expected))
})

test('Test ADB Listed Devices', async () => {
  cimock.setConsoleOutput(`* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached

`)
  const result = await adbInterfaceInstance.GetConnectedDevices()

  expect(typeof result).toStrictEqual(typeof Array())
})
