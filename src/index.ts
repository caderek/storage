import SimpleStorage from "./SimpleStorage.js"

type Config = {
  foo: string
  bar: string
  baz: number[]
  bat: number
  hey?: string
}

const initialConfig: Config = {
  foo: "hi",
  bar: "yo",
  baz: [1, 2, 3],
  bat: 1,
  hey: "hello",
}

const storage = SimpleStorage.memory(initialConfig)

storage.subscribe((key, val) => {
  console.log({ key, val })
})

storage.update({ bar: "world" })
storage.set("hey", (prev) => prev?.repeat(2))
storage.set("hey", undefined)

console.log(storage)
console.log(storage.size)
console.log({ hey: storage.get("hey") })

console.log(storage.keys())
console.log(storage.entries())

console.log(storage.getAll())
