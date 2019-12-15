import helpers from '../adb-manager/helpers'

test('IP Its Extracted Correctly', async () => {
  // success result
  expect(helpers.extractIPRegex('192.168.1.102:5555')).toBe('192.168.1.102')
  // fail result
  expect(helpers.extractIPRegex('aa.aaa.1.102:5555')).toBe('')
})
