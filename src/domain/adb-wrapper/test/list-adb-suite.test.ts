import { ADBConnection } from '..'

import { MementoMock } from '../../../infra/memento/memento-mock'
import { NetHelpersMock } from '../../net-helpers/net-helpers-mock'
import { ConsoleInterfaceMock } from '../../console/console-interface/console-interface-mock'

const mementoMock = new MementoMock()
const netHelperMock = new NetHelpersMock()

test('list all devices returning empty array', async () => {
  const cimock = new ConsoleInterfaceMock()
  const adbInterfaceInstance = new ADBConnection(
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

  const result = await adbInterfaceInstance.FindConnectedDevices()

  expect(result instanceof Array).toBe(true)
}, 12000)
