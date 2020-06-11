import { ExecSyncOptions } from 'child_process'
import { IConsoleInterface } from '../console-interface/iconsole-interface'

export class ConsoleChannel {
  consoleInstance: IConsoleInterface
  constructor(instance: IConsoleInterface) {
    this.consoleInstance = instance
  }
  sendCommandSync(
    consoleCommand: string,
    options: ExecSyncOptions = null
  ): Buffer {
    return this.consoleInstance.execConsoleSync(consoleCommand, options)
  }
}

export function consoleReturnAre(output: string, expected: string): boolean {
  return output.includes(expected)
}
