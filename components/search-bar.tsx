"use client";

import { useUniversities } from "@/hooks/use-universities";
import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";
import { inter } from "@/app/fonts";

export function SearchInput() {
  const placeholders = [
    "Search for a university",
    "Rate your university",
    "Look up your college",
    "Discover your university",
    "Find your college",
  ];

  const { university, loading, error } = useUniversities();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[10rem] mb-10 flex flex-col justify-center  items-center px-4">
      <h2
        className={`mb-7 sm:mb-15 text-3xl text-center sm:text-5xl font-light text-white ${inter.className}`}
      >
        Search for a university
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
