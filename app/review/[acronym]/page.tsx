"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import DLSU from "@/public/dlsu-logo.png";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Star, StarIcon, ChevronRight, Heart } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { inter, ppEditorialNewUltralightItalic } from "../../fonts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";
import { supabase } from "@/lib/supabase";

export default function Page({ params }: { params: { acronym: string } }) {
  const [headerSize] = useState(1.2);
  const [textSize] = useState(0.8);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [university, setUniversity] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const { data, error } = await supabase
          .from("university")
          .select("*")
          .ilike("acronym", params.acronym) // Case-insensitive match
          .maybeSingle(); // Tolerate empty results

        if (error) throw error;
        setUniversity(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversity();
  }, [params.acronym]);

  if (loading)
    return <div className="text-white text-center p-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center p-8">Error: {error}</div>;
  if (!university)
    return (
      <div className="text-white text-center p-8">University not found</div>
    );

  const handleOpenModal = () => setShowModal(true);

  return (
    <div className={`min-h-screen bg-[#141414] p-8  ${inter.className}`}>
      <div className="mx-auto max-w-4xl">
        {/* School Header */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-12">
          <Image
            src={university?.picture || DLSU}
            height={150}
            width={150}
            alt="De La Salle University"
            className="rounded-lg object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1
              className={`${inter.className} text-3xl font-medium text-white mb-2`}
            >
              {university.name}
            </h1>
            <p className={`text-lg text-white/70 mb-3 ${inter.className}`}>
              {university.location}
            </p>
            <Link
              href={university.website || "https://www.dlsu.edu.ph"}
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
              target="_blank"
            >
              Visit website <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
            <div className="mt-4 flex items-center justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 ${
                    star <= 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-white/70">4.2 (128 reviews)</span>
            </div>
          </div>
        </div>

        {/* Rating Card */}
        <Card
          className={`p-6 mb-12 bg-[#1e1e1e] border-[#2e2e2e] ${inter.className}`}
        >
          <div
            className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${inter.className}`}
          >
            <div className="text-center sm:text-left">
              <h2
                className={`text-xl font-semibold text-white mb-2 ${inter.className}`}
              >
                Share your experience
              </h2>
              <p className="text-white/70">
                How would you rate this university?
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="focus:outline-none"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={`h-6 w-6 ${
                        (hoverRating || rating) >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-white/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <Button
                variant="default"
                className="bg-white hover:bg-white   text-black px-6 py-2 rounded-full transition-colors"
                onClick={handleOpenModal}
              >
                Write a review
              </Button>
            </div>
          </div>
        </Card>

        {/* Reviews Section */}
        <div className={`mb-12 ${inter.className}`}>
          <div className="flex justify-between items-center mb-6">
            <h2
              className={`text-2xl font-semibold text-white ${inter.className}`}
            >
              128 Reviews
            </h2>
          </div>

          <div className="space-y-4">
            {[1, 2].map((review) => (
              <Card
                key={review}
                className="p-6 bg-[#1e1e1e] border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`font-medium text-white ${inter.className}`}>
                      John Doe
                    </h3>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= 4
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-white/80">
                  {review === 1 ? "Great university." : "noob."}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="mt-4 text-sm text-white/50">
                    Reviewed 2 months ago
                  </div>
                  <Button>
                    <Heart />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Review Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="sm:max-w-[500px] bg-[#1e1e1e] border-[#2e2e2e]">
            <AlertDialogHeader>
              <DialogTitle
                className={`text-xl font-semibold text-white ${inter.className}`}
              >
                Write Your Review
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Share your honest experience to help other students
              </DialogDescription>
            </AlertDialogHeader>

            <form
              className="space-y-6 mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get("name") as string,
                  message: formData.get("message") as string,
                  rating: rating,
                };
                console.log("Review submitted:", data);
                setShowModal(false);
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white/80">
                  Your Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  className="bg-[#2e2e2e] border-[#3e3e3e] text-white focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/80">
                  Your Review
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Share your experience..."
                  className="min-h-[150px] bg-[#2e2e2e] border-[#3e3e3e] text-white focus:border-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white/80">Your Rating</Label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none mr-1"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          (hoverRating || rating) >= star
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#3e3e3e] text-white hover:bg-[#2e2e2e]"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={rating === 0}
                >
                  Submit Review
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
