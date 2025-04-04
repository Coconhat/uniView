"use client";

import { useState } from "react";
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
  },
];

export default function DynamicFrameLayout() {
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null
  );
  const [hoverSize, setHoverSize] = useState(6);
  const [gapSize, setGapSize] = useState(4);
  const [showControls, setShowControls] = useState(false);
  const [cleanInterface, setCleanInterface] = useState(true);
  const [showFrames, setShowFrames] = useState(false); // Update: showFrames starts as false

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

  const updateCodebase = () => {
    console.log("Updating codebase with current values:");
    console.log("Hover Size:", hoverSize);
    console.log("Gap Size:", gapSize);
    console.log("Frames:", frames);
    // Here you would typically make an API call to update the codebase
    // For now, we'll just log the values
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
            <Button onClick={updateCodebase}>Update Codebase</Button>
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

          return (
            <motion.div
              key={frame.id}
              className="relative flex flex-col"
              style={{ transformOrigin }}
              onMouseEnter={() => setHovered({ row, col })}
              onMouseLeave={() => setHovered(null)}
            >
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
                label={`Frame ${frame.id}`}
                showFrame={showFrames}
                isHovered={hovered?.row === row && hovered?.col === col}
              />
              {/* <Button
                className="mt-2 w-full"
                variant="outline"
                onClick={() => console.log(`Clicked frame ${frame.id}`)}
              >
                Review
              </Button> */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
