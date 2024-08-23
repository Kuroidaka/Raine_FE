import { createContext, useCallback, useEffect, useState } from "react";
import goalApi from "../api/goal.api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isObject } from "../Util";

const GoalContext = createContext();

export const GoalProvider = (p) => {
    const { children } = p;

    const [goal, setGoal] = useState([]);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['goals'],
        queryFn: () => goalApi.getGoals(),
        cacheTime: 0,
    });

    const handleDeleteGoal = async (id) => {
        try {
            await goalApi.deleteGoal(id);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const addMutation = useMutation({
        mutationFn: async ({ data }) => await goalApi.createGoal(data),
        onSuccess: () => queryClient.invalidateQueries(['goals']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ goalId, data }) => {
            await goalApi.updateGoal(goalId, data);
        },
        onSuccess: () => queryClient.invalidateQueries(['goals']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ goalId }) => {
            await goalApi.toggleGoalStatus(goalId);
        },
        onSuccess: () => queryClient.invalidateQueries(['goals']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const handleAddGoal = useCallback((data) => {
        console.log("dataInput", data);
        addMutation.mutate({ data });
    }, [addMutation]);

    const handleUpdateGoal = async (goalId, data = {}) => {
        if (Array.isArray(data.area) && isObject(data.area[0])) {
            data.area = data.area.map(item => item.area);
        }
        
        updateMutation.mutate({ goalId, data });
    };

    const handleToggleGoalStatus = async (goalId) => {
        toggleStatusMutation.mutate({ goalId });
    };

    useEffect(() => {
        if (data) {
            setGoal(data);
        }
    }, [data]);

    const valueContext = {
        goal, setGoal,
        handleAddGoal, handleDeleteGoal, handleUpdateGoal, handleToggleGoalStatus,
        loading: isLoading
    };

    return (
        <GoalContext.Provider value={valueContext}>
            {children}
        </GoalContext.Provider>
    );
};

export default GoalContext;
