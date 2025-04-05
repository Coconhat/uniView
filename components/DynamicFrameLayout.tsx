"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FrameComponent } from "./FrameComponent";
import { useRouter } from "next/navigation";
import { useFetchAllUniversity } from "@/hooks/use-fetch-all-universities";

interface University {
  id: number;
  acronym: string;
  name: string;
  picture: string;
}

interface Frame {
  id: number;
  image: string;
  acronym: string;
  name: string;
  defaultPos: { x: number; y: number; w: number; h: number };
  isHovered: boolean;
}

const GRID_COLUMNS = 3;
const CELL_SIZE_GRID_UNITS = 4;
const DEFAULT_HOVER_SIZE = 6;

export default function DynamicFrameLayout() {
  const router = useRouter();
  const { university, loading, error } = useFetchAllUniversity();
  const [frames, setFrames] = useState<Frame[]>([]);
  const [hoveredFrame, setHoveredFrame] = useState<{
    row: number;
    col: number;
    id: number;
  } | null>(null);

  useEffect(() => {
    if (university?.length) {
      const mappedFrames = university.map((uni: University, index: number) => {
        const row = Math.floor(index / GRID_COLUMNS);
        const col = index % GRID_COLUMNS;
        const x = col * CELL_SIZE_GRID_UNITS;
        const y = row * CELL_SIZE_GRID_UNITS;

        return {
          id: uni.id,
          image: uni.picture,
          acronym: uni.acronym,
          name: uni.name,
          defaultPos: {
            x,
            y,
            w: CELL_SIZE_GRID_UNITS,
            h: CELL_SIZE_GRID_UNITS,
          },
          isHovered: false,
        };
      });
      setFrames(mappedFrames);
    }
  }, [university]);

  const handleFrameHover = (row: number, col: number, id: number) => {
    setHoveredFrame({ row, col, id });
    setFrames((frames) =>
      frames.map((frame) => ({
        ...frame,
        isHovered: frame.id === id,
      }))
    );
  };

  const handleFrameClick = (acronym: string) => {
    router.push(`/review/${acronym}`);
  };

  const getGridTemplate = (type: "rows" | "columns") => {
    if (!hoveredFrame) return "4fr 4fr 4fr";

    const axis = type === "rows" ? hoveredFrame.row : hoveredFrame.col;
    const nonHoveredSize = (12 - DEFAULT_HOVER_SIZE) / 2;

    return [0, 1, 2]
      .map((position) =>
        position === axis ? `${DEFAULT_HOVER_SIZE}fr` : `${nonHoveredSize}fr`
      )
      .join(" ");
  };

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : y === 4 ? "center" : "bottom";
    const horizontal = x === 0 ? "left" : x === 4 ? "center" : "right";
    return `${vertical} ${horizontal}`;
  };

  if (loading)
    return <div className="text-center p-8">Loading universities...</div>;
  if (error)
    return (
      <div className="text-red-500 text-center p-8">Error: {error.message}</div>
    );

  return (
    <div className="w-full h-full">
      <div
        className="relative w-full h-full grid gap-4"
        style={{
          gridTemplateRows: getGridTemplate("rows"),
          gridTemplateColumns: getGridTemplate("columns"),
          transition:
            "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
        }}
      >
        {frames.map((frame) => {
          const { id, defaultPos, image, name, acronym, isHovered } = frame;
          const row = Math.floor(defaultPos.y / CELL_SIZE_GRID_UNITS);
          const col = Math.floor(defaultPos.x / CELL_SIZE_GRID_UNITS);

          return (
            <motion.div
              key={id}
              className={`relative flex flex-col cursor-pointer group overflow-hidden rounded-lg ${
                isHovered ? "z-10" : ""
              }`}
              style={{
                transformOrigin: getTransformOrigin(defaultPos.x, defaultPos.y),
              }}
              onMouseEnter={() => handleFrameHover(row, col, id)}
              onMouseLeave={() => setHoveredFrame(null)}
              onClick={() => handleFrameClick(acronym)}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative flex-1 w-full h-full">
                <FrameComponent
                  image={image}
                  width="100%"
                  height="100%"
                  className="flex-1"
                  label={name}
                  isHovered={isHovered}
                  showFrame={isHovered}
                />
              </div>
              <p className="text-center p-2 text-sm font-medium">{name}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
