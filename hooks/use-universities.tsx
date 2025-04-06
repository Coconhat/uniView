"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useUniversities = (acronym?: string) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cachedData = localStorage.getItem("universities");
        const cachedTimestamp = localStorage.getItem("universitiesTimestamp");

        // For single university requests, try cache first
        if (acronym && cachedData && cachedTimestamp) {
          const age = Date.now() - parseInt(cachedTimestamp);
          if (age < 5 * 60 * 1000) {
            const universities = JSON.parse(cachedData);
            const university = universities.find(
              (u: any) => u.acronym.toLowerCase() === acronym.toLowerCase()
            );
            if (university) {
              setData(university);
              setLoading(false);
              return;
            }
          }
        }

        // Fetch fresh data
        if (acronym) {
          const { data: singleData, error: singleError } = await supabase
            .from("university")
            .select("*")
            .eq("acronym", acronym.toUpperCase())
            .maybeSingle();

          if (singleError) throw singleError;
          setData(singleData);
        } else {
          const { data: allData, error: allError } = await supabase
            .from("university")
            .select("id, acronym, name, picture, rating")
            .order("name", { ascending: true });

          if (allError) throw allError;

          localStorage.setItem("universities", JSON.stringify(allData));
          localStorage.setItem("universitiesTimestamp", Date.now().toString());
          setData(allData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [acronym]);

  return {
    data,
    loading,
    error,
    allUniversities: !acronym ? data : null,
    university: acronym ? data : null,
  };
};
