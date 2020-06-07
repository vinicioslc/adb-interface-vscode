import {
  ADBConnection,
  ADBResultState,
  ADBResult,
  ADBInterfaceError
} from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBConnection(cimock)

test('Test ADB Server has killed', async () => {
  const expected = new ADBResult(ADBResultState.Success, 'ADB Server killed')
  try {
    cimock.setConsoleOutput('')
    cimock.setConsoleOutput(`Android Debug Bridge`)

    const result = await adbInterfaceInstance.KillADBServer()
    expect(JSON.stringify(result)).toBe(JSON.stringify(expected))
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})
