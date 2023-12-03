const promise = new Promise((resolve, reject) => {
  resolve("hello world")
})

Promise.prototype.finally = function (cb) {
  return this.then(
    res => {
      return Promise.resolve(cb()).then(() => res)
    },
    err => {
      return Promise.resolve(cb()).then(() => {
        throw err
      })
    }
  )
}
promise
  .finally(() => {
    console.log("finally")
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })
