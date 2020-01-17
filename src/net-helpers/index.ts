const find = require('local-devices')

export class NetHelpers {
  static async FindLanDevices(): Promise<Array<string>> {
    let result: Array<string> = await new Promise<Array<string>>(
      async (resolve, reject) => {
        const mappedReturn = (await find()).map(value => value.ip)
        resolve(mappedReturn)
      }
    )
    return result
  }
}
