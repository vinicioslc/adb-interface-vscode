const LANScanner = require('lanscanner')

export class NetHelpers {
  static async getAllLanIPs(): Promise<Array<string>> {
    let result: Array<string> = await new Promise<Array<string>>(
      (resolve, reject) => {
        LANScanner.scan('ip').then(promiseValue => {
          //   console.log(promiseValue)
          // [
          //   { ip: '192.168.0.22', mac: 'ac:87:a3:2b:e2:ca' },
          //   { ip: '192.168.0.24', mac: 'ac:87:a3:2b:e2:ca' }
          // ]
          resolve(promiseValue)
        })
      }
    )
    return result
  }
}
