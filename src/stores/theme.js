import { makeAutoObservable } from "mobx"

class Theme {
    themeData = null
    themeName = ""

    constructor() {
        makeAutoObservable(this)
    }
}

export default new Theme()
