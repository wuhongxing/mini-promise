const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

// 处理嵌套 promise
function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError("Chaining cycle detected for promise"))
  } else if ((typeof x === "object" && x !== null) || typeof x === "function") {
    let called = false
    try {
      const then = x.then
      if (typeof then === "function") {
        then.call(
          x,
          y => {
            if (called) return
            called = true
            resolvePromise(x, y, resolve, reject)
          },
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } else {
        if (called) return
        called = true
        resolve(x)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(x)
  }
}

function runMicroTask(fn) {
  if (typeof global.nextTick === "function") {
    global.nextTick(fn)
  } else if (typeof MutationObserver === "function") {
    const help = document.createElement("div")
    const ob = new MutationObserver(fn)
    ob.observe(help, { attributes: true })

    // Trigger the observer by modifying the attributes of the div.
    help.setAttribute("data-mutation-observer", "trigger")
  } else {
    setTimeout(fn, 0)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onFulfilledCallbacks = []
    this.onRejectedCallbacks = []

    let resolve = value => {
      if (this.status !== PENDING) return

      this.status = FULFILLED
      this.value = value
      this.onFulfilledCallbacks.forEach(fn => fn())
    }
    let reject = reason => {
      if (this.status !== PENDING) return

      this.status = REJECTED
      this.reason = reason
      this.onRejectedCallbacks.forEach(fn => fn())
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onfulfilled, onrejected) {
    onfulfilled =
      typeof onfulfilled === "function" ? onfulfilled : value => value
    onrejected =
      typeof onrejected === "function"
        ? onrejected
        : reason => {
            throw reason
          }

    const promise = new Promise((resolve, reject) => {
      const handleFulfilled = () => {
        // 不可以放到同一上下文中，不然的话 promise 也无法读取到
        runMicroTask(() => {
          try {
            const x = onfulfilled(this.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      const handleRejected = () => {
        runMicroTask(() => {
          try {
            const x = onrejected(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }
      if (this.status === FULFILLED) {
        handleFulfilled()
      }
      if (this.status === REJECTED) {
        handleRejected()
      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(handleFulfilled)
        this.onRejectedCallbacks.push(handleRejected)
      }
    })
    return promise
  }
}

Promise.defer = Promise.deferred = function () {
  let dfs = {}
  dfs.promise = new Promise((resolve, reject) => {
    dfs.resolve = resolve
    dfs.reject = reject
  })
  return dfs
}

module.exports = Promise
