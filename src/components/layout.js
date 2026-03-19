import Footer from "./footer"
import LoadingOverlay from "./loading-overlay"
import { observer } from "mobx-react-lite"
import AppStore from "../stores/app"

const Layout = observer(({ children }) => (
    <div className="layout">
        {AppStore.loading ? <LoadingOverlay message={AppStore.loadingMessage} /> : null}
        {children}
        <Footer />
    </div>
))

export default Layout
