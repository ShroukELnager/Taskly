"use client";

import React, { useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/app/hooks/useDebounce";

import {
  GetTasksCalendarStats,
  GetTasksPerProject,
} from "@/app/services/statistics.service";

import TotalsCard from "@/app/components/myStatistics/TotalsCard/TotalsCard";
import StatsCards from "@/app/components/myStatistics/StatsCards/StatsCards";
import StatsGrid from "@/app/components/myStatistics/StatsGrid/StatsGrid";
import StatsFilters from "@/app/components/myStatistics/statusFilter/statusFilter";
import StatsHeader from "@/app/components/myStatistics/StatsHeader/StatsHeader";
import ProjectsTasksCard from "@/app/components/myStatistics/ProjectsTasksCard/ProjectsTasksCard";

export default function MyStatistics() {
  const [filters, setFilters] = useState({
    from: null,
    to: null,
    project: null,
    status: null,
  });

  const debouncedFilters = useDebounce(filters, 600);



  const statesDataPayload = {
    p_start_date: debouncedFilters.from,
    p_end_date: debouncedFilters.to,
    p_project_id: debouncedFilters.project,
    p_status: debouncedFilters.status,
  };
  const projectsDataPayload = {
    p_start_date: debouncedFilters.from,
    p_end_date: debouncedFilters.to,

  };



  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["calendar-stats", statesDataPayload],

    queryFn: async () => {
      const res = await GetTasksCalendarStats(statesDataPayload);

      return res.data || res;
    },

    enabled: !!debouncedFilters.from && !!debouncedFilters.to,
  });


  const {
    data: projectsData,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["tasks-per-project", projectsDataPayload],

    queryFn: async () => {
      const res = await GetTasksPerProject(projectsDataPayload);

      return res.data || res;
    },

    enabled: !!debouncedFilters.from && !!debouncedFilters.to,
  });



  useEffect(() => {
    if (statsData) {
      console.log("CALENDAR STATS:", statsData);
    }
  }, [statsData]);

  useEffect(() => {
    if (projectsData) {
      console.log("PROJECTS DATA:", projectsData);
    }
  }, [projectsData]);



  const statusColors = {
    DONE: "bg-green-100 text-green-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-sky-100 text-sky-700",
    BLOCKED: "bg-red-100 text-red-700",
    REOPENED: "bg-orange-100 text-orange-700",
    TODO: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="mx-auto w-full max-w-[1500px]">
      <div className="hidden lg:block">
        <StatsHeader />
      </div>

      <StatsFilters setFilters={setFilters} />

      {/* LOADING */}
      {(statsLoading || projectsLoading) && (
        <div className="mt-8 text-center text-lg">
          Loading...
        </div>
      )}

      {/* ERRORS */}
      {(statsError || projectsError) && (
        <div className="mt-8 text-center text-red-500">
          Something went wrong
        </div>
      )}

      {/* CALENDAR DATA */}
    {statsData && (
  <>
    {/* TOP SECTION */}
    <div className="mt-6 rounded-lg bg-[#F7F8FC] p-4 sm:p-5">
      <StatsCards data={statsData} />

      <StatsGrid
        data={statsData}
        statusColors={statusColors}
      />
    </div>

    {/* BOTTOM CARDS */}
    <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
      
      {/* LEFT */}
      <TotalsCard totals={statsData.totals} />

      {/* RIGHT */}
      {projectsData && (
        <ProjectsTasksCard projects={projectsData} />
      )}
    </div>
  </>

)}
    </div>
  );
}
