// vue: 数据变化，更新视图

class Observable {
  observers = new Set()
  constructor() {}

  addObserver(observer) {
    this.observers.add(observer)
    return () => this.observers.delete(observer)
  }

  setState(newState) {
    this.observers.forEach(observer => {
      observer.update(newState)
    })
  }
}

class Observer {
  update(newState) {
    console.log("update", newState)
  }
}

let o1 = new Observer()
let o2 = new Observer()
let s = new Observable()
s.addObserver(o1)
s.addObserver(o2)

s.setState("1")
s.setState("2")
