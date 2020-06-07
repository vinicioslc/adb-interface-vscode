import { execSync, ExecSyncOptions } from 'child_process'
import { IConsoleInterface } from './iconsole-interface'

export class ConsoleInterface implements IConsoleInterface {
  execConsoleSync(command: string, options: ExecSyncOptions = null): Buffer {
    return execSync(command, options)
  }
}
