import { useEffect } from "react"
import Link from "next/link"
import { saveAs } from "file-saver"
import { IoIosHome, IoIosCheckmarkCircle } from "react-icons/io"
import AppStore from "../stores/app"
import ThemeStore from "../stores/theme"

function Result() {
    const hasTheme = Boolean(ThemeStore.themeData && ThemeStore.themeName)

    useEffect(() => {
        AppStore.loading = false
    }, [])

    const handleDownloadLink = () => {
        if (hasTheme) {
            saveAs(ThemeStore.themeData, ThemeStore.themeName + ".ddw")
        }
    }

    return (
        <div className="result fade-in">
            {hasTheme ? (
                <>
                    <IoIosCheckmarkCircle className="result-success-icon" />
                    <div className="result-title">{"'" + ThemeStore.themeName + "' theme created!"}</div>
                    <button className="result-download-button result-download-link-text hover-fade" onClick={handleDownloadLink} type="button">
                        Click to download .ddw file
                    </button>
                </>
            ) : (
                <>
                    <div className="result-title">No generated theme found.</div>
                    <div className="content-block">Create a theme first, then come back here to download it.</div>
                </>
            )}
            <Link className="result-home-link hover-fade" href="/">
                <IoIosHome className="result-home-button" />
                Back to home
            </Link>
        </div>
    )
}

export default Result
