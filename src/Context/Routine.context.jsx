import { nanoid } from "nanoid";
import React, { createContext } from "react";

const RoutineContext = createContext()

const mockData = [
    // {   
    //     "id": nanoid(),
    //     "active": true,
    //     "title": "Đánh Cờ",
    //     "color": "#3c2eff",
    //     "area": [],
    //     "dateDone": [
    //         "Thu Nov 09 2023 17:23:12 GMT+0700 (Indochina Time)",
    //         "Tue Nov 07 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     ],
    //     "note": "<p>Đánh kĩ</p>"
    // },
    // {
    //     "id": nanoid(),
    //     "active": false,
    //     "title": "Chơi game",
    //     "color": "#372408",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "dateDone": [
    //         "Fri Nov 10 2023 17:23:12 GMT+0700 (Indochina Time)",
    //         "Tue Nov 07 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     ],
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // },
    // {
    //     "id": nanoid(),
    //     "active": true,
    //     "title": "test",
    //     "color": "#cb18a7",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "dateDone": [
    //         "Tue Nov 07 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     ],
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // }
]

export const RoutineProvider = (p) => {
    const { children } = p


    const [routine, setRoutine] = React.useState([]);
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        const routineData = setTimeout(() => {
            setRoutine(mockData)
            setLoading(false)
        }, 0)

        return () => clearTimeout(routineData)
        
    }, [])

    const valueContext = {
        routine, setRoutine, loading, setLoading
    }

    return (
        <RoutineContext.Provider value={valueContext}>
            {children}
        </RoutineContext.Provider>
    )
}

export default RoutineContext