import { INetHelpers } from './net-helpers-interface'

const findLocalDevices = require('local-devices')

export class NetHelpers implements INetHelpers {
  async FindLanDevices(): Promise<Array<string>> {
    let result: Array<string> = await new Promise<Array<string>>(
      async (resolve, reject) => {
        const mappedReturn = (await findLocalDevices()).map(value => value.ip)
        resolve(mappedReturn)
      }
    )
    return result
  }
}
