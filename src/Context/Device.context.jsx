import { createContext } from "react";
import { useMedia } from "../hooks/useMedia";

const DeviceContext = createContext()

export const DeviceProvider = (p) => {
    const { children } = p

    const breakpoints = ['(max-width: 768px)', '(min-width: 769px)'];
    const values = ['mobile', 'desktop'];
    const defaultValue = 'mobile';
  
    const device = useMedia(breakpoints, values, defaultValue);
  
    console.log("device", device)

    const contextValue = {
        device: device
    }

    return (
        <DeviceContext.Provider value={contextValue}>
            {children}
        </DeviceContext.Provider>
    )
}

export default DeviceContext