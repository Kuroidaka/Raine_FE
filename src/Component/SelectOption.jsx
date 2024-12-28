import { useState } from "react";
import styled from "styled-components";
import { Area } from "../page/Planner/modal/TaskModal";

const SelectComponent = (p) => {
  const { label, options, onChange } = p;
  const [selectedValue, setSelectedValue] = useState("");
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown visibility

  const handleSelect = (value) => {
    console.log("value", value)
    setSelectedValue(value);
    setIsOpen(false); 
    onChange && onChange(value);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the dropdown
  };

  return (
    <SelectWrapper>
      {label && <StyledLabel>{label}</StyledLabel>}
      <Dropdown>
        <DropdownButton onClick={toggleDropdown}>
          <Area data={selectedValue} />
          <p>{selectedValue || "Select an option"}</p>
        </DropdownButton>
        {isOpen && ( // Render the dropdown menu only if it's open
          <DropdownMenu>
            {options.map((option, index) => (
              <DropdownItem
                key={index}
                onClick={() => handleSelect(option.value)}
              >
                <Area data={option.label} />
                <span>{option.label}</span>
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </Dropdown>
    </SelectWrapper>
  );
};

export default SelectComponent;

// Usage Example
// const options = [
//   { label: 'Option 1', value: '1' },
//   { label: 'Option 2', value: '2' },
//   { label: 'Option 3', value: '3' },
// ];
// <SelectComponent label="Choose an option" options={options} onChange={(value) => console.log(value)} />

const SelectWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
`;

const StyledLabel = styled.label`
  font-size: 14px;
  margin-bottom: 8px;
  color: #333;
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  font-size: 14px;
  color: #333;
  cursor: pointer;

  &:hover {
    border-color: #555;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 10;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #333;

  &:hover {
    background: #f0f0f0;
  }

  svg {
    margin-right: 8px;
  }
`;
