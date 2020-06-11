import { ExtensionContext, commands, Disposable, Command } from 'vscode'

import { IExtController } from './IExtController'

/**
 Standard Controller for vscode extensions
*/
export class ExtController implements IExtController, Disposable {
  context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
    this.onInit()
  }

  async onInit(): Promise<void> {
    throw new Error('You must declare onInit method in ExtControllers')
  }

  async registerCommands(commands: []) {
    for await (const { name, callback } of commands) {
      this.registerCommand(name, callback)
    }
  }

  async registerCommand(name: string, callback: (...args: any[]) => any) {
    let subscription = commands.registerCommand(name, callback)
    this.context.subscriptions.push(subscription)
  }

  async dispose() {
    for await (const cmd of this.context.subscriptions) {
      await cmd.dispose()
    }
  }
}
