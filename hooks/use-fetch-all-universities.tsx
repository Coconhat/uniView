"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const useFetchAllUniversity = () => {
  const [university, setUniversity] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const { data, error } = await supabase
          .from("university")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        setUniversity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, []);
  return { university, loading, error };
};
