"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FrameComponent } from "./FrameComponent";
import { useUniversities } from "@/hooks/use-universities";
import LoadingState from "./loading-state";
import ErrorState from "./error-state";
import NotFoundState from "./not-found-state";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-bar";

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
const HOVER_SCALE_FACTOR = 1.15;
const ITEMS_PER_PAGE = 30;

export default function DynamicFrameLayout() {
  const { allUniversities, loading, error } = useUniversities();
  const [frames, setFrames] = useState<Frame[]>([]);
  const [hoveredFrameId, setHoveredFrameId] = useState<number | null>(null);
  const [gridColumns, setGridColumns] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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

  const filteredUniversities = useMemo(() => {
    if (!allUniversities) return [];
    const query = searchQuery.toLowerCase().trim();
    if (!query) return allUniversities;
    return allUniversities.filter(
      (uni: University) =>
        uni.name.toLowerCase().includes(query) ||
        uni.acronym.toLowerCase().includes(query)
    );
  }, [allUniversities, searchQuery]);

  useEffect(() => {
    if (filteredUniversities.length) {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedUniversities = filteredUniversities.slice(
        startIndex,
        endIndex
      );

      const mappedFrames = paginatedUniversities.map(
        (uni: University, index: number): Frame => {
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
            isHovered: uni.id === hoveredFrameId,
          };
        }
      );
      setFrames(mappedFrames);

      // Check if hovered item is still in the current page
      if (
        hoveredFrameId &&
        !paginatedUniversities.some((uni: any) => uni.id === hoveredFrameId)
      ) {
        setHoveredFrameId(null);
      }
    } else {
      setFrames([]);
    }
  }, [filteredUniversities, gridColumns, currentPage, hoveredFrameId]);

  const onInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Search submitted (optional action)");
  };

  const handleFrameHover = useCallback(
    (id: number | null) => {
      if (!isMobile) {
        setHoveredFrameId(id);
      }
    },
    [isMobile]
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!allUniversities && !loading) return <NotFoundState />;

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);
  const totalGridRows = Math.ceil(frames.length / gridColumns);
  const approxRowHeight = 200;
  const minGridHeight = totalGridRows * approxRowHeight;

  return (
    <div className="w-full h-full overflow-x-hidden px-4 md:px-6 lg:px-8">
      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSubmit={onInputSubmit}
        className="mb-6 sticky top-0 z-30 bg-background py-4"
      />
      {!loading &&
        !error &&
        filteredUniversities.length === 0 &&
        searchQuery && <NotFoundState />}
      {isMobile ? (
        <div className="flex flex-col gap-6 w-full pb-8">
          {frames.map((frame) => {
            const { id, image, name, acronym } = frame;
            return (
              <Link
                key={id}
                href={`/review/${acronym}`}
                prefetch={true}
                className="no-underline text-inherit"
              >
                <div className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-hidden ">
                  <div className="relative h-40 flex items-center justify-center p-4 bg-muted/40">
                    <div className="relative w-full h-full max-h-32 flex items-center justify-center">
                      <Image
                        width={150}
                        height={150}
                        src={image}
                        alt={`${name} logo`}
                        className="max-w-full max-h-full object-contain"
                        style={{ maxHeight: "128px" }}
                        // unoptimized={image?.endsWith(".svg")}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.png";
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-4 text-center ">
                    <p className="text-base font-medium text-card-foreground">
                      {name}
                    </p>
                    <p className="text-sm text-muted-foreground">{acronym}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div
          className="relative w-full grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${totalGridRows}, auto)`,
            paddingBottom: "20px",
          }}
        >
          {frames.map((frame) => {
            const { id, image, name, acronym } = frame;
            const isHovered = id === hoveredFrameId;

            return (
              <motion.div
                key={id}
                className={`relative flex flex-col cursor-pointer group rounded-lg overflow-hidden shadow-md  ${
                  isHovered ? "z-20" : "z-10"
                }`}
                onMouseEnter={() => handleFrameHover(id)}
                onMouseLeave={() => handleFrameHover(null)}
                layout
                animate={{
                  scale: isHovered ? HOVER_SCALE_FACTOR : 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Link
                  href={`/review/${acronym}`}
                  prefetch={true}
                  className="flex flex-col flex-1 h-full no-underline text-inherit"
                >
                  <div className="relative flex-1 w-full h-40 flex items-center justify-center p-4 bg-muted/40">
                    <Image
                      src={image}
                      width={150}
                      height={150}
                      className="max-h-full max-w-full object-contain"
                      alt={`${name} logo`}
                      style={{ maxHeight: "128px" }}
                      unoptimized={image?.endsWith(".svg")}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.png";
                      }}
                    />
                  </div>
                  <motion.div
                    className="p-3 text-center"
                    initial={false}
                    animate={{
                      backgroundColor: "blur(100px)",
                      opacity: isHovered ? 2 : 1,
                      transition: {
                        duration: 0.3,
                      },
                      scale: isHovered ? 1.3 : 1,
                    }}
                  >
                    <p
                      className="text-sm font-medium text-card-foreground truncate"
                      title={name}
                    >
                      {name}
                    </p>
                    <p className="text-xs text-muted-foreground">{acronym}</p>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
      {totalPages > 1 && (
        <div className="w-full flex justify-center items-center gap-4 py-8 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm font-medium"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-opacity text-sm font-medium"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
