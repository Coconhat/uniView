"use client";

import { useState } from "react";
import DynamicFrameLayout from "../components/DynamicFrameLayout";
import { ppEditorialNewUltralightItalic, inter } from "./fonts";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [headerSize] = useState(1.2); // 120% is the default size
  const [textSize] = useState(0.8); // 80% is the default size

  return (
    <div
      className={`min-h-screen bg-[#141414] flex items-center justify-center p-8 ${ppEditorialNewUltralightItalic.variable} ${inter.variable}`}
    >
      <div className="w-full h-full flex flex-col md:flex-row items-start gap-8 md:gap-8">
        {/* Left Content */}
        <div className="w-full md:w-[260px] flex-shrink-0 flex flex-col justify-between h-full">
          <div className="flex flex-col gap-16">
            <h1
              className={`${ppEditorialNewUltralightItalic.className} text-4xl md:text-6xl font-light italic text-white/80 tracking-tighter leading-[130%]`}
              style={{ fontSize: `${4 * headerSize}rem` }}
            >
              Review University
              <br />
              in the
              <br />
              Philippines.
            </h1>
            <div
              className={`${inter.className} flex flex-col gap-12 text-white/50 text-sm font-light max-w-[300px]`}
              style={{ fontSize: `${0.875 * textSize}rem` }}
            >
              <div className="space-y-6">
                <div className="h-px bg-white/10 w-full" />
                <p>
                  Choosing the right school is one of the biggest decisions
                  you’ll make—and we’re here to help! School Reviews is a
                  student-powered platform where you can find real, unbiased
                  ratings and feedback about universities and colleges across
                  the Philippines.
                </p>
                <ul className="list-disc list-inside">
                  <li>Looking for the best school for your dream course?</li>
                  <li>
                    Wondering if a university has good professors, strong job
                    placement, or a fun campus life?
                  </li>
                  <li>
                    Need warnings about slow admin, overcrowded classes, or
                    hidden fees?
                  </li>
                </ul>
                <p>
                  We’ve got you covered! Browse our latest reviews, vote on your
                  own experiences, and make smarter choices for your education.
                </p>
                <div className="h-px bg-white/10 w-full" />
              </div>
            </div>
            <Link
              href="https://github.com/coconhat"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 relative opacity-80 hover:opacity-100 transition-opacity"
            >
              <p> Made by Nv</p>
            </Link>
          </div>
        </div>

        {/* Right Content */}
        <div className="w-full md:flex-grow h-[60vh] md:h-[80vh]">
          <DynamicFrameLayout />
        </div>
      </div>
    </div>
  );
}
