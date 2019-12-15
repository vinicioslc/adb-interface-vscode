import * as helpers from '../adb-manager/helpers'

test('IP empty when invalid', async () => {
  // success result
  expect(helpers.extractIPRegex('192.168.1.102:5555')).toBe('192.168.1.102')
  // fail result
  expect(helpers.extractIPRegex('aa.aaa.1.102:5555')).toBe('')
})

test('IP Its Extracted Correctly', async () => {
  // success result
  expect(helpers.extractIPRegex('192.168.1.102')).toBe('192.168.1.102')
  // success result
  expect(helpers.extractIPRegex('192.168.12.102')).toBe('192.168.12.102')
})
