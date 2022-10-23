import * as globalStateKeys from '../../config/global-state-keys'

export class ADBPathManager {
  private _storage: any
  constructor(currentStorage: any) {
    this._storage = currentStorage
  }

  setFilePath(path: string) {
    return this._storage.update(globalStateKeys.customADBPathKey(), path)
  }
  getCustomPath(): any {
    return this._storage.get(globalStateKeys.customADBPathKey(), undefined)
  }
}
