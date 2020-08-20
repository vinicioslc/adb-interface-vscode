import { ADBConnection, ADBInterfaceError } from '..'

import { MementoMock } from '../../../infra/memento/memento-mock'
import { NetHelpersMock } from '../../net-helpers/net-helpers-mock'
import { ConsoleInterfaceMock } from '../../console/console-interface/console-interface-mock'
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
