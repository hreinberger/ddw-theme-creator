import { useState } from "react"
import { useRouter } from "next/router"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import JSZip from "jszip"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import { isValidThemeName } from "../utils/theme"
import ImageDropzone from "./image-dropzone"
import SortableThumbnailList from "./sortable-thumbnail-list"

const CreateThemeFromImageSet = () => {
    const router = useRouter()

    const [sunriseThumbnails, setSunriseThumbnails] = useState([])
    const [dayThumbnails, setDayThumbnails] = useState([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState([])
    const [nightThumbnails, setNightThumbnails] = useState([])
    const [themeName, setThemeName] = useState("")
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const createTheme = async event => {
        event.preventDefault()
        const trimmedThemeName = themeName.trim()

        if (sunriseThumbnails.length === 0 || dayThumbnails.length === 0 || sunsetThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please provide at least one image for each category.")
            return
        }

        if (trimmedThemeName.length < 1) {
            setErrorFlag(" visible")
            setErrorText("Please enter a theme name.")
            return
        }

        if (!isValidThemeName(trimmedThemeName)) {
            setErrorFlag(" visible")
            setErrorText("Please enter letters, numbers, or underscores only.")
            return
        }

        setErrorFlag(" hidden")
        setErrorText("")

        let count = 1
        const sunriseImageIndices = []
        const dayImageIndices = []
        const sunsetImageIndices = []
        const nightImageIndices = []
        const zip = new JSZip()

        sunriseThumbnails.forEach(thumbnail => {
            sunriseImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
        })

        dayThumbnails.forEach(thumbnail => {
            dayImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
        })

        sunsetThumbnails.forEach(thumbnail => {
            sunsetImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
        })

        nightThumbnails.forEach(thumbnail => {
            nightImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
        })

        zip.file(`${trimmedThemeName}.json`, JSON.stringify({
            imageFilename: `${trimmedThemeName}_*.jpg`,
            imageCredits: "Created by the .ddw Theme Creator",
            sunriseImageList: sunriseImageIndices,
            dayImageList: dayImageIndices,
            sunsetImageList: sunsetImageIndices,
            nightImageList: nightImageIndices
        }))

        AppStore.loadingMessage = "Creating theme..."
        AppStore.loading = true

        const result = await zip.generateAsync({ type: "blob" })

        ThemeStore.themeData = result
        ThemeStore.themeName = trimmedThemeName

        void router.push("/result")
    }

    return (
        <form className="content" onSubmit={createTheme}>
            <div className="content-block">
                Drag your images into each category or click the "+" button. <br />
                The order of images determines when they will appear. <br />
                A minimum of one image is required for each category.
            </div>
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple={true} onDrop={files => {
                            setSunriseThumbnails(current => current.concat(files))
                        }} />
                        <SortableThumbnailList items={sunriseThumbnails} setItems={setSunriseThumbnails} />
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple={true} onDrop={files => {
                            setDayThumbnails(current => current.concat(files))
                        }} />
                        <SortableThumbnailList items={dayThumbnails} setItems={setDayThumbnails} />
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple={true} onDrop={files => {
                            setSunsetThumbnails(current => current.concat(files))
                        }} />
                        <SortableThumbnailList items={sunsetThumbnails} setItems={setSunsetThumbnails} />
                    </div>
                </div>
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <div className="category-content">
                        <ImageDropzone multiple={true} onDrop={files => {
                            setNightThumbnails(current => current.concat(files))
                        }} />
                        <SortableThumbnailList items={nightThumbnails} setItems={setNightThumbnails} />
                    </div>
                </div>
            </div>
            <div className="content-block">
                <input
                    className="content-text-field"
                    id="theme-name"
                    name="theme-name"
                    onChange={({ target }) => setThemeName(target.value)}
                    placeholder="Name of theme"
                    type="text"
                    value={themeName}
                />
            </div>
            <div className="content-block row">
                <input className="content-button" type="submit" value="Create .ddw file" />
                <span className={"error-text" + errorFlag}>{errorText}</span>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default CreateThemeFromImageSet
