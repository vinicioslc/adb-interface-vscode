import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'
import { isArray } from 'util'

interface ConsoleCallback {
  (myArgument: string): Buffer
}

export class ConsoleInterfaceMock implements IConsoleInterface {
  private _output: Buffer
  private _callback: ConsoleCallback
  private _returnStack: Array<Buffer> = []
  public returnInfinity: boolean = true

  constructor() {
    this._output = Buffer.from('')
    this._callback = null
  }

  setConsoleOutput(value: string): void {
    return this.pushToReturnStack(
      value ? Buffer.from(value, 'utf8') : Buffer.from('', 'utf8')
    )
  }

  pushToReturnStack(toReturn: Array<Buffer> | Buffer) {
    if (isArray(toReturn)) {
      toReturn.forEach(element => {
        this._returnStack.push(element)
      })
    } else {
      this._returnStack.push(toReturn)
    }
  }

  setCallbackMock(callback: ConsoleCallback): void {
    this._callback = callback
  }

  execConsoleSync(command: string): Buffer {
    if (this._callback != null) {
      return this._callback(command)
    }
    if (this.returnInfinity)
      return this._returnStack[this._returnStack.length - 1]
    else return this._returnStack.shift()
  }
}
