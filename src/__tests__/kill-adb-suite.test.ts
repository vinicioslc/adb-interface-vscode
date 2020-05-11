import { ADBChannel, ADBResultState, ADBResult } from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
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
