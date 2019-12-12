import { ADBInterface, ADBResultState, ADBResult } from './../adb-actions'

test('Kill ADB Server', async () => {
  let result = await ADBInterface.KillADBServer()
  let expected = await new ADBResult(
    ADBResultState.Success,
    'ADB Server killed'
  )
  expect(result).toStrictEqual(expected)
})
