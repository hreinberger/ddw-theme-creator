import { useState } from "react"
import { useRouter } from "next/router"
import JSZip from "jszip"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"
import { createPreviewItem } from "../utils/file-items"
import { isValidThemeName } from "../utils/theme"
import ImageDropzone from "./image-dropzone"

const BRIGHTNESS_LEVELS = [100, 92, 84, 76, 68, 60, 52, 44]

const createModifiedImage = (sourceItem, brightness, index) => new Promise((resolve, reject) => {
    const image = new Image()

    image.onload = () => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")

        if (!context) {
            reject(new Error("Unable to initialize canvas rendering."))
            return
        }

        canvas.width = image.naturalWidth
        canvas.height = image.naturalHeight
        context.filter = `brightness(${brightness}%)`
        context.drawImage(image, 0, 0)
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error("Unable to convert the generated image."))
                return
            }

            const modifiedFile = new File([blob], `preview_${index}.jpg`, { type: "image/jpeg" })
            resolve(createPreviewItem(modifiedFile))
        }, "image/jpeg")
    }

    image.onerror = () => {
        reject(new Error("Unable to load the source image."))
    }

    image.src = sourceItem.preview
})

const CreateThemeFromSingleImage = () => {
    const router = useRouter()

    const [modifiedImages, setModifiedImages] = useState([])
    const [themeName, setThemeName] = useState("")
    const [errorFlag, setErrorFlag] = useState(" hidden")
    const [errorText, setErrorText] = useState("")

    const createImages = async sourceItem => {
        try {
            const images = await Promise.all(
                BRIGHTNESS_LEVELS.map((brightness, index) => createModifiedImage(sourceItem, brightness, index + 1))
            )

            setModifiedImages(images)
            setErrorFlag(" hidden")
            setErrorText("")
        } catch (error) {
            console.error(error)
            setModifiedImages([])
            setErrorFlag(" visible")
            setErrorText("There was a problem generating the theme preview images.")
        }
    }

    const createTheme = async event => {
        event.preventDefault()
        const trimmedThemeName = themeName.trim()

        if (modifiedImages.length === 0) {
            setErrorFlag(" visible")
            setErrorText("Please upload an image.")
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
        const zip = new JSZip()

        modifiedImages.forEach(image => {
            zip.file(`${trimmedThemeName}_${count++}.jpg`, image.file)
        })

        zip.file(`${trimmedThemeName}.json`, JSON.stringify({
            imageFilename: `${trimmedThemeName}_*.jpg`,
            imageCredits: "Created by the .ddw Theme Creator",
            sunriseImageList: [5, 4],
            dayImageList: [3, 2, 1, 1, 1, 2, 3],
            sunsetImageList: [4, 5],
            nightImageList: [6, 7, 8, 8, 8, 7, 6]
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
                Drag your image in or click the "+" button to upload an image. <br />
                A theme will be created for you by modifying the brightness of the image. <br />
                Idea originally implemented by <a className="content-link-text hover-fade" href="https://github.com/pchalamet" rel="noopener noreferrer" target="_blank">@pchalamet</a>.
            </div>
            {modifiedImages.length > 0 ? null : <ImageDropzone onDrop={files => {
                if (files[0] != null) {
                    void createImages(files[0])
                }
            }} />}
            <div className="thumbnail-container minimize">
                {modifiedImages.map(file => (
                    <div className="thumbnail" key={file.id}>
                        <div className="thumbnail-inner">
                            <img alt={file.name} className="thumbnail-image" src={file.preview} />
                        </div>
                    </div>
                ))}
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

export default CreateThemeFromSingleImage
