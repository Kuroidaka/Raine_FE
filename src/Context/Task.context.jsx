import { createContext, useCallback, useEffect, useState } from "react";
import reminderApi from "../api/reminder.api"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isObject } from "../Util";

const TaskContext = createContext()


export const TaskProvider = (p) => {
    const { children } = p


    const [task, setTask] = useState([]);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey:['tasks'], 
        queryFn: () => reminderApi.getTasks(),
        cacheTime: 0,
    });

    const handleDeleteTask = async (id) => {
        try {
            reminderApi.deleteTask(id)
        } catch (error) {
            console.log(error)
            toast.error("something went wrong")
        }
    }

    const addMutation = useMutation({
        mutationFn: async ({data}) => await reminderApi.createTask(data),
        onSuccess: () => queryClient.invalidateQueries(['task']),        
        onError: (error) => {
            toast.error(`Something went wrong`)
            console.log(error)
        },
    });

    // const addSubTaskMutation = useMutation({
    //     mutationFn: async ({taskId, data}) => await reminderApi.addSubTask(taskId, data),
    //     onSuccess: () => queryClient.invalidateQueries(['task']),        
    //     onError: (error) => {
    //         toast.error(`Something went wrong`)
    //         console.log(error)
    //     },
    // });

    const updateMutation = useMutation({
        mutationFn: async ({taskId, data}) => {
            await reminderApi.updateTask(taskId, data)

        },
        onSuccess: () => queryClient.invalidateQueries(['task']),        
        onError: (error) => {
            toast.error(`Something went wrong`)
            console.log(error)
        },
    });

    const checkMutation = useMutation({
        mutationFn: async ({taskId}) => {
            await reminderApi.check(taskId)

        },
        onSuccess: () => queryClient.invalidateQueries(['task']),        
        onError: (error) => {
            toast.error(`Something went wrong`)
            console.log(error)
        },
    });


    // Function to add a new conversation
    const handleAddTask = useCallback((data) => {
        if(typeof(data.deadline) === "undefined") {
            const today = new Date()
            today.setHours(23,59,59,0)

            data.deadline = today
        }
        
        console.log("dataInput", data)
        addMutation.mutate({data});
    }, [addMutation]);

       
    const handleUpdateTask = async (taskId, data = {}) => {
        if (Array.isArray(data.area) && isObject(data.area[0])) {
          data.area = data.area.map(item => item.area);
        }
        
        updateMutation.mutate({ taskId, data });
    };

    const handleCheckTask = async (taskId) => {       
        checkMutation.mutate({ taskId });
    };

    useEffect(() => {
        if(data) {
            setTask(data)
        }
    }, [data])

    const valueContext = {
        task, setTask, 
        handleAddTask, handleDeleteTask, handleUpdateTask, handleCheckTask,
        loading: isLoading
    }

    return (
        <TaskContext.Provider value={valueContext}>
            {children}
        </TaskContext.Provider>
    )
}

export default TaskContext