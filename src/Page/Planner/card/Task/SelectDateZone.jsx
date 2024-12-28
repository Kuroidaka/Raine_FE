import { Fragment, useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Flatpickr from "react-flatpickr";
import TaskContext from "../../../../context/Task.context";
import EmptyData from "../../EmptyData";
import ModalContext from "../../../../context/Modal.context";
import DateZoneLabel from "./DateZoneLabel";
import TaskCard from "./TaskCard";
import SelectComponent from "../../../../component/SelectOption";

const options = [
  { label: 'health', value: 'health' },
  { label: 'play', value: 'play' },
  { label: 'spirituality', value: 'spirituality' },
  { label: 'environment', value: 'environment' },
  { label: 'work', value: 'work' },
  { label: 'finance', value: 'finance' },
  { label: 'development', value: 'development' },
  { label: 'relationships', value: 'relationships' },
]


const SelectTaskDate = () => {
  // State to store the selected date range
  const { handleGetTaskDateRange, setDateRange, dateRange, groupedTasks } =
    useContext(TaskContext);
  const modalContext = useContext(ModalContext);
  const [areaKeyword, setAreaKeyword] = useState(null)
  const [selectedDates, setSelectedDates] = useState([])

  const onSelectDate = (selectedDates) => {
    setDateRange(selectedDates);
    setSelectedDates(selectedDates)
  };

  useEffect(() => {
    const fetchFilter = async () => {
      console.log("areaKeyword", areaKeyword)
      if (selectedDates.length === 2 || areaKeyword) {
        await handleGetTaskDateRange({
          startDate: selectedDates[0],
          endDate: selectedDates[1],
          areaKeyword: areaKeyword
        });
      }
    }

    fetchFilter()
  }, [selectedDates, areaKeyword]);
  const renderTaskDateRange = () => {
    if (Object.keys(groupedTasks).length === 0) {
      return <EmptyData sec="task" openModal={modalContext.openModal} />;
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
            return <TaskCard key={idx} data={data} />;
          })}
        </Fragment>
      );
    });
  };

  return (
    <Container>
      <FilterMethod>
        <SelectComponent
          options={options}
          onChange={(value) => setAreaKeyword(value)}
        />
        <StyledFlatpickr
          value={dateRange}
          onChange={onSelectDate}
          options={{
            mode: "range", // Enables range selection
            dateFormat: "Y-m-d", // Date format
          }}
          placeholder="Select date range"
        />
      </FilterMethod>

      {renderTaskDateRange()}
    </Container>
  );
};

export default SelectTaskDate;

const Container = styled.div`
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

const FilterMethod = styled.div`
  display: flex;
  justify-content: flex-start;
  gap:10px;
`;
