function say(...who) {
  console.log("说话", ...who)
}

Function.prototype.before = function (fn) {
  // 箭头函数没有 this，没有 arguments，没有原型
  return (...args) => {
    fn()
    this(...args) // es5 this.apply(void 0, args)
  }
}

const fn = say.before(function () {
  console.log("我是前置")
})

// fn(111, 222)

// 什么是闭包（捕获了作用域外部的变量）
const oldPush = Array.prototype.push
Array.prototype.push = function (...args) {
  console.log("我是push", ...args)
  oldPush.call(this, ...args)
}
;[1, 2, 3].push(4, 5, 6)

// react setState
