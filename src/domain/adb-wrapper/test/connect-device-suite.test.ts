import { ADBConnection } from '..'

import { MementoMock } from '../../../infra/memento/memento-mock'
import { NetHelpersMock } from '../../net-helpers/net-helpers-mock'
import { ConsoleInterfaceMock } from '../../console/console-interface/console-interface-mock'
const netHelperMock = new NetHelpersMock()
const mementoMock = new MementoMock()
const ip = '192.168.1.102'
const phoneName = 'DEVICE_NAME'

test('Connect to device with success', async () => {
  const cimock = new ConsoleInterfaceMock()
  const adbInterfaceInstance = new ADBConnection(
    cimock,
    mementoMock,
    netHelperMock
  )

  cimock.setConsoleOutput('List of devices')
  cimock.setConsoleOutput(`connected to ${ip}`)
  cimock.setConsoleOutput('PEAR_PHONE')
  cimock.returnInfinity = true
  const message = await adbInterfaceInstance.ConnectToDevice(ip, '5555')

  expect(message).toStrictEqual(`Connected to "192.168.1.102:5555"`)
})

test('Fail to connect when already connected', async () => {
  try {
    const cimock = new ConsoleInterfaceMock()
    const adbInterfaceInstance = new ADBConnection(
      cimock,
      mementoMock,
      netHelperMock
    )
    cimock.setConsoleOutput('List of devices attached')
    cimock.setConsoleOutput(`already connected to ${ip}`)
    cimock.setConsoleOutput(phoneName)
    cimock.returnInfinity = true

    await adbInterfaceInstance.ConnectToDevice(ip, '5544')
  } catch (e) {
    expect(e.message).toBe(`Already connected to "192.168.1.102:5544"`)
  }
})
