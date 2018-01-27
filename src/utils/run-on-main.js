export default (fn, ...args) => {
  if (typeof window !== 'undefined') {
    fn(...args)
  } else {
    const last = args.slice(-1)[0]
    let argString = ''
    if (typeof last !== 'undefined') {
      argString = args.reduce((accum, val, index) => {
        const type = typeof val
        const isLast = index === args.length - 1
        const isFunction = type === 'function'
        if (isFunction) {
          if (isLast) {
            const id = Math.random().toString()
            accum.push(`function(err,payload){worker.postMessage({type:'callback',cbId:'${id}',error:err,payload:payload})}`)
            self[id] = (data) => val(data.error, data.payload)
          } else {
            accum.push(val.toString())
          }
        } else {
          accum.push(JSON.stringify(val))
        }
        return accum
      }, []).join(',')
    }
    const serializedFn = fn.toString()
    self.postMessage(`return (${serializedFn})(${argString})`)
  }
}
