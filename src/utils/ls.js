import tryIt from 'tryit'

export const getValue = (name) => {
  let val
  tryIt(() => {
    val = window.localStorage[name]
  })
  return val
}

export const setValue = (name, val) => {
  let success = true
  tryIt(() => {
    window.localStorage[name] = val
  }, () => {
    success = false
  })
  return success
}
