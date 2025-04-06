"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FrameComponent } from "./FrameComponent";
import { useRouter } from "next/navigation";
import { useUniversities } from "@/hooks/use-universities";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import NotFoundState from "./not-found-state";
import Image from "next/image";
import Link from "next/link";

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
const DEFAULT_HOVER_SIZE = 5; // Size of the hovered item
const DEFAULT_SIZE = 3.5; // Base size for non-hovered items
const MIN_SIZE = 2.5; // Minimum size for other items in active row/col

export default function DynamicFrameLayout() {
  const { allUniversities, loading, error } = useUniversities();
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
    if (allUniversities?.length) {
      const mappedFrames = allUniversities.map(
        (uni: University, index: number) => {
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
        }
      );
      setFrames(mappedFrames);
    }
  }, [allUniversities, gridColumns]);

  const getGridTemplate = (type: "rows" | "columns") => {
    if (!hoveredFrame || isMobile) {
      const size = `${CELL_SIZE_GRID_UNITS}fr`;
      return type === "columns"
        ? Array(gridColumns).fill(size).join(" ")
        : Array(Math.ceil(frames.length / gridColumns))
            .fill(size)
            .join(" ");
    }

    const totalTracks =
      type === "rows" ? Math.ceil(frames.length / gridColumns) : gridColumns;

    const activeTrack = type === "rows" ? hoveredFrame.row : hoveredFrame.col;

    return Array.from({ length: totalTracks }, (_, i) => {
      if (i === activeTrack) return `${DEFAULT_HOVER_SIZE}fr`;
      // Apply minimum size to prevent excessive shrinking
      return `${Math.max(
        MIN_SIZE,
        DEFAULT_SIZE - Math.abs(i - activeTrack) * 0.7
      )}fr`;
    }).join(" ");
  };

  // Add debounced hover handler
  const handleFrameHover = useCallback(
    (row: number, col: number, id: number) => {
      if (!isMobile) {
        setHoveredFrame({ row, col, id });
        setFrames((frames) =>
          frames.map((frame) => ({
            ...frame,
            isHovered: frame.id === id,
          }))
        );
      }
    },
    [isMobile]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!allUniversities) return <NotFoundState />;

  // Calculate minimum height to ensure proper scrolling
  const totalRows = Math.ceil(frames.length / gridColumns);
  const rowHeight = 250; // pixels per row (approximate)
  const minGridHeight = totalRows * rowHeight;

  return (
    <div className="w-full h-full overflow-x-hidden">
      {isMobile ? (
        // Mobile layout
        <div className="flex flex-col gap-6 w-full pb-8">
          {frames.map((frame) => {
            const { id, image, name, acronym } = frame;

            return (
              <div
                key={id}
                className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-y-auto"
              >
                <div className="relative h-40 flex items-center justify-center p-4">
                  {/* Image container with fixed dimensions */}
                  <div className="relative w-full h-full max-h-32 flex items-center justify-center">
                    <Link key={id} href={`/review/${acronym}`} prefetch={true}>
                      <Image
                        width={150}
                        height={150}
                        src={image}
                        alt={`${name} logo`}
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: "150px" }}
                      />
                    </Link>
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
        // Desktop layout - grid with hover effects + proper scrolling
        <div
          className="relative w-full grid gap-3" // Reduced gap for stability
          style={{
            gridTemplateRows: getGridTemplate("rows"),
            gridTemplateColumns: getGridTemplate("columns"),
            transition:
              "grid-template-rows 0.5s cubic-bezier(0.4, 0, 0.2, 1), " +
              "grid-template-columns 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            minHeight: `${minGridHeight}px`,
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
                  isHovered ? "z-20" : "z-10"
                }`}
                onMouseEnter={() => handleFrameHover(row, col, id)}
                onMouseLeave={() => setHoveredFrame(null)}
                layout // Enable layout animations
                transition={{ duration: 0.3 }}
              >
                <div className="relative flex-1 w-full h-full">
                  <Link key={id} href={`/review/${acronym}`} prefetch={true}>
                    <FrameComponent
                      image={image}
                      width="100%"
                      height="100%"
                      className="flex-1 transition-transform duration-300"
                      label={name}
                      isHovered={isHovered}
                      showFrame={isHovered}
                    />
                  </Link>
                </div>
                <motion.p
                  className="text-center p-2 text-sm font-medium"
                  animate={{ opacity: isHovered ? 1 : 0.8 }}
                >
                  {name}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
