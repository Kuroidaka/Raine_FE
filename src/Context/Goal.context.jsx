import { nanoid } from "nanoid";
import React, { createContext } from "react";

const GoalContext = createContext()

const mockData = [
    // {   
    //     "id": nanoid(),
    //     "target": "10",
    //     "title": "Senior",
    //     "color": "#005ff7",
    //     "area": [],
    //     "deadline": "Thu Oct 09 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "<p>Đánh kĩ</p>",

    // },
    // {
    //     "id": nanoid(),
    //     "target": "80",
    //     "title": "Junior",
    //     "color": "#372408",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "deadline": "Thu Oct 09 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // },
    // {
    //     "id": nanoid(),
    //     "target": "20",
    //     "title": "test",
    //     "color": "#cb18a7",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "deadline": "Thu Oct 09 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // }
]

export const GoalProvider = (p) => {
    const { children } = p


    const [goal, setGoal] = React.useState([]);
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        setLoading(true)
        const goalData = setTimeout(() => {
            setGoal(mockData)
            setLoading(false)
        }, 0)

        return () => clearTimeout(goalData)
        
    }, [])

    const valueContext = {
        goal, setGoal, loading, setLoading
    }

    return (
        <GoalContext.Provider value={valueContext}>
            {children}
        </GoalContext.Provider>
    )
}

export default GoalContext