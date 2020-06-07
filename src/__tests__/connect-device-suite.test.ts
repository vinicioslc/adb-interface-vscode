import { ADBConnection, ADBInterfaceException } from '../adb-wrapper'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'

const ip = '192.168.1.102'
const phoneName = 'DEVICE_NAME'

test('Connect to device with success', async () => {
  let cimock = new ConsoleInterfaceMock()
  let adbInterfaceInstance = new ADBConnection(cimock)

  cimock.setConsoleOutput(`Android Debug Bridge`)
  cimock.setConsoleOutput(`connected to ${ip}`)
  cimock.setConsoleOutput('PEAR_PHONE')
  cimock.returnInfinity = true

  const { message } = await adbInterfaceInstance.ConnectToDevice(ip)

  expect(message).toStrictEqual(`Connected to: PEAR_PHONE`)
})

test('Fail to connect when allready connected', async () => {
  try {
    let cimock = new ConsoleInterfaceMock()
    let adbInterfaceInstance = new ADBConnection(cimock)
    cimock.returnInfinity = true
    cimock.setConsoleOutput(`Android Debug Bridge`)
    cimock.setConsoleOutput(`already connected to ${ip}`)
    cimock.setConsoleOutput(phoneName)
    await adbInterfaceInstance.ConnectToDevice(ip)
  } catch (e) {
    expect(e).toBeInstanceOf(ADBInterfaceException)
  }
})
