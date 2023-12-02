const fs = require("fs")

class Event {
  array = []

  on(fn) {
    this.array.push(fn)
  }

  emit() {
    this.array.forEach(fn => fn())
  }
}

const event = new Event()

let school = {}
event.on(function () {
  console.log(school, "1")
})
event.on(function () {
  if (school.name && school.age) {
    console.log(school, "完成")
  }
})

fs.readFile("./f1.txt", "utf-8", function (error, data) {
  school.name = data
  event.emit()
})

fs.readFile("./f2.txt", "utf-8", function (error, data) {
  school.age = data
  event.emit()
})

// 观察者模式和发布订阅模式的区别？
// 发布订阅模式，发布者和订阅者之间没有关系
// 观察者模式是基于发布订阅模式的，观察与被观察者之间有关系
