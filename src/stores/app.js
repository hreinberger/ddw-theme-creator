import { makeAutoObservable } from "mobx"

class App {
    loading = false
    loadingMessage = ""

    constructor() {
        makeAutoObservable(this)
    }
}

export default new App()
