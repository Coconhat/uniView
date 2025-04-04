"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FrameComponent } from "./FrameComponent";
import { useRouter } from "next/navigation";
import { useFetchAllUniversity } from "@/hooks/use-fetch-all-universities";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import NotFoundState from "./not-found-state";

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
  const [gridColumns, setGridColumns] = useState(3);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setGridColumns(mobile ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (university?.length) {
      const mappedFrames = university.map((uni: University, index: number) => {
        const row = Math.floor(index / gridColumns);
        const col = index % gridColumns;
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
  }, [university, gridColumns]);

  const handleFrameHover = (row: number, col: number, id: number) => {
    if (!isMobile) {
      setHoveredFrame({ row, col, id });
      setFrames((frames) =>
        frames.map((frame) => ({
          ...frame,
          isHovered: frame.id === id,
        }))
      );
    }
  };

  const handleFrameClick = (acronym: string) => {
    router.push(`/review/${acronym}`);
  };

  const getGridTemplate = (type: "rows" | "columns") => {
    if (!hoveredFrame || isMobile) {
      const size = `${CELL_SIZE_GRID_UNITS}fr`;
      if (type === "columns") {
        return Array.from({ length: gridColumns }, () => size).join(" ");
      } else {
        const totalRows = Math.ceil(frames.length / gridColumns);
        return totalRows > 0
          ? Array.from({ length: totalRows }, () => size).join(" ")
          : "";
      }
    }

    const totalTracks =
      type === "rows" ? Math.ceil(frames.length / gridColumns) : gridColumns;
    const axis = type === "rows" ? hoveredFrame.row : hoveredFrame.col;
    const nonHoveredSize = (12 - DEFAULT_HOVER_SIZE) / (totalTracks - 1);

    return Array.from({ length: totalTracks }, (_, i) =>
      i === axis ? `${DEFAULT_HOVER_SIZE}fr` : `${nonHoveredSize}fr`
    ).join(" ");
  };

  const getTransformOrigin = (x: number, y: number) => {
    const vertical = y === 0 ? "top" : "bottom";
    const horizontal = x === 0 ? "left" : "right";
    return `${vertical} ${horizontal}`;
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!university) return <NotFoundState />;

  return (
    <div className="w-full h-full">
      {isMobile ? (
        // Mobile layout
        <div className="flex flex-col gap-6 w-full pb-8">
          {frames.map((frame) => {
            const { id, image, name, acronym } = frame;

            return (
              <div
                key={id}
                className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-hidden"
                onClick={() => handleFrameClick(acronym)}
              >
                <div className="relative h-40 flex items-center justify-center p-4">
                  {/* Image container with fixed dimensions */}
                  <div className="relative w-full h-full max-h-32 flex items-center justify-center">
                    <img
                      src={image}
                      alt={`${name} logo`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: "150px" }}
                    />
                  </div>
                </div>
                <div className="p-4 text-center ">
                  <p className="text-base font-medium">{name}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Desktop layout - original grid with hover effects
        <div
          className="relative w-full h-full grid gap-4"
          style={{
            gridTemplateRows: getGridTemplate("rows"),
            gridTemplateColumns: getGridTemplate("columns"),
            gridAutoRows: `${CELL_SIZE_GRID_UNITS}fr`,
            gridAutoColumns: `${CELL_SIZE_GRID_UNITS}fr`,
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
                  transformOrigin: getTransformOrigin(
                    defaultPos.x,
                    defaultPos.y
                  ),
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
      )}
    </div>
  );
}
