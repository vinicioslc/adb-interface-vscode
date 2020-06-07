import * as os from 'os'
import { ADBResolver, ADBNotFoundError } from './index'
import { ConsoleInterfaceMock } from '../console/console-interface/console-interface-mock'
const adbInEnvReturn = `Android Debug Bridge version 1.0.41
Version 29.0.1-5644136
Installed as C:\Users\vinic\AppData\Local\Android\Sdk\platform-tools\adb.exe

global options:`

test('Should return current home dir when path is present', async () => {
  const consoleMock = new ConsoleInterfaceMock()
  consoleMock.setConsoleOutput(adbInEnvReturn)
  const adbResolver = new ADBResolver(os.homedir(), os.type(), consoleMock)

  expect(await adbResolver.getDefaultADBPath()).toBe(os.homedir())
})

test('Throw error when nothing found', () => {
  try {
    const consoleMock = new ConsoleInterfaceMock()
    consoleMock.setConsoleOutput(`Invalid Return`)
    const adbResolver = new ADBResolver(os.homedir(), os.type(), consoleMock)
  } catch (error) {
    expect(error).toBeInstanceOf(ADBNotFoundError)
  }
})

test('Should return path to adb', async () => {
  const consoleMock = new ConsoleInterfaceMock()
  consoleMock.returnInfinity = false
  consoleMock.setConsoleOutput(`Invalid Return`)
  consoleMock.setConsoleOutput(adbInEnvReturn)
  const adbResolver = new ADBResolver('yourhome', 'Linux', consoleMock)
  let adbPath = await adbResolver.getDefaultADBPath()
  expect(adbPath).toBe('yourhome/Android/Sdk')
})
