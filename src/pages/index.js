import { IoIosImage, IoIosImages } from "react-icons/io"
import { GoArrowRight } from "react-icons/go"
import Link from "next/link"
import { useEffect } from "react"
import AppStore from "../stores/app"

function Home() {
    useEffect(() => {
        AppStore.loading = false
    }, [])

    const handleOptionClick = () => {
        AppStore.loadingMessage = "Loading..."
        AppStore.loading = true
    }

    return (
        <div className="home fade-in">
            <div className="logo">
                <img alt="WinDynamicDesktop logo" className="logo-image" src="/logo.png" />
                <div className="logo-text">
                    WinDynamicDesktop <br />
                    .ddw Theme Creator
                </div>
            </div>
            <ul className="options">
                <li className="option hover-fade">
                    <Link className="option-link" href={{ pathname: "/create", query: { option: "1" } }} onClick={handleOptionClick}>
                        <IoIosImages className="option-icon" />
                        <GoArrowRight className="option-icon" />
                        <img alt="" className="option-image-small" src="/icon.png" />
                        <div className="option-text">Create theme from set of images</div>
                    </Link>
                </li>
                <li className="option hover-fade">
                    <Link className="option-link" href={{ pathname: "/create", query: { option: "2" } }} onClick={handleOptionClick}>
                        <IoIosImage className="option-icon" />
                        <GoArrowRight className="option-icon" />
                        <img alt="" className="option-image-small" src="/icon.png" />
                        <div className="option-text">Create theme from single image</div>
                    </Link>
                </li>
                <li className="option hover-fade">
                    <Link className="option-link" href={{ pathname: "/create", query: { option: "3" } }} onClick={handleOptionClick}>
                        <img alt="" className="option-image-big" src="/heicfile.png" />
                        <GoArrowRight className="option-icon" />
                        <img alt="" className="option-image-small" src="/icon.png" />
                        <div className="option-text">Convert .heic file to .ddw file</div>
                    </Link>
                </li>
            </ul>
		</div>
	)
}

export default Home
