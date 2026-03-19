import { useState } from "react"
import { useRouter } from "next/router"
import { FiSunrise, FiSun, FiSunset, FiMoon } from "react-icons/fi"
import JSZip from "jszip"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import { createPreviewItem } from "../utils/file-items"
import { isValidThemeName } from "../utils/theme"
import HeicDropzone from "./heic-dropzone"
import SortableThumbnailList from "./sortable-thumbnail-list"

const ConvertHeicToDdw = () => {
    const router = useRouter()

    const [extractedThumbnails, setExtractedThumbnails] = useState([])
    const [sunriseThumbnails, setSunriseThumbnails] = useState([])
    const [dayThumbnails, setDayThumbnails] = useState([])
    const [sunsetThumbnails, setSunsetThumbnails] = useState([])
    const [nightThumbnails, setNightThumbnails] = useState([])
    const [themeName, setThemeName] = useState("")
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")
    const [heicErrorFlag, setHeicErrorFlag] = useState(" hidden")

    const extractImages = async file => {
        AppStore.loadingMessage = "Extracting images..."
        AppStore.loading = true

        try {
            const heic2anyModule = await import("heic2any")
            const convertHeic = heic2anyModule.default || heic2anyModule
            const images = await convertHeic({
                blob: file,
                toType: "image/jpeg",
                multiple: true
            })

            const imageBlobs = Array.isArray(images) ? images : [images]
            const baseName = file.name.replace(/\.[^/.]+$/, "") || "converted"
            const files = imageBlobs.map((image, index) => {
                const convertedFile = image instanceof File
                    ? image
                    : new File([image], `${baseName}_${index + 1}.jpg`, { type: "image/jpeg" })

                return createPreviewItem(convertedFile)
            })

            setHeicErrorFlag(" hidden")
            setExtractedThumbnails(current => current.concat(files))
        } catch (error) {
            console.error(error)
            setHeicErrorFlag(" visible")
        } finally {
            AppStore.loading = false
        }
    }

    const createTheme = async event => {
        event.preventDefault()
        const trimmedThemeName = themeName.trim()

        if (dayThumbnails.length === 0 || nightThumbnails.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please assign at least one day and one night image.")
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

        if (sunriseThumbnails.length === 0) {
            sunriseImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, dayThumbnails[0].file)
        } else {
            sunriseThumbnails.forEach(thumbnail => {
                sunriseImageIndices.push(count)
                zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
            })
        }

        dayThumbnails.forEach(thumbnail => {
            dayImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
        })

        if (sunsetThumbnails.length === 0) {
            sunsetImageIndices.push(count)
            zip.file(`${trimmedThemeName}_${count++}.jpg`, nightThumbnails[0].file)
        } else {
            sunsetThumbnails.forEach(thumbnail => {
                sunsetImageIndices.push(count)
                zip.file(`${trimmedThemeName}_${count++}.jpg`, thumbnail.file)
            })
        }

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
                Drag an .heic file into the dropzone, or click the "+" button. <br />
                Then drag the extracted images into their proper categories. <br />
                Not all images must be included, but there must be at least one day image and one night image.
            </div>
            {extractedThumbnails.length > 0 ? null : <HeicDropzone onDrop={file => {
                if (file != null) {
                    void extractImages(file)
                }
            }} />}
            <div className={"content-block" + heicErrorFlag}>
                <span className="error-text">Error: There was a problem with the .heic file. Try again or select another file.</span>
            </div>
            <SortableThumbnailList
                containerClassName="thumbnail-container minimize"
                emptyInsertThreshold={75}
                items={extractedThumbnails}
                setItems={setExtractedThumbnails}
            />
            <div className="category-grid">
                <div className="category">
                    <div className="category-header-text"><FiSunrise />&nbsp;Sunrise images:</div>
                    <SortableThumbnailList emptyInsertThreshold={75} items={sunriseThumbnails} setItems={setSunriseThumbnails} />
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSun />&nbsp;Day images:</div>
                    <SortableThumbnailList emptyInsertThreshold={75} items={dayThumbnails} setItems={setDayThumbnails} />
                </div>
                <div className="category">
                    <div className="category-header-text"><FiSunset />&nbsp;Sunset images:</div>
                    <SortableThumbnailList emptyInsertThreshold={75} items={sunsetThumbnails} setItems={setSunsetThumbnails} />
                </div>
                <div className="category">
                    <div className="category-header-text"><FiMoon />&nbsp;Night images:</div>
                    <SortableThumbnailList emptyInsertThreshold={75} items={nightThumbnails} setItems={setNightThumbnails} />
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
                <span className={"error-text" + errorFlag}>Error: {errorText}</span>
            </div>
            <div className="spacer" />
        </form>
    )
}

export default ConvertHeicToDdw
