const isPromise = value => {
  if (
    (typeof value === "object" && value !== null) ||
    typeof value === "function"
  ) {
    if (typeof value.then === "function") return true
  }
  return false
}

Promise.prototype.resolve = value => {
  if (isPromise(value)) return value
  return value
}

Promise.resolve(
  new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("1")
      resolve(100)
    }, 1000)
  })
).then(res => {
  console.log(res)
})
