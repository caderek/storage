type Data = { [key: string]: any }

class MemoryStorage implements Storage {
  #data: Data = {}

  constructor() {}

  get length() {
    return Object.keys(this.#data).length
  }

  key(index: number): string | null {
    return Object.keys(this.#data)[index] ?? null
  }

  clear() {
    this.#data = {}
  }

  getItem(key: string): string | null {
    return this.#data[key] ?? null
  }

  removeItem(key: string) {
    delete this.#data[key]
  }

  setItem(key: string, value: string) {
    this.#data[key] = value
  }
}

export default MemoryStorage
