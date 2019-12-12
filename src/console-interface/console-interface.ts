import { execSync } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

export class ConsoleInterface implements IConsoleInterface {
  sendConsoleSync(command: string): Buffer {
    return execSync(command)
  }
}
