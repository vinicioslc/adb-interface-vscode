import { ADBConnection } from '.'
import { ConsoleInterfaceMock } from '../Infraestructure/console/console-interface/console-interface-mock'
import { MementoMock } from '../mock/memento-mock'
import { NetHelpersMock } from './../mock/net-helpers-mock'
const netHelperMock = new NetHelpersMock()
const mementoMock = new MementoMock()
const ip = '192.168.1.102'
const phoneName = 'DEVICE_NAME'

test('Connect to device with success', async () => {
  let cimock = new ConsoleInterfaceMock()
  let adbInterfaceInstance = new ADBConnection(
    cimock,
    mementoMock,
    netHelperMock
  )

  cimock.setConsoleOutput('List of devices')
  cimock.setConsoleOutput(`connected to ${ip}`)
  cimock.setConsoleOutput('PEAR_PHONE')
  cimock.returnInfinity = true
  const message = await adbInterfaceInstance.ConnectToDevice(ip)

  expect(message).toStrictEqual(`Connected to: PEAR_PHONE`)
})

test('Fail to connect when allready connected', async () => {
  try {
    let cimock = new ConsoleInterfaceMock()
    let adbInterfaceInstance = new ADBConnection(
      cimock,
      mementoMock,
      netHelperMock
    )
    cimock.setConsoleOutput('List of devices attached')
    cimock.setConsoleOutput(`already connected to ${ip}`)
    cimock.setConsoleOutput(phoneName)
    cimock.returnInfinity = true

    await adbInterfaceInstance.ConnectToDevice(ip)
  } catch (e) {
    expect(e.message).toBe(`Allready connected to: ${phoneName}`)
  }
})
