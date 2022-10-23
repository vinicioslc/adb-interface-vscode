import { ExecSyncOptions } from 'child_process'

export interface IConsoleInterface {
  execConsoleSync(command: string, options?: ExecSyncOptions): Buffer
  execConsoleStringSync(command: string, options?: ExecSyncOptions): string
}
