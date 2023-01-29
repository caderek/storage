import fs from "fs"

type Data = { [key: string]: any }

class FileStorage implements Storage {
  #filePath: string

  constructor(filePath: string) {
    this.#filePath = filePath
    this.#init()
  }

  #init() {
    if (!fs.existsSync(this.#filePath)) {
      this.#write({})
    }
  }

  #read() {
    const content = fs.readFileSync(this.#filePath, { encoding: "utf-8" })

    try {
      return JSON.parse(content)
    } catch {
      throw new Error("Storage corrupted. Can't read the data.")
    }
  }

  #write(data: Data) {
    fs.writeFileSync(this.#filePath, JSON.stringify(data))
  }

  get length() {
    return Object.keys(this.#read()).length
  }

  key(index: number): string | null {
    return Object.keys(this.#read())[index] ?? null
  }

  clear() {
    this.#write({})
  }

  getItem(key: string): string | null {
    return this.#read()[key] ?? null
  }

  removeItem(key: string) {
    const data = this.#read()
    delete data[key]
    this.#write(data)
  }

  setItem(key: string, value: string) {
    const data = this.#read()
    data[key] = value
    this.#write(data)
  }
}

export default FileStorage
