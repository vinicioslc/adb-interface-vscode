/**
 * Helpers for manipulate IP String Addresses
 */
export class IPHelpers {
  static ipv4Regex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim
  static minimumAcceptableMatches = 0
  /**
   * Returns ip extracted from given text else not found  return null
   */
  static extractIPRegex(ipAddress: string): string {
    let returned = null
    const matches = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.exec(
      ipAddress
    )
    if (matches && matches.length > this.minimumAcceptableMatches) {
      returned = matches[0]
    } else {
      returned = null
    }
    return returned
  }

  /**
   * Returns if the ipAddress contains some ip address pattern
   * @param ipAddress string to test
   */
  static isAnIPAddress(ipAddress: string): boolean {
    return /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.test(ipAddress)
  }
}
