"use client";

import Select from "react-select";

const statusOptions = [
  { value: "TO_DO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "IN_REVIEW", label: "In Review" },
  { value: "READY_FOR_QA", label: "Ready For QA" },
  { value: "REOPENED", label: "Reopened" },
  { value: "READY_FOR_PRODUCTION", label: "Ready For Production" },
  { value: "DONE", label: "Done" },
];

export default function StatusSelect({ onChange }) {
  const handleChange = (selected) => {
    if (onChange) {
      onChange(selected ? selected.value : null);
    }
  };

  return (
    <div className="w-[204px]">
      <Select
        options={statusOptions}
        placeholder="Select Status"
        isClearable
        onChange={handleChange}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            borderRadius: "12px",
            borderColor: state.isFocused
              ? "#0d47c9"
              : "#d9deea",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#0d47c9",
            },
          }),

          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "#0d47c9"
              : state.isFocused
              ? "#edf3ff"
              : "white",
            color: state.isSelected ? "white" : "#1d2b53",
            cursor: "pointer",
          }),

          menu: (base) => ({
            ...base,
            borderRadius: "14px",
            overflow: "hidden",
            zIndex: 50,
          }),

          placeholder: (base) => ({
            ...base,
            color: "#9aa6c1",
          }),
        }}
      />
    </div>
  );
}