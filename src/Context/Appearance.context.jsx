import { createContext, useContext, useEffect, useState } from "react";
import { data } from "../assets/photos/background.js"
import { AuthContext } from "./Auth.context.jsx";
import { API_BASE_URL, PREFIX } from "../config/index.js";
import userApi from "../api/user.api.js";

const AppearanceContext = createContext()

export const AppearanceProvider = (p) => {
    const { children } = p
    const [appearance, setAppearance] = useState({name: "", url: ""})
    const { userData } = useContext(AuthContext)

    useEffect(() => {

        const fetchUser = async () => {
            try {
                if(userData?.id) {
                    const user = await userApi.getUser(userData.id)
                    console.log("user", user)
                    setAppearance({
                        name: user.backgroundImage.name.split(".")[0],
                        url: `${API_BASE_URL}${PREFIX}${user.backgroundImage.urlPath}` 
                    })

                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchUser()
    }, [userData]);
    const contextValue = {
        appearance, setAppearance
    }

    return (
        <AppearanceContext.Provider value={contextValue}>
            {children}
        </AppearanceContext.Provider>
    )
}

export default AppearanceContext