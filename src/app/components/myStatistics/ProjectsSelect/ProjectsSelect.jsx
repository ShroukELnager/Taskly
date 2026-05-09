"use client";

import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/app/services/projects.service";

export default function ProjectsSelect({ onChange }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const projects = data?.data || data?.projects || [];

  const options = projects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const handleChange = (selected) => {
    if (onChange) {
      onChange(selected ? selected.value : null);
    }
  };

  return (
    <div className="w-[204px]">
      <Select
        options={options}
        isLoading={isLoading}
        placeholder="Select Project"
        isClearable
        onChange={handleChange}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "48px",
            height: "48px",
            borderRadius: "12px",
            borderColor: state.isFocused
              ? "#0d47c9"
              : "#d9deea",
            boxShadow: "none",
            "&:hover": {
              borderColor: "#0d47c9",
            },
          }),

          valueContainer: (base) => ({
            ...base,
            height: "48px",
            padding: "0 12px",
          }),

          input: (base) => ({
            ...base,
            margin: 0,
            padding: 0,
          }),

          indicatorsContainer: (base) => ({
            ...base,
            height: "48px",
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

      {error && (
        <p className="mt-2 text-sm text-red-500">
          Failed to load projects
        </p>
      )}
    </div>
  );
}