const fs = require("fs")

function after(times, callback) {
  let i = 1
  let school = {}
  return function (key, value) {
    school[key] = value
    if (++i > times) {
      callback(school)
    }
  }
}

const out = after(2, function (data) {
  console.log(data)
})

fs.readFile("./f1.txt", "utf-8", function (error, data) {
  out("name", data)
})

fs.readFile("./f2.txt", "utf-8", function (error, data) {
  out("age", data)
})
