import React, { useState } from "react";
import { inter } from "../app/fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { supabase } from "../lib/supabase";
import { toast } from "../hooks/use-toast"; // Optional for notifications

export default function SuggestionBox() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    acronym: "",
    website: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a school name.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const { name, location, acronym, website } = formData;

      const { data, error } = await supabase.from("suggestion_box").insert([
        {
          name: name,
          location: location,
          acronym: acronym,
          website: website,
        },
      ]);
      if (error) {
        throw error;
      }
      toast({
        title: "Success",
        description: "School submitted successfully.",
        variant: "default",
      });

      setFormData({
        name: "",
        location: "",
        acronym: "",
        website: "",
      });

      setOpen(false);
    } catch (error) {
      console.error("Error submitting school:", error);
      toast({
        title: "Error",
        description: "Failed to submit school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <p className={`mt-1 ${inter.className} cursor-pointer font-medium`}>
          Add Your School
        </p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900">
        <DialogHeader className="bg-white dark:bg-gray-900">
          <DialogTitle
            className={`text-xl ${inter.className} text-gray-900 dark:text-white`}
          >
            Add School Details
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 dark:text-gray-300">
            Only the name is required, but additional details help us improve
            accuracy.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto py-2 px-1 bg-white dark:bg-gray-900">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 bg-white dark:bg-gray-900"
          >
            {/* School Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={`text-sm font-medium ${inter.className} text-gray-900 dark:text-white`}
              >
                School Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. University of the Philippines"
                className={`${inter.className} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className={`text-sm font-medium ${inter.className} text-gray-900 dark:text-white`}
              >
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. Quezon City, Philippines"
                className={`${inter.className} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
            </div>

            {/* Acronym */}
            <div className="space-y-2">
              <Label
                htmlFor="acronym"
                className={`text-sm font-medium ${inter.className} text-gray-900 dark:text-white`}
              >
                Acronym
              </Label>
              <Input
                id="acronym"
                value={formData.acronym}
                onChange={handleInputChange}
                placeholder="e.g. UP, UST, DLSU"
                className={`${inter.className} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label
                htmlFor="website"
                className={`text-sm font-medium ${inter.className} text-gray-900 dark:text-white`}
              >
                School website
              </Label>
              <Input
                id="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="e.g. https://yourschool.edu.ph"
                className={`${inter.className} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 
                  text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit School"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
