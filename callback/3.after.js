// after 在 ... 之后

function after(times, callback) {
  let i = 1
  return function (...args) {
    if (++i > times) {
      callback(...args)
    }
  }
}

let fn = after(3, function () {
  console.log("really")
})

fn()
fn()
fn()

module.exports = after
