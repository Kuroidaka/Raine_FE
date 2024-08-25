import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import userApi from "../../../api/user.api";
import Loading from "../../../Component/Loading";

const ToolSettings = () => {
  const queryClient = useQueryClient();

  // Use React Query to fetch tools
  const { data: tools, isLoading, error } = useQuery({
    queryKey: ['tools'],
    queryFn: userApi.getTools,
  });


  // Use React Query's useMutation to toggle tool assignment
  const toggleToolMutation = useMutation({
    mutationFn: ({toolId}) => userApi.toggleTool(toolId),
    // On success, invalidate the tools query to refetch the data
    onSuccess: () => {
      queryClient.invalidateQueries(['tools']);
    },
    onError: (error) => {
      console.error('Error toggling tool:', error);
      alert('Failed to toggle tool. Please try again.');
    },
  });


  // Handler for toggling a tool
  const handleToggleTool = (toolId) => {

    toggleToolMutation.mutate({ toolId });
  };

  if (isLoading) return <Loading />;
  if (error)
    return <>Error fetching tools: {error.message}</>;

  return (
    <Container>
      {tools && tools.length > 0 ? (
        tools.map((tool) => (
          <SwitchContainer key={tool.id}>
            <Label>{tool.name}</Label>
            <Switch
              checked={tool.assigned}
              onChange={() => handleToggleTool(tool.id)}
            />
          </SwitchContainer>
        ))
      ) : (
        <p>No tools available.</p>
      )}
    </Container>
  );
};

export default ToolSettings;

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Label = styled.span``;

const Switch = styled.input.attrs({ type: "checkbox" })`
  position: relative;
  width: 40px;
  height: 20px;
  -webkit-appearance: none;
  background: #ddd;
  outline: none;
  border-radius: 20px;
  transition: 0.4s;
  cursor: pointer;

  &:checked {
    background: var(--main-gradient);
  }

  &:before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    top: 1px;
    left: 1px;
    background: #fff;
    transition: 0.4s;
  }

  &:checked:before {
    transform: translateX(20px);
  }
`;
