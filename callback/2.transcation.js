function perform(anyMethod, wrappers) {
  return () => {
    wrappers.forEach(wrapper => wrapper.initialize())
    anyMethod()
    wrappers.forEach(wrapper => wrapper.close())
  }
}

const fn = perform(() => {
  console.log("say")
}, [
  {
    initialize() {
      console.log("wrapper1 beforeSay")
    },
    close() {
      console.log("wrapper1 close")
    }
  },
  {
    initialize() {
      console.log("wrapper2 beforeSay")
    },
    close() {
      console.log("wrapper2 close")
    }
  }
])

fn()
