"use client";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      cacheTime: 10 * 60 * 1000, // 10 minutes cache
    },
  },
});

const fetchAllUniversities = async () => {
  const cachedData = localStorage.getItem("universities");
  const cachedTimestamp = localStorage.getItem("universitiesTimestamp");

  // Return cached data if it's fresh enough
  if (cachedData && cachedTimestamp) {
    const age = Date.now() - parseInt(cachedTimestamp);
    if (age < 5 * 60 * 1000) {
      return JSON.parse(cachedData);
    }
  }

  const { data, error } = await supabase
    .from("university")
    .select("id, acronym, name, picture")
    .order("name", { ascending: true });

  if (error) throw error;

  // Update local storage cache
  localStorage.setItem("universities", JSON.stringify(data));
  localStorage.setItem("universitiesTimestamp", Date.now().toString());

  return data;
};

const fetchUniversity = async (acronym: string) => {
  // Check if we have cached data first
  const cachedData = localStorage.getItem("universities");
  if (cachedData) {
    const universities = JSON.parse(cachedData);
    const university = universities.find(
      (u: any) => u.acronym.toLowerCase() === acronym.toLowerCase()
    );
    if (university) return university;
  }

  // Fallback to API if not found in cache
  const { data, error } = await supabase
    .from("university")
    .select("*")
    .eq("acronym", acronym.toUpperCase())
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const useUniversities = (acronym?: string) => {
  const queryClient = useQueryClient();

  // Query for all universities
  const allQuery = useQuery({
    queryKey: ["universities"],
    queryFn: fetchAllUniversities,
    enabled: !acronym,
  });

  // Query for single university
  const singleQuery = useQuery({
    queryKey: ["university", acronym],
    queryFn: () => fetchUniversity(acronym!),
    enabled: !!acronym,
    initialData: () => {
      if (!acronym) return undefined;
      const cached = queryClient.getQueryData(["universities"]) as
        | any[]
        | undefined;
      return cached?.find(
        (u) => u.acronym.toLowerCase() === acronym.toLowerCase()
      );
    },
  });

  // Prefetch all universities when component mounts
  useEffect(() => {
    if (!acronym) {
      queryClient.prefetchQuery({
        queryKey: ["universities"],
        queryFn: fetchAllUniversities,
      });
    }
  }, [acronym, queryClient]);

  return {
    data: acronym ? singleQuery.data : allQuery.data,
    loading: acronym ? singleQuery.isLoading : allQuery.isLoading,
    error: acronym ? singleQuery.error : allQuery.error,
    allUniversities: !acronym ? allQuery.data : null,
    university: acronym ? singleQuery.data : null,
  };
};

export const QueryProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
