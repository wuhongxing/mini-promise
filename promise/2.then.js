const Promise = require("./promise")
function fn(value) {
  return new Promise((resolve, reject) => {
    resolve(value)
    // setTimeout(() => {
    //   resolve(value)
    // }, 100)
  })
}

fn(1)
  .then(value => {
    console.log(value)
    return fn(value + 1)
  })
  .then(value => {
    console.log(value)
    fn(value + 1)
  })
  .then(value => {
    console.log(value)
    throw Error("error")
  })
// .catch(err => {
//   console.log(err)
//   return fn(err + "1")
// })
// .then(value => {
//   console.log(value)
//   return new Promise(() => {})
// })
// .then(_ => {
//   console.log(5)
// })
