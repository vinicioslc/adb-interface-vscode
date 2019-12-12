import { ADBChannel, ADBResultState, ADBResult } from '../ADB-Interface'
import { ConsoleInterfaceMock } from '../console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBChannel(cimock)

test('Test ADB Server has killed', async () => {
  cimock.setConsoleOutput('')
  let result = await adbInterfaceInstance.KillADBServer()

  let expected = await new ADBResult(
    ADBResultState.Success,
    'ADB Server killed'
  )

  expect(JSON.stringify(result)).toBe(JSON.stringify(expected))
})

test('Test ADB Listed Devices', async () => {
  const str = `* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached

`
  cimock.setConsoleOutput(str)
  let result = await adbInterfaceInstance.GetConnectedDevices()

  expect(typeof result).toStrictEqual(typeof Array())
})
