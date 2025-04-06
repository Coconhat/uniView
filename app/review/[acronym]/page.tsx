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
import { Form } from "react-hook-form";
import { useFetchUniversity } from "@/hooks/use-fetch-uni";
import LoadingState from "@/components/loading-state";
import ErrorState from "@/components/error-state";
import NotFoundState from "@/components/not-found-state";
import { useUniversities } from "@/hooks/use-universities";

export default function Page({ params }: { params: { acronym: string } }) {
  const [headerSize] = useState(1.2);
  const [textSize] = useState(0.8);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const { acronym } = React.use(params);

  const { university, loading, error } = useUniversities(acronym);
  useEffect(() => {
    const fetchReviews = async () => {
      if (!university) return;
      try {
        const { data, error } = await supabase
          .from("review")
          .select("*")
          .eq("university_id", university.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [university]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!university) return <NotFoundState />;

  const handleReviewSubmit = async (formData: FormData) => {
    if (!university) return;

    try {
      const { error } = await supabase.from("review").insert({
        university_id: university.id,
        author_name: formData.get("name"),
        rating: rating,
        comment: formData.get("comment"),
      });

      if (error) throw error;

      const { data } = await supabase
        .from("review")
        .select("*")
        .eq("university_id", university.id)
        .order("created_at", { ascending: false });
      setReviews(data || []);
      setShowModal(false);
    } catch (err) {
      setError("failed to submit review");
    }
    setRating(0);
    setHoverRating(0);
  };

  //calculate average rating
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;
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
            priority
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
                    star <= Math.round(averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-white/30"
                  }`}
                />
              ))}
              <span className="ml-2 text-white/70">
                {" "}
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
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
              {reviews.length} reviews
            </h2>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="p-6 bg-[#1e1e1e] border-[#2e2e2e] hover:border-[#3e3e3e] transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className={`font-semibold text-white ${inter.className}`}
                    >
                      {review.author_name ? review.author_name : "Anonymous"}
                    </h3>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(review.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <h1 className={`text-white/80 font-medium ${inter.className}`}>
                  {review.comment}
                </h1>
                <div className="flex items-center justify-between mt-4">
                  <div className="mt-4 text-sm text-white/50">
                    {new Date(review.created_at).toLocaleDateString()}
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
                <h1
                  className={`${inter.className} text-xl font-semibold text-white`}
                >
                  Write Your Review
                </h1>
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Share your honest experience to help other students
              </DialogDescription>
            </AlertDialogHeader>

            <form
              className="space-y-6 mt-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                await handleReviewSubmit(formData);
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
                <Label htmlFor="comment" className="text-white/80">
                  Your Review
                </Label>
                <Textarea
                  id="comment"
                  name="comment"
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
                  className="border-[#3e3e3e] text-white hover:bg-[#2e2e2e] rounded-xl"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white  text-black rounded-xl"
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
