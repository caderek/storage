import { describe, it, expect } from "vitest"
import MemoryStorage from "./MemoryStorage.js"

describe("In memory storage", () => {
  it("creates an empty storage", () => {
    const storage = new MemoryStorage()

    expect(storage.length).toEqual(0)
  })

  it("provides correct storage length", () => {
    const storage = new MemoryStorage()
    storage.setItem("a", "1")
    storage.setItem("b", "2")
    storage.setItem("c", "3")

    expect(storage.length).toEqual(3)
  })

  it("correctly sets and retrieves items", () => {
    const storage = new MemoryStorage()
    storage.setItem("foo", "bar")
    const item = storage.getItem("foo")

    expect(item).toEqual("bar")
  })

  it("correctly removes items", () => {
    const storage = new MemoryStorage()
    storage.setItem("foo", "bar")
    storage.removeItem("foo")
    const item = storage.getItem("foo")

    expect(item).toEqual(null)
  })

  it("can be emptied", () => {
    const storage = new MemoryStorage()
    storage.setItem("foo", "bar")
    storage.setItem("baz", "bat")
    storage.clear()
    const item1 = storage.getItem("foo")
    const item2 = storage.getItem("foo")

    expect(item1).toEqual(null)
    expect(item2).toEqual(null)
    expect(storage.length).toEqual(0)
  })

  it("provides correct key on a given index", () => {
    const storage = new MemoryStorage()
    storage.setItem("foo", "bar")
    storage.setItem("baz", "bat")
    const key = storage.key(1)

    expect(key).toEqual("baz")
  })

  it("returns null  if key on a given index doesn't exist", () => {
    const storage = new MemoryStorage()
    storage.setItem("foo", "bar")
    storage.setItem("baz", "bat")
    const key = storage.key(2)

    expect(key).toEqual(null)
  })
})
