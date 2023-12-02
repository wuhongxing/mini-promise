// function* read() {
//   yield 10
//   yield 20
//   return 1000
// }

// let it = read()
// console.log(it.next())
// console.log(it.next())
// console.log(it.next())

const obj = {
  0: "a",
  1: "b",
  2: "c",
  length: 3,
  *[Symbol.iterator]() {
    for (let i = 0; i < this.length; i++) {
      yield this[i]
    }
  }
  // [Symbol.iterator]() {
  //   let index = 0
  //   return {
  //     next: () => {
  //       if (index === obj.length) {
  //         return {
  //           done: true
  //         }
  //       }
  //       return {
  //         value: this[index++],
  //         done: index > this.length
  //       }
  //     }
  //   }
  // }
}
// console.log([...obj])

// function* read() {
//   const a = yield "hello"
//   console.log(a)
//   const b = yield "world"
//   console.log(b)
// }

// const fn = read()
// console.log(fn.next()) // 第一次的 next 传递任何参数都没有意义
// console.log(fn.next(1)) // 第二次的 next 传递的参数会被赋值给上一次的 yield 表达式
// console.log(fn.next(2))

function* read() {
  const a = yield "hello"
  console.log(a)
  const b = yield "world"
  console.log(b)
  return 10
}

function co(it) {
  // 循环没有办法异步，递归是可以的
  return new Promise((resolve, reject) => {
    const next = r => {
      const { value, done } = it.next(r)
      if (done) {
        resolve(value)
      } else {
        Promise.resolve(value).then(res => {
          next(res)
        }, reject)
      }
    }
    next()
  })
}
co(read()).then(res => {
  console.log(res)
})

// async/await 就是使用 co 和 generator 实现的
