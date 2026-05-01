"use client";
import Cookies from "js-cookie";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { generateBreadcrumbs } from "./generateBreadcrumbs";

export default function Breadcrumbs() {
  const pathname = usePathname();
  const { projectId } = useParams();

  const [projectsMap, setProjectsMap] = useState({});
  const token = Cookies.get("access_token");

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) return;

      try {
        const res = await fetch(
          `https://pcufxstnppfqmzgslxlk.supabase.co/rest/v1/projects?select=id,name&id=eq.${projectId}`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        const data = await res.json();

        const project = data?.[0];


        if (project?.id && project?.name) {
          setProjectsMap({
            [project.id]: project.name,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProject();
  }, [projectId]);

  const breadcrumbs = useMemo(() => {
    return generateBreadcrumbs(pathname, projectsMap);
  }, [pathname, projectsMap]);

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-3 h-3 mx-1 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                />
              </svg>
            )}

            {breadcrumb.href.includes(projectId) ? (
              <span className="text-sm font-medium text-blue-600 cursor-not-allowed">
                {breadcrumb.label}
              </span>
            ) : index === breadcrumbs.length - 1 ? (
              <span className="text-sm font-medium text-blue-600">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                href={breadcrumb.href}
                className="text-sm font-medium text-gray-400 hover:text-blue-600"
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
