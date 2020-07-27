import { ADBConnection } from '..'
import { ConsoleInterfaceMock } from '../../../infraestructure/console/console-interface/console-interface-mock'
import { MementoMock } from '../../memento/memento-mock'
import { NetHelpersMock } from '../../net-helpers/net-helpers-mock'

const mementoMock = new MementoMock()
const netHelperMock = new NetHelpersMock()

test('list all devices returning empty array', async () => {
  let cimock = new ConsoleInterfaceMock()
  let adbInterfaceInstance = new ADBConnection(
    cimock,
    mementoMock,
    netHelperMock
  )
  cimock.setConsoleOutput('List of devices')
  cimock.setConsoleOutput(`* starting now at tcp:5037
  * daemon started successfully
  List of devices attached    
  2ab7dcd77d04    unauthorized
  `)
  cimock.setConsoleOutput(`PEAR_PHONE`)
  cimock.returnInfinity = true

  let result = await adbInterfaceInstance.FindConnectedDevices()

  expect(result instanceof Array).toBe(true)
}, 12000)
