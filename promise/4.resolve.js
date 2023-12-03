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
  return new Promise(resolve => resolve(value))
}

console.log(1)
Promise.resolve(10).then(res => {
  console.log(res)
})
console.log(2)
