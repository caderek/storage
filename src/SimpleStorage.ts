import FileStorage from "./storages/FileStorage.js"
import MemoryStorage from "./storages/MemoryStorage.js"

type JSONObject = { [key: string]: string | number | null | JSONObject | any[] }

class SimpleStorage<T extends JSONObject> {
  #storage: Storage
  #subscribers = new Map<
    Symbol,
    [<K extends keyof T>(key: K, value: T[K]) => void, Set<keyof T> | null]
  >()

  constructor(storage: Storage, initialData: T) {
    this.#storage = storage
    this.#reconcile(initialData)
  }

  get size() {
    return this.#storage.length
  }

  #reconcile(data: JSONObject) {
    for (const [key, val] of Object.entries(data)) {
      if (this.#storage.getItem(key) === null) {
        this.#storage.setItem(key, JSON.stringify(val))
      }
    }
  }

  #notify<K extends keyof T>(key: K, value: T[K]) {
    for (const [callback, keys] of this.#subscribers.values()) {
      if (!keys || keys.has(key)) {
        callback(key, structuredClone(value))
      }
    }
  }

  update(data: Partial<T>) {
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        this.#storage.setItem(key, JSON.stringify(value))
      } else {
        this.#storage.removeItem(key)
      }

      this.#notify(key, value)
    }
  }

  get(key: keyof T) {
    const value = this.#storage.getItem(key as string)
    return value === null ? undefined : JSON.parse(value)
  }

  keys() {
    const keys = []

    for (let i = 0; i < this.size; i++) {
      const key = this.#storage.key(i)

      if (key !== null) {
        keys.push(key)
      }
    }

    return keys
  }

  entries() {
    return this.keys().map((key) => [key, this.get(key)])
  }

  getAll() {
    return Object.fromEntries(this.entries())
  }

  set<K extends keyof T>(key: K, value: T[K]): void
  set<K extends keyof T>(key: K, mapperFn: (previousValue: T[K]) => T[K]): void
  set<K extends keyof T>(key: K, x: any): void {
    const value = typeof x === "function" ? x(this.get(key)) : x

    this.#storage.setItem(key as string, JSON.stringify(value))
    this.#notify(key, value)
  }

  // remove(key: keyof T) {
  //   this.update({ [key]: undefined })
  // }

  subscribe(
    callback: <K extends keyof T>(key: K, value: T[K]) => void,
    keys?: [],
  ) {
    const handle = Symbol()
    this.#subscribers.set(handle, [callback, keys ? new Set(keys) : null])
    return handle
  }

  unsubscribe(handle: Symbol) {
    this.#subscribers.delete(handle)
  }

  static local<V extends JSONObject>(initialData: V) {
    return new SimpleStorage<V>(localStorage, initialData)
  }

  static session<V extends JSONObject>(initialData: V) {
    return new SimpleStorage<V>(sessionStorage, initialData)
  }

  static file<V extends JSONObject>(initialData: V, path: string) {
    return new SimpleStorage<V>(new FileStorage(path), initialData)
  }

  static memory<V extends JSONObject>(initialData: V) {
    return new SimpleStorage<V>(new MemoryStorage(), initialData)
  }
}

export default SimpleStorage
