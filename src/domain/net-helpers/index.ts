/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-async-promise-executor */
import { INetHelpers } from './net-helpers-interface'

const findLocalDevices = require('local-devices')

export class NetHelpers implements INetHelpers {
  async FindLanDevices(): Promise<Array<string>> {
    const result: Array<string> = await new Promise<Array<string>>(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      async (resolve, _reject) => {
        const mappedReturn = (await findLocalDevices()).map(value => value.ip)
        resolve(mappedReturn)
      }
    )
    return result
  }
}
