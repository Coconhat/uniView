"use client";

import { PlaceholdersAndVanishInput } from "../components/ui/placeholders-and-vanish-input";

export function SearchInput() {
  const placeholders = [
    "Search for a university",
    "Rate your university",
    "Look up your college",
    "Discover your university",
    "Find your college",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="h-[10rem] mb-10 flex flex-col justify-center  items-center px-4">
      <h2 className="mb-7 sm:mb-15 text-xl text-center sm:text-5xl  text-white">
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
