"use client";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface FrameComponentProps {
  image: string;
  width: number | string;
  height: number | string;
  className?: string;
  label: string;
  showFrame: boolean;
  isHovered: boolean;
}
export function FrameComponent({
  image,
  width,
  height,
  label,
  isHovered,
  className = "",
  showFrame,
}: FrameComponentProps) {
  return (
    <div
      className={`relative ${className}`}
      style={{
        width,
        height,
        transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
      }}
    >
      <div className="relative w-full h-full overflow-hidden">
        {/* Image with Border */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-full h-full overflow-hidden"
            style={{
              transform: `scale(1)`,
              transformOrigin: "center",
              transition: "transform 0.3s ease-in-out",
            }}
          >
            <Image
              className="w-full h-full object-contain"
              src={image}
              alt="School Image"
              width={250}
              height={200}
              priority
            />
          </div>
        </div>

        {/* Frame Elements (Higher z-index) */}
        {showFrame && (
          <div className="absolute inset-0" style={{ zIndex: 2 }}>
            {/* Corners */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat" />
            <div
              className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{
                transform: "scaleX(-1)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{
                transform: "scaleY(-1)",
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
              style={{
                transform: "scale(-1, -1)",
              }}
            />

            {/* Edges */}
            <div
              className="absolute top-0 left-16 right-16 h-16"
              style={{
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
              }}
            />
            <div
              className="absolute bottom-0 left-16 right-16 h-16"
              style={{
                backgroundSize: "auto 64px",
                backgroundRepeat: "repeat-x",
                transform: "rotate(180deg)",
              }}
            />
            <div
              className="absolute left-0 top-16 bottom-16 w-16"
              style={{
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
              }}
            />
            <div
              className="absolute right-0 top-16 bottom-16 w-16"
              style={{
                backgroundSize: "64px auto",
                backgroundRepeat: "repeat-y",
                transform: "scaleX(-1)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
