import { useState, useEffect } from 'react';

type DashboardStats = {
  [key: string]: {
    value: string;
    trend: string;
    progress: number;
  };
};

type ChartDataPoint = {
  name: string;
  date: string;
  messages: number;
  replies: number;
  tasks: number;
  completedTasks: number;
  score: number;
};

type PerformanceDataPoint = {
  name: string;
  value: number;
  color: string;
};

type MonthlyDataPoint = {
  name: string;
  productivity: number;
  growth: number;
};

type TeamPerformance = {
  name: string;
  score: number;
  members: number;
  tasks: number;
  efficiency: number;
  aiScore?: number;
};

type ActivityItem = {
  user: string;
  action: string;
  time: string;
  type: "success" | "warning" | "info";
};

type DashboardData = {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  performanceData: PerformanceDataPoint[];
  monthlyData: MonthlyDataPoint[];
  teamPerformance?: TeamPerformance[];
  activities: ActivityItem[];
  role: "ADMIN" | "USER";
};

export function useDashboardData(role: "ADMIN" | "USER") {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all dashboard data in parallel
      const [statsResponse, analyticsResponse, activitiesResponse, teamsResponse] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/analytics'),
        fetch('/api/dashboard/activities'),
        fetch('/api/dashboard/teams')
      ]);

      // Check if all requests were successful
      if (!statsResponse.ok || !analyticsResponse.ok || !activitiesResponse.ok || !teamsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const [statsData, analyticsData, activitiesData, teamsData] = await Promise.all([
        statsResponse.json(),
        analyticsResponse.json(),
        activitiesResponse.json(),
        teamsResponse.json()
      ]);

      setData({
        stats: statsData.stats,
        role: statsData.role,
        chartData: analyticsData.chartData,
        performanceData: analyticsData.performanceData,
        monthlyData: analyticsData.monthlyData || teamsData.monthlyData,
        teamPerformance: teamsData.teamPerformance,
        activities: activitiesData.activities
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const refetch = () => {
    fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
}