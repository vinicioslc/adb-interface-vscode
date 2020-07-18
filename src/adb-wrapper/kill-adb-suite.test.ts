import { ADBConnection, ADBInterfaceError } from '.'
import { ConsoleInterfaceMock } from '../Infraestructure/console/console-interface/console-interface-mock'
import { MementoMock } from '../mock/memento-mock'
import { NetHelpersMock } from './../mock/net-helpers-mock'
const mementoMock = new MementoMock()
const netHelperMock = new NetHelpersMock()

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBConnection(
  cimock,
  mementoMock,
  netHelperMock
)

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
