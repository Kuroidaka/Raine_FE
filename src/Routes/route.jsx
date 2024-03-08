import DefaultLayout from "../Layout/default"
import Planner from "../Page/Planner/Planner"
import Knowledge from '../Page/Knowledge/Knowledge'
import NoPage from "../Page/NoPage"
import paths from "./path"
import Setting from "../Page/Setting/Setting"
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
        name: "knowledge",
        page: <DefaultLayout><Knowledge /></DefaultLayout>,
        path: paths.knowledge,
        exact: false,
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