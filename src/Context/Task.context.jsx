import { nanoid } from "nanoid";
import React, { createContext } from "react";

const TaskContext = createContext()

const mockData = [
    // {   
    //     "id": nanoid(),
    //     "title": "Đánh răng",
    //     "color": "#4caf50",
    //     "area": [],
    //     "deadline": "Thu Oct 09 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "<p>Đánh kĩ</p>",
    //     "sub": [
    //         {   
    //             "id": nanoid(),
    //             "title": "rửa mặt",
    //             "done": false
    //         },
    //         {
    //             "id": nanoid(),
    //             "title": "tắm",
    //             "done": true
    //         },
    //     ]
    // },
    // {
    //     "id": nanoid(),
    //     "title": "Chơi bóng rổ",
    //     "color": "#ff9800",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "deadline": "Thu Oct 12 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // },
    // {
    //     "id": nanoid(),
    //     "title": "test",
    //     "color": "#844f00",
    //     "area": [
    //         "health",
    //         "growth"
    //     ],
    //     "deadline": "Thu Oct 12 2023 17:23:12 GMT+0700 (Indochina Time)",
    //     "note": "\n<p>Chơi với bạn bè</p>\n",
    // }
]

export const TaskProvider = (p) => {
    const { children } = p


    const [task, setTask] = React.useState([]);
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        setLoading(true)
        const taskData = setTimeout(() => {
            setTask(mockData)
            setLoading(false)
        }, 0)

        return () => clearTimeout(taskData)
        
    }, [])

    const valueContext = {
        task, setTask, loading, setLoading
    }

    return (
        <TaskContext.Provider value={valueContext}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext