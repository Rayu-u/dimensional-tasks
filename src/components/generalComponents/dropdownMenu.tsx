import React from "react";

interface DropDownProps {
  introText: string;
  expendable?: boolean;
  disabled?: boolean;
  selectedValue: string;
  expendingValue?: string;
  possibleValues: string[];
  onSelectedChange: (selectedIndex: number) => void;
  canBeNone?: boolean;
}

const DropDown: React.FC<DropDownProps> = ({
  introText,
  expendable = false,
  disabled = false,
  selectedValue,
  expendingValue,
  possibleValues,
  onSelectedChange,
  canBeNone = false,
}) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const i = possibleValues.findIndex((name) => event.target.value == name);
    onSelectedChange(i);
  };

  return (
    <form>
      <label htmlFor="Dropdown">{introText}</label>
      <select
        disabled={disabled}
        value={selectedValue}
        onChange={handleSelectChange}
      >
        <option value="" disabled={!canBeNone}>
          {canBeNone ? "None" : "Select..."}
        </option>
        {possibleValues.map((name, index) => {
          return (
            <option key={index} value={name}>
              {name}
            </option>
          );
        })}
        {expendable && <option value={expendingValue}>{expendingValue}</option>}
      </select>
    </form>
  );
};

export default DropDown;
