"use client";

import { useGetProjectAnalytics } from "../api/use-get-project-analytics";
import { Analytics } from "./analytics";

interface AnalyticsProps {
  projectId: string;
}

export const ProjectAnalytics = ({ projectId }: AnalyticsProps) => {
  const { data, isLoading } = useGetProjectAnalytics({ projectId });

  return <Analytics data={data} isLoading={isLoading} />;
};
