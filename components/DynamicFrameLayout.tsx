"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FrameComponent } from "./FrameComponent";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import DLSL from "@/public/dlsl.png";
import DLSU from "@/public/dlsu-logo.png";
import UP from "@/public/up-logo.png";
import UST from "@/public/ust-logo.jpg";
import LPU from "@/public/lpu-logo.png";
import ATENEO from "@/public/ateneo-logo.png";
import POLY from "@/public/poly-logo.png";
import NU from "@/public/nu-logo.png";
import UE from "@/public/ue-logo.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { inter } from "@/app/fonts";

const GRID_SIZE = 12;
const CELL_SIZE = 60; // pixels per grid cell

interface Frame {
  id: number;
  image: any;
  defaultPos: { x: number; y: number; w: number; h: number };
  corner: string;
  edgeHorizontal: string;
  edgeVertical: string;
  mediaSize: number;
  borderThickness: number;
  borderSize: number;
  isHovered: boolean;
  acronym: string;
  name: string; // Added full name for better UX
}

const initialFrames: Frame[] = [
  {
    id: 1,
    image: DLSL,
    defaultPos: { x: 0, y: 0, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "DLSL",
    name: "De La Salle Lipa",
  },
  {
    id: 2,
    image: DLSU,
    defaultPos: { x: 4, y: 0, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "DLSU",
    name: "De La Salle University",
  },
  {
    id: 3,
    image: UP,
    defaultPos: { x: 8, y: 0, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "UP",
    name: "University of the Philippines",
  },
  {
    id: 4,
    image: ATENEO,
    defaultPos: { x: 0, y: 4, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "ATENEO",
    name: "Ateneo de Manila University",
  },
  {
    id: 5,
    image: UST,
    defaultPos: { x: 4, y: 4, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "UST",
    name: "University of Santo Tomas",
  },
  {
    id: 6,
    image: LPU,
    defaultPos: { x: 8, y: 4, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "LPU",
    name: "Lyceum of the Philippines University",
  },
  {
    id: 7,
    image: POLY,
    defaultPos: { x: 0, y: 8, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "POLY",
    name: "Polytechnic University of the Philippines",
  },
  {
    id: 8,
    image: NU,
    defaultPos: { x: 4, y: 8, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "NU",
    name: "National University",
  },
  {
    id: 9,
    image: UE,
    defaultPos: { x: 8, y: 8, w: 4, h: 4 },
    corner: "https://via.placeholder.com/50",
    edgeHorizontal: "https://via.placeholder.com/50",
    edgeVertical: "https://via.placeholder.com/50",
    mediaSize: 1,
    borderThickness: 0,
    borderSize: 80,
    isHovered: false,
    acronym: "UE",
    name: "University of the East",
  },
];

export default function DynamicFrameLayout() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [hovered, setHovered] = useState<{
    row: number;
    col: number;
    id: number;
  } | null>(null);
  const [hoverSize, setHoverSize] = useState(6);
  const [gapSize, setGapSize] = useState(4);
  const [showControls, setShowControls] = useState(false);
  const [cleanInterface, setCleanInterface] = useState(true);
  const [showFrames, setShowFrames] = useState(false);
  const router = useRouter();

  const GRID_COLUMNS = 3; // 3 columns per row
  const CELL_SIZE = 4; // Each cell is 4x4 grid units

  const calculatePosition = (index: number) => {
    const row = Math.floor(index / GRID_COLUMNS);
    const col = index % GRID_COLUMNS;

    return {
      x: col * CELL_SIZE,
      y: row * CELL_SIZE,
      w: CELL_SIZE,
      h: CELL_SIZE,
    };
  };

  const getRowSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr";
    }
    const { row } = hovered;
    const nonHoveredSize = (12 - hoverSize) / 2;
    return [0, 1, 2]
      .map((r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ");
  };

  const getColSizes = () => {
    if (hovered === null) {
      return "4fr 4fr 4fr";
    }
    const { col } = hovered;
    const nonHoveredSize = (12 - hoverSize) / 2;
    return [0, 1, 2]
      .map((c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
      .join(" ");
  };

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom";
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right";
    return `${vertical} ${horizontal}`;
  };

  const updateFrameProperty = (
    id: number,
    property: keyof Frame,
    value: number
  ) => {
    setFrames(
      frames.map((frame) =>
        frame.id === id ? { ...frame, [property]: value } : frame
      )
    );
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const toggleCleanInterface = () => {
    setCleanInterface(!cleanInterface);
    if (!cleanInterface) {
      setShowControls(false);
    }
  };

  const handleFrameHover = (row: number, col: number, id: number) => {
    setHovered({ row, col, id });
    // Update hovered state for individual frames
    setFrames(
      frames.map((frame) => ({
        ...frame,
        isHovered: frame.id === id,
      }))
    );
  };

  const handleFrameClick = (acronym: string) => {
    router.push(`/review/${acronym}`);
  };

  return (
    <div className="space-y-4 w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4"></div>
      </div>
      {!cleanInterface && (
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">
            Dynamic Frame Layout
          </h2>
          <div className="space-x-2">
            <Button onClick={toggleControls}>
              {showControls ? "Hide Controls" : "Show Controls"}
            </Button>
            <Button onClick={toggleCleanInterface}>
              {cleanInterface ? "Show UI" : "Hide UI"}
            </Button>
          </div>
        </div>
      )}
      {!cleanInterface && showControls && (
        <>
          <div className="space-y-2">
            <label
              htmlFor="hover-size"
              className="block text-sm font-medium text-gray-200"
            >
              Hover Size: {hoverSize}
            </label>
            <Slider
              id="hover-size"
              min={4}
              max={8}
              step={0.1}
              value={[hoverSize]}
              onValueChange={(value) => setHoverSize(value[0])}
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="gap-size"
              className="block text-sm font-medium text-gray-200"
            >
              Gap Size: {gapSize}px
            </label>
            <Slider
              id="gap-size"
              min={0}
              max={20}
              step={1}
              value={[gapSize]}
              onValueChange={(value) => setGapSize(value[0])}
            />
          </div>
        </>
      )}
      <div
        className="relative w-full h-full"
        style={{
          display: "grid",
          gridTemplateRows: getRowSizes(),
          gridTemplateColumns: getColSizes(),
          gap: `${gapSize}px`,
          transition:
            "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
        }}
      >
        {frames.map((frame) => {
          const row = Math.floor(frame.defaultPos.y / 4);
          const col = Math.floor(frame.defaultPos.x / 4);
          const transformOrigin = getTransformOrigin(
            frame.defaultPos.x,
            frame.defaultPos.y
          );
          const isCurrentlyHovered = hovered?.id === frame.id;

          return (
            <motion.div
              key={frame.id}
              className={`relative flex flex-col cursor-pointer group overflow-hidden rounded-lg ${
                isCurrentlyHovered ? "z-10" : ""
              }`}
              style={{ transformOrigin }}
              onMouseEnter={() => handleFrameHover(row, col, frame.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => handleFrameClick(frame.acronym)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative flex-1 w-full h-full">
                <FrameComponent
                  image={frame.image}
                  width="100%"
                  height="100%"
                  className="flex-1"
                  corner={frame.corner}
                  edgeHorizontal={frame.edgeHorizontal}
                  edgeVertical={frame.edgeVertical}
                  mediaSize={frame.mediaSize}
                  borderThickness={frame.borderThickness}
                  borderSize={frame.borderSize}
                  onMediaSizeChange={(value) =>
                    updateFrameProperty(frame.id, "mediaSize", value)
                  }
                  onBorderThicknessChange={(value) =>
                    updateFrameProperty(frame.id, "borderThickness", value)
                  }
                  onBorderSizeChange={(value) =>
                    updateFrameProperty(frame.id, "borderSize", value)
                  }
                  showControls={showControls && !cleanInterface}
                  label={frame.name}
                  showFrame={showFrames}
                  isHovered={isCurrentlyHovered}
                />

                {/* Overlay with university name and "View Reviews" button  */}
                {/* <div
                  className={`z-50 absolute inset-0 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 ${
                    isCurrentlyHovered ? " bg-opacity-60" : "opacity-0"
                  } group-hover:opacity-100  group-hover:bg-opacity-60`}
                >
                  <div className="text-center px-4 text-[#141414]  bg-white  rounded-full py-2 ">
                    <h3
                      className={` rounded-xl  text-xl font-bold mb-2 py-1 px-2 ${inter.className} `}
                    >
                      {frame.name}
                    </h3>
                    <h3
                      className={` rounded-xl text-sm mb-4 ${inter.className}`}
                    >
                      Click to view reviews
                    </h3>
                  </div>
                </div> */}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
