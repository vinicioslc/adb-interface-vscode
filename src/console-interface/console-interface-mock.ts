import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

export class ConsoleInterface implements IConsoleInterface {
  _output: Buffer

  setConsoleOutput(output: string): void {
    this._output = Buffer.from(output, 'utf8')
  }

  sendConsoleSync(command: string): Buffer {
    return this._output
  }
}
