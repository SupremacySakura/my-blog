import { Outlet } from "react-router-dom"
import Sidebar from "../../components/Sidebar/Sidebar"
import Style from "./Main.module.css"
function Main() {

    return (
        <>
            <div className={Style.mainBox}>
                <Sidebar></Sidebar>
                <Outlet />
            </div>
        </>
    )
}

export default Main
