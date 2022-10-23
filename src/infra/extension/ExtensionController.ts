import { ExtensionContext, commands } from 'vscode'

import { IExtController } from './IExtController'

/**
 Standard Controller for vscode extensions
*/
export class ExtController implements IExtController {
  context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
    this.onInit(context)
  }

  /** onInit();
   *
   * Must be implemented in every controller, usually where we register the plugin commands.
   * Called when an controller are instantiated receiving current context.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onInit(context: ExtensionContext) {
    throw new Error('You must declare onInit method in ExtControllers')
  }

  async registerCommands(commands: []) {
    for await (const { name, callback } of commands) {
      this.registerCommand(name, callback)
    }
  }
  registerCommand(name: string, callback: (...args: any[]) => any) {
    const subscription = commands.registerCommand(name, callback)
    this.context.subscriptions.push(subscription)
    return this
  }

  async dispose() {
    for await (const cmd of this.context.subscriptions) {
      await cmd.dispose()
    }
  }
}
