import { Memento } from 'vscode'
export class MementoMock implements Memento {
  valueToReturn: any = undefined
  get<T>(key: string): T
  get<T>(key: string, defaultValue: T): T
  get(key: any, defaultValue?: any) {
    return this.valueToReturn
  }
  /**
   * Store a value. The value must be JSON-stringifyable.
   *
   * @param key A string.
   * @param value A value. MUST not contain cyclic references.
   */
  update(key: string, value: any): Thenable<void> {
    this.valueToReturn = value
    return new Promise((res, rej) => {
      return res(this.valueToReturn)
    })
  }
}
