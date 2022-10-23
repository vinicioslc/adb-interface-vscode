import { Memento } from 'vscode'
export class MementoMock implements Memento {
  _keys = []
  constructor() {
    this._keys = []
  }

  keys(): readonly string[] {
    return this._keys
  }

  valueToReturn: any = undefined
  get<T>(key: string): T
  get<T>(key: string, defaultValue: T): T
  get() {
    return this.valueToReturn
  }
  /**
   * Store a value. The value must be JSON-stringifyable.
   *
   * @param key A string.
   * @param value A value. MUST not contain cyclic references.
   */
  update(key: string, value: any): Thenable<void> {
    this._keys.push(key)
    const mapped = {}

    this._keys.forEach(key => {
      if (!mapped[key]) {
        mapped[key] = key
      }
    })
    this._keys = []
    for (const key in mapped) {
      if (Object.prototype.hasOwnProperty.call(mapped, key)) {
        this._keys.push(key)
      }
    }

    this.valueToReturn = value
    return new Promise(res => {
      return res(this.valueToReturn)
    })
  }
}
