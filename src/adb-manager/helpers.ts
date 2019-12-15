// let ipv4PortRegex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}):*[0-9]*/gim
// let ipv4Regex = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim

export function extractIPRegex(ipAddress: string): string {
  let returned = ''
  let matches = /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.exec(
    ipAddress
  )
  if (matches != null && matches.length > 0) {
    returned = matches[0]
  }
  return returned
}

/**
 * Returns if the ipAddress contains some ip address pattern
 * @param ipAddress string to test
 */
export function isAnIPAddress(ipAddress: string): Boolean {
  return /([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/gim.test(ipAddress)
}
