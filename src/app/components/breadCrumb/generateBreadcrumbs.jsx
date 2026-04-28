export function generateBreadcrumbs(pathname, projectsMap = {}) {
  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = [];
  let currentPath = "";

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;

    const segment = segments[i];

    const label =
      projectsMap[segment] || formatSegmentLabel(segment);

    breadcrumbs.push({
      label: String(label),
      href: currentPath,
    });
  }

  return breadcrumbs;
}

function formatSegmentLabel(segment) {
  const staticRouteLabels = {
    projects: "Projects",
    epics: "Epics",
    tasks: "Tasks",
    members: "Members",
  };

  if (staticRouteLabels[segment]) {
    return staticRouteLabels[segment];
  }

  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}