import React, { useState, ChangeEvent } from "react";
import "./index.css";

interface FilterBarProps<T> {
  options: T[];
  onFilter: (selectedOption: T) => void;
  label: string;
}

function FilterBar<T>({ options, onFilter, label }: FilterBarProps<T>) {
  const [selectedOption, setSelectedOption] = useState<T | null>(null);

  const handleOptionClick = (option: T) => {
    setSelectedOption(option);
    onFilter(option);
  };

  return (
    <div className="filter-bar">
      {/* <label>{label}</label> */}
      <div className="filter-options">
        {options.map((option) => (
          <div
            key={String(option)}
            onClick={() => handleOptionClick(option)}
            className={`filter-button${selectedOption === option ? " selected" : ""}`}
          >
            {String(option)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
