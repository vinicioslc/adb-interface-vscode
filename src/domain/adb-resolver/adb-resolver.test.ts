import { ADBResolver, ADBNotFoundError } from './index'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
import { MementoMock } from '../../infra/memento/memento-mock'

const adbFound = `List of devices`
const mementoMock = new MementoMock()

test('Should return current home dir when path is present', async () => {
  const cimock = new ConsoleInterfaceMock()
  cimock.setConsoleOutput('')
  cimock.setConsoleOutput(adbFound)

  const adbResolver = new ADBResolver(
    'c:',
    'Linux',
    cimock,
    mementoMock
  )

  expect(await adbResolver.getDefaultADBPath()).toBe('c:/Android/Sdk')
})

test('ADB Not founded in system Exception', () => {
  try {
    const cimock = new ConsoleInterfaceMock()
    cimock.setConsoleOutput(`Invalid Return`)
    new ADBResolver('c:', 'Linux', cimock, mementoMock)
  } catch (error) {
    expect(error).toBeInstanceOf(ADBNotFoundError)
  }
})

test('Should return path to adb', async () => {
  const cimock = new ConsoleInterfaceMock()
  cimock.returnInfinity = false
  cimock.setConsoleOutput(`Invalid Return`)
  cimock.setConsoleOutput(adbFound)
  const adbResolver = new ADBResolver('c:', 'Linux', cimock, mementoMock)

  expect(await adbResolver.getDefaultADBPath()).toBe('c:/Android/Sdk')
})
