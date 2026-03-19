import { GoArrowLeft } from "react-icons/go"
import { IoIosImage, IoIosImages } from "react-icons/io"
import { GoArrowRight } from "react-icons/go"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect } from "react"
import CreateThemeFromImageSet from "../components/from-image-set"
import CreateThemeFromSingleImage from "../components/from-single-image"
import ConvertHeicToDdw from "../components/heic-to-ddw"
import AppStore from "../stores/app"

function Create() {
    const router = useRouter()
    const option = Array.isArray(router.query.option) ? router.query.option[0] : router.query.option

    useEffect(() => {
        AppStore.loading = false
    }, [])

    return (
        <div className="create fade-in">
            <div className="content-header">
                <Link aria-label="Back to home" className="content-header-back-link" href="/">
                    <GoArrowLeft className="content-header-back-button hover-fade" />
                </Link>
                {
                    option === "1" ?
                        <div className="row">
                            <IoIosImages className="content-header-icon" />
                            <GoArrowRight className="content-header-icon" />
                            <img alt="" className="content-header-image-small" src="/icon.png" />
                            <div className="content-header-text">Create theme from set of images</div>
                        </div> :
                        option === "2" ?
                            <div className="row">
                                <IoIosImage className="content-header-icon" />
                                <GoArrowRight className="content-header-icon" />
                                <img alt="" className="content-header-image-small" src="/icon.png" />
                                <div className="content-header-text">Create theme from single image</div>
                            </div> :
                            option === "3" ?
                                <div className="row">
                                    <img alt="" className="content-header-image-big" src="/heicfile.png" />
                                    <GoArrowRight className="content-header-icon" />
                                    <img alt="" className="content-header-image-small" src="/icon.png" />
                                    <div className="content-header-text">Convert .heic file to .ddw file</div>
                                </div> :
                                null
                }
            </div>
            {
                option === "1" ? <CreateThemeFromImageSet /> :
                    option === "2" ? <CreateThemeFromSingleImage /> :
                        option === "3" ? <ConvertHeicToDdw /> :
                            null
            }
        </div>
    )
}

export default Create
