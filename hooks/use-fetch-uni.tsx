"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useFetchUniversity = (acronym: string) => {
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const { data, error } = await supabase
          .from("university")
          .select("*")
          .ilike("acronym", acronym)
          .maybeSingle();

        if (error) throw error;
        setUniversity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [acronym]);
  return { university, loading, error };
};
