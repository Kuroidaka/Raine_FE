import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      <TitleWrapper>
        <Title>
          <h2>Tools</h2>
        </Title>
        {/* <p>Connect a Patreon account for @Kuroidaka to sponsor maintainers with. Get recognition on GitHub for sponsorships made on Patreon when the sponsored person has linked Patreon and GitHub, too, and has a public GitHub Sponsors profile.</p> */}
      </TitleWrapper>

      <ToolsWrapper>
        {tools && tools.length > 0 ? (
          tools.map((tool) => (
            <SwitchContainer key={tool.id}>
              <Label>
                <div className="tool-name">{tool.name}</div>
                <p className="tool-description">{tool.description}</p>
              </Label>
              <Switch
                checked={tool.assigned}
                onChange={() => handleToggleTool(tool.id)}
              />
            </SwitchContainer>
          ))
        ) : (
          <p>No tools available.</p>
        )}
      </ToolsWrapper>
    </Container>
  );
};

export default ToolSettings;

const TitleWrapper = styled.div`
  margin-bottom: 20px;

`

const Title = styled.div` 
  border-bottom: max(1px, 0.0625rem) solid #cfcfcf;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;

  h2 {
    font-size: 2rem;
  }
`

const ToolsWrapper = styled.div `
  border-color: #cfcfcf;
  border-radius: 0.375rem;
  border-style: solid;
  border-width: max(1px, 0.0625rem);

`

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
  padding: 0.5rem;

  & + &{
    border-top: max(1px, 0.0625rem) solid #cfcfcf;
  }
`;

const Label = styled.span`

  .tool-name{
    font-weight: 600;
  }
`;

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
  min-width: 40px;

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
