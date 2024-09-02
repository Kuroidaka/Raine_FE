import { createContext, useCallback, useEffect, useState } from "react";
import routineApi from "../api/routine.api";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isObject } from "../Util";

const RoutineContext = createContext();

export const RoutineProvider = (p) => {
    const { children } = p;

    const [routine, setRoutine] = useState([]);

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['routines'],
        queryFn: () => routineApi.getRoutines(),
        cacheTime: 0,
    });

    const handleDeleteRoutine = async (id) => {
        try {
            await routineApi.deleteRoutine(id);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const addMutation = useMutation({
        mutationFn: async ({ data }) => await routineApi.createRoutine(data),
        onSuccess: () => queryClient.invalidateQueries(['routines']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({ routineId, data }) => {
            await routineApi.updateRoutine(routineId, data);
        },
        onSuccess: () => queryClient.invalidateQueries(['routines']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: async ({ routineId }) => {
            await routineApi.toggleRoutineStatus(routineId);
        },
        onSuccess: () => queryClient.invalidateQueries(['routines']),
        onError: (error) => {
            toast.error("Something went wrong");
            console.log(error);
        },
    });

    const handleAddRoutine = useCallback((data) => {
        console.log("dataInput", data);
        addMutation.mutate({ data });
    }, [addMutation]);

    const handleUpdateRoutine = async (routineId, data = {}) => {
        console.log(1)
        if (data?.area && Array.isArray(data?.area) && isObject(data?.area[0])) {
            data.area = data.area.map(item => item.area);
        }
        console.log(2)
        updateMutation.mutate({ routineId, data });
    };

    const handleToggleRoutineStatus = async (routineId) => {
        toggleStatusMutation.mutate({ routineId });
    };

    useEffect(() => {
        if (data) {
            setRoutine(data);
        }
    }, [data]);

    const valueContext = {
        routine, setRoutine,
        handleAddRoutine, handleDeleteRoutine, handleUpdateRoutine, handleToggleRoutineStatus,
        loading: isLoading
    };

    return (
        <RoutineContext.Provider value={valueContext}>
            {children}
        </RoutineContext.Provider>
    );
};

export default RoutineContext;
