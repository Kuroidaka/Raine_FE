import DefaultLayout from "../Layout/default"
import Planner from "../Page/Planner/Planner"
import NoPage from "../Page/NoPage"
import paths from "./path"
import Setting from "../Page/Setting/Setting"
import ChatPage from "../Page/Chat"
import { Navigate } from "react-router"




export const routes = [
    {
        name: "default",
        page:  <Navigate to={paths.planner} />,
        path: "*",
        exact: true,
    },
    {
        name: "planner",
        page: <DefaultLayout><Planner /></DefaultLayout>,
        path: paths.planner,
        exact: true,
    },
    {
        name: "planner",
        page: <DefaultLayout><ChatPage /></DefaultLayout>,
        path: paths.chat,
        exact: true,
    },
    {
        name: "setting",
        page: <DefaultLayout><Setting /></DefaultLayout>,
        path: paths.setting,
        exact: false,
    },
    {
        name: "noPage",
        page: <NoPage />,
        path: paths.noPage,
        exact: false,
    }
]