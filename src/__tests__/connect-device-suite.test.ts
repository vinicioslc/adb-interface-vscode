import { ADBChannel, ADBResultState, ADBResult } from '../adb-manager'
import { ConsoleInterfaceMock } from '../console-interface/console-interface-mock'
import { connect } from 'net'
import adbCommands from '../adb-manager/adb-commands'
// import { ConsoleInterface } from './../console-interface/console-interface'

// Mocked ConsoleInterface
const cimock = new ConsoleInterfaceMock()
const adbInterfaceInstance = new ADBChannel(cimock)
const testConnectToDevice = '192.168.1.100'
const testAllreadyConnected = '192.168.1.102'
const connectExistingDeviceMock = (input: string) => {
  if (input == `adb -s ${testConnectToDevice} shell getprop ro.product.model`) {
    return Buffer.from('PEAR_PHONE')
  } else if (input === adbCommands.CONNECT_IP_AND_PORT(testConnectToDevice)) {
    return Buffer.from(`connected to ${testConnectToDevice}`)
  } else if (
    input == `adb -s ${testAllreadyConnected} shell getprop ro.product.model`
  ) {
    return Buffer.from('PEAR_PHONE')
  } else if (input === `adb connect ${testAllreadyConnected}:5555`) {
    return Buffer.from(`already connected to ${testAllreadyConnected}`)
  } else {
    return Buffer.from(`fail`)
  }
}

test('Connect to device', async () => {
  cimock.setCallbackMock(connectExistingDeviceMock)
  const result = await adbInterfaceInstance.ConnectToDevice(testConnectToDevice)

  expect(result.message).toStrictEqual(`Connected to: PEAR_PHONE`)
})

test('Allready connected to ip', async () => {
  const result = await adbInterfaceInstance.ConnectToDevice(
    testAllreadyConnected
  )

  expect(result.message).toStrictEqual(
    `Allready connected to device PEAR_PHONE`
  )
})
