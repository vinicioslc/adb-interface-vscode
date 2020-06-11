import { ADBConnection, ADBInterfaceError } from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBConnection(cimock)

test('Test ADB Server has killed', async () => {
  const expected = 'ADB Server killed'
  try {
    cimock.setConsoleOutput('List of devices')
    cimock.setConsoleOutput('')
    cimock.setConsoleOutput('List of devices')

    const result = await adbInterfaceInstance.KillADBServer()
    expect(result).toBe(expected)
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceError)
  }
})
