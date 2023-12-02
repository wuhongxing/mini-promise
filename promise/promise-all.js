const Promise = require("./promise")

const isPromise = value => {
  if (
    (typeof value === "object" && value !== null) ||
    typeof value === "function"
  ) {
    if (typeof value.then === "function") return true
  }
  return false
}

Promise.all = function (values) {
  return new Promise((resolve, reject) => {
    const result = []
    let index = 0
    function processData(key, value) {
      result[key] = value
      index += 1
      if (values.length === index) {
        resolve(result)
      }
    }

    for (let i = 0; i < values.length; i++) {
      let current = values[i]
      if (isPromise(current)) {
        current.then(value => {
          processData(i, value)
        }, reject)
      } else {
        processData(i, current)
      }
    }
  })
}

function fn(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, 100)
  })
}

Promise.all([1, 2, fn(3), fn(4), 5, 6]).then(res => {
  console.log(res)
})
