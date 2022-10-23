import { execSync, ExecSyncOptions, exec } from 'child_process'
import { resolve } from 'url'
import { IConsoleInterface } from './iconsole-interface'

export class ConsoleInterface implements IConsoleInterface {
  execConsoleSync(command: string, options: ExecSyncOptions = null): Buffer {
    console.log('Executed ', command)
    return execSync(command, options)
  }
  execConsoleStringSync(
    command: string,
    options: ExecSyncOptions = null
  ): string {
    return this.execConsoleSync(command, options).toString()
  }
}
