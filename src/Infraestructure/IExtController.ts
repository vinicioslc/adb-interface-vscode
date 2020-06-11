import { Disposable } from 'vscode'
import { ExtensionContext } from 'vscode'

export interface IExtController {
  readonly context: ExtensionContext

  /**Reposible for register this controller on vscode  */
  onInit(): Promise<void>

  /**
   * Register command in vscode extensions
   */
  registerCommand(name, callback): Promise<void>

  /**
   * Dispose this controller instance
   */
  dispose(command: Disposable): Promise<void>
}
