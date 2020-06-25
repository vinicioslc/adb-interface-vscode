import { Disposable } from 'vscode'
import { ExtensionContext } from 'vscode'

export interface IExtController {
  readonly context: ExtensionContext

  /**Reposible for register this controller on vscode  */
  onInit(context: ExtensionContext): Promise<void>

  /**
   * Register command in vscode extensions
   */
  registerCommand(name, callback): IExtController

  /**
   * Dispose this controller instance
   */
  dispose(command: Disposable): Promise<void>
}
