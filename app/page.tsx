"use client";

import { useState } from "react";
import DynamicFrameLayout from "../components/DynamicFrameLayout";
import { ppEditorialNewUltralightItalic, inter } from "./fonts";
import Image from "next/image";
import Link from "next/link";
import SuggestionBox from "@/components/suggestion-box";
import { LinkPreview } from "@/components/ui/link-preview";

export default function Home() {
  const [headerSize] = useState(1.2);
  const [textSize] = useState(0.8);

  return (
    <div
      className={`min-h-screen bg-[#141414] flex items-center justify-center p-4 sm:p-8 ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-8">
        {/* Left Content */}
        <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col justify-between h-full text-center md:text-left">
          <div className="flex flex-col gap-8 md:gap-16">
            <h1
              className={`${ppEditorialNewUltralightItalic.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light italic text-white/80 tracking-tighter leading-[130%]`}
              style={{ fontSize: `clamp(2rem, 5vw, ${4 * headerSize}rem)` }}
            >
              Rate Universities
              <br />
              in the
              <br />
              Philippines.
            </h1>
            <div
              className={`${inter.className} flex flex-col gap-6 md:gap-12 text-white/50 text-sm font-light mx-auto md:mx-0 max-w-[300px]`}
              style={{ fontSize: `${0.875 * textSize}rem` }}
            >
              <div className="space-y-6">
                <div className="h-px bg-white/10 w-full" />
                <p className="text-sm">
                  Choosing the right school is one of the biggest decisions
                  you'll make—and we're here to help!{" "}
                  <span className="underline">Uni View</span> is a platform
                  where you can find real, unbiased ratings and feedback about
                  universities and colleges across the Philippines.
                </p>

                <h3 className={`${inter.className} text-sm `}>
                  Made with <span>&lt;3</span> by{" "}
                  <LinkPreview url="https://nhatvu.life/">
                    <span className="underline text-white/80">Nhat Vu</span>
                  </LinkPreview>
                </h3>
                <h3 className={`${inter.className} text-sm `}>
                  <SuggestionBox />
                  <br />
                </h3>

                <div className="h-px bg-white/10 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:flex-grow md:h-[80vh] mt-8 md:mt-0">
          <DynamicFrameLayout />
        </div>
      </div>
    </div>
  );
}
