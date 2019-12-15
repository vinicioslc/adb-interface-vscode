import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

interface ConsoleCallback {
  (myArgument: string): Buffer
}

export class ConsoleInterfaceMock implements IConsoleInterface {
  private _output: Buffer
  private _callback: ConsoleCallback

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

  setCallbackMock(callback: ConsoleCallback): void {
    this._callback = callback
  }

  execConsoleSync(command: string): Buffer {
    if (this._callback != null) {
      return this._callback(command)
    }
    return this._output
  }
}
