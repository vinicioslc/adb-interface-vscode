import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

interface consoleCallback {
  (myArgument: string): Buffer
}

export class ConsoleInterfaceMock implements IConsoleInterface {
  private _output: Buffer
  private _callback: consoleCallback

  constructor() {
    this._output = Buffer.from('')
    this._callback = null
  }

  setConsoleOutput(value: string): void {
    if (value) {
      this._output = Buffer.from(value, 'utf8')
    } else {
      this._output = Buffer.from('', 'utf8')
    }
  }

  setCallbackMock(callback: consoleCallback): void {
    this._callback = callback
  }

  execConsoleSync(command: string): Buffer {
    if (this._callback) {
      return this._callback(command)
    }
    return this._output
  }
}
