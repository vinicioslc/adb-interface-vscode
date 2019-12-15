export default {
  extractIPRegex(ipAddress: string): string {
    const regexIP = /([\d]+\.[\d]+\.[\d]+\.[\d]+)/gim
    var matches = regexIP.exec(ipAddress) || ['']
    return matches[0]
  }
}
