export default (fn, ...args) => {
  // skip everything if we're already on main
  // making it safe to use this in bundles that
  // may already be running on main
  if (typeof window !== 'undefined') {
    fn(...args)
  } else {
    let argString = ''
    if (args.length) {
      argString = args.reduce((accum, val, index) => {
        const type = typeof val
        const isLast = index === args.length - 1
        const isFunction = type === 'function'
        if (isFunction) {
          if (isLast) {
            const id = Math.random().toString()
            accum.push(`function(err,payload){worker.postMessage({type:'callback',cbId:'${id}',once:false,error:err,payload:payload})}`)
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
