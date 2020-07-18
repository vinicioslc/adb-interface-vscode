import { INetHelpers } from '../Infraestructure/net-helpers/net-helpers-interface'

export class NetHelpersMock implements INetHelpers {
  async FindLanDevices(): Promise<Array<string>> {
    let result: Array<string> = []
    return result
  }
}
