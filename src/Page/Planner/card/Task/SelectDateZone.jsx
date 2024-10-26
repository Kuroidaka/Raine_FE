import { Fragment, useContext } from "react";
import styled from "styled-components";
import Flatpickr from "react-flatpickr";
import TaskContext from "../../../../context/Task.context";
import EmptyData from "../../EmptyData";
import ModalContext from "../../../../context/Modal.context";
import DateZoneLabel from "./DateZoneLabel";
import { Card } from "./TaskCard";

const SelectTaskDate = () => {
  // State to store the selected date range
  const { handleGetTaskDateRange, setDateRange, dateRange, groupedTasks } = useContext(TaskContext)
  const modalContext = useContext(ModalContext)

  const onSelectDate = (selectedDates) => {
    // (selectedDates) => setDateRange(selectedDates)
    console.log("selectedDates", selectedDates)
    setDateRange(selectedDates)
    
    console.log("selectedDates.length", selectedDates.length)
    if(selectedDates.length === 2) {
      handleGetTaskDateRange({startDate: selectedDates[0], endDate: selectedDates[1]})
    }
  }



  const renderTaskDateRange = () => {
    if(Object.keys(groupedTasks).length === 0) {
      return <EmptyData sec="task" openModal={modalContext.openModal} />
    }

    return Object.keys(groupedTasks).map((date, idx) => {
        return (
          <Fragment key={idx}>
            <DateZoneLabel
              name="dateAfterTomorrow"
              className="mb-10 mt-40"
              title={date}
              num={groupedTasks[date].length}
            />
            {groupedTasks[date].map((data, idx) => {
              return <Card key={idx} data={data} />;
            })}
          </Fragment>
        );
      })
  }

  return (
    <Container>
      <StyledFlatpickr
        value={dateRange}
        onChange={onSelectDate}
        options={{
          mode: "range", // Enables range selection
          dateFormat: "Y-m-d", // Date format
        }}
        placeholder="Select date range"
      />

      {renderTaskDateRange()}
      
    </Container>
  );
};

export default SelectTaskDate;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledFlatpickr = styled(Flatpickr)`
  width: 50%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  color: #333;
  font-size: 1.5rem;
  text-align: center;
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

