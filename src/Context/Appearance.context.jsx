import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./Auth.context.jsx";
import { API_BASE_URL, PREFIX } from "../config/index.js";
import userApi from "../api/user.api.js";

const AppearanceContext = createContext()

export const AppearanceProvider = (p) => {
    const { children } = p
    const [appearance, setAppearance] = useState({name: "", url: ""})
    const { userData } = useContext(AuthContext)

    useEffect(() => {

        const fetchBGImage = async () => {
            try {
                if(userData?.id) {
                    const backgroundImage = await userApi.getBackgroundImg()
                    if(backgroundImage) {
                        setAppearance({
                            name: backgroundImage.name.split(".")[0],
                            url: `${API_BASE_URL}${PREFIX}${backgroundImage.urlPath}` 
                        })
                    }

                }
            } catch (error) {
                console.log(error)
            }
        }

        fetchBGImage()
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