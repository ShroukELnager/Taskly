
import { format } from "date-fns";
import ProjectsSelect from "../ProjectsSelect/ProjectsSelect";
import StatusSelect from "../StatusSelect/StatusSelect";
import { DatePicker } from "../datePicker/datePicker";

export default function StatsFilters({ setFilters }) {
 return (
  <div className="flex flex-col items-center gap-4 rounded-2xl bg-[#F1F3FF] p-4 lg:flex-row lg:items-start lg:justify-between">
    
    {/* mobile */}
    <div className="flex flex-col items-center gap-3 lg:hidden">
      <DatePicker
        onChange={(range) => {
          setFilters((prev) => ({
            ...prev,
            from: range.from
              ? format(new Date(range.from), "yyyy-MM-dd")
              : null,
            to: range.to
              ? format(new Date(range.to), "yyyy-MM-dd")
              : null,
          }));
        }}
      />

      <ProjectsSelect
        onChange={(val) =>
          setFilters((prev) => ({ ...prev, project: val }))
        }
      />

      <StatusSelect
        onChange={(val) =>
          setFilters((prev) => ({ ...prev, status: val }))
        }
      />
    </div>

    {/* desktop */}
    <div className="hidden w-full items-start justify-between lg:flex">
      <DatePicker
        onChange={(range) => {
          setFilters((prev) => ({
            ...prev,
            from: range.from
              ? format(new Date(range.from), "yyyy-MM-dd")
              : null,
            to: range.to
              ? format(new Date(range.to), "yyyy-MM-dd")
              : null,
          }));
        }}
      />

      <div className="flex items-center gap-3">
        <ProjectsSelect
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, project: val }))
          }
        />

        <StatusSelect
          onChange={(val) =>
            setFilters((prev) => ({ ...prev, status: val }))
          }
        />
      </div>
    </div>
  </div>
);
}