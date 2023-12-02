const Promise = require("./promise")
const promise = new Promise((resolve, reject) => {
  console.log(1)
  // setTimeout(() => {
  //   resolve("success")
  // }, 1000)
  resolve("success")
})
promise.then(value => {
  console.log(value, 3)
})
promise.then(value => {
  console.log(value, 4)
})
console.log(2)
