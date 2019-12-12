import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

export class ConsoleInterfaceMock implements IConsoleInterface {
  private _output: Buffer

  setConsoleOutput(value: string): void {
    if (value) {
      this._output = Buffer.from(value, 'utf8')
    } else {
      this._output = Buffer.from('', 'utf8')
    }
  }

  execConsoleSync(command: string): Buffer {
    return this._output
  }
}
