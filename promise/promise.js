const PENDING = "pending"
const FULFILLED = "fulfilled"
const REJECTED = "rejected"

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
      if (this.status === FULFILLED) {
        // 不可以放到同一上下文中，不然的话 promise 也无法读取到
        setTimeout(() => {
          try {
            const x = onfulfilled(this.value)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onrejected(this.reason)
            resolvePromise(promise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() =>
          setTimeout(() => {
            try {
              const x = onfulfilled(this.value)
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        )
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onrejected(this.reason)
              resolvePromise(promise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
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
