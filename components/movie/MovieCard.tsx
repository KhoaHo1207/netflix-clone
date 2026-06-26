"use client";
import { Movie } from "@/types/types";
import React, { useRef, useState } from "react";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { set } from "zod";
import { VolumeOffIcon } from "lucide-react";
import {
  AddIcon,
  CheckIcon,
  ChevronDownIcon,
  PlayButtonIcon,
  VolumeFullIcon,
} from "@/lib/Icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGlobalContext } from "@/context/globalContext";
import useFetchMyList from "@/hooks/my-list/useFetchMyList";
import useAddToMyList from "@/hooks/my-list/useAddToMyList";
import useRemoveFromMyList from "@/hooks/my-list/useRemoveFromMyList";
import MaturityBadge from "./MaturityBadge";
import { formatDuration } from "@/lib/utils";

interface Props {
  movie: Movie;
}

const ease = [0.5, 0, 0.1, 1] as const;

const variants = {
  initial: {
    scale: 1,
    transition: {
      duration: 0.25,
      ease: ease,
    },
  },
  hover: {
    scale: 1.5,
    transition: {
      delay: 0.4,
      duration: 0.25,
      ease,
    },
  },
};

function MovieCard({ movie }: Props) {
  const { openModal } = useGlobalContext();
  const { data: myList = [] } = useFetchMyList();
  const { mutate: addToMyList } = useAddToMyList();
  const { mutate: removeFromMyList } = useRemoveFromMyList();

  const isInMyList = myList.includes(movie.id);

  const handleMyListToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInMyList) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isElevated, setIsElevated] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [transformOrigin, setTransformOrigin] = useState("50% 50%");

  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playPromise = useRef<Promise<void> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleHoverStart = () => {
    if (leaveTimer.current) {
      clearTimeout(leaveTimer.current);
    }

    if (ref.current) {
      const { left, right } = ref.current.getBoundingClientRect();

      setTransformOrigin(
        left < 80
          ? "0% 50%"
          : right > window.innerWidth - 80
            ? "100% 50%"
            : "50% 50%",
      );

      setIsElevated(true);
      videoTimer.current = setTimeout(() => {
        if (videoRef.current) {
          playPromise.current = videoRef.current.play();
          playPromise.current
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error playing video:", error);
            });
        }
      }, 650);
    }
  };

  const handleHoverEnd = () => {
    if (videoTimer.current) clearTimeout(videoTimer.current);
    const video = videoRef.current;

    if (video) {
      playPromise.current
        ?.then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch((error) => {
          console.error("Error pausing video:", error);
        });
    }

    setIsPlaying(false);
    leaveTimer.current = setTimeout(() => {
      setIsElevated(false);
    }, 250);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.preventDefault();

    if (videoRef.current) {
      const next = !isMuted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  };

  return (
    <motion.div
      className={`u-movie-card-shadow group relative h-full cursor-pointer rounded-sm bg-[#181818] ${isElevated ? "z-10" : "z-0"}`}
      style={{ transformOrigin }}
      data-elevated={isElevated || undefined}
      variants={variants}
      initial="initial"
      whileHover="hover"
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
      ref={ref}
    >
      <Link href={`/watch/${movie.publicId}`} className="h-full">
        <Image
          src={movie?.thumbnailUrl ?? ""}
          alt={movie.title}
          width={300}
          height={150}
          className={`h-full w-full rounded-sm object-cover transition-opacity duration-200 ${isPlaying ? "opacity-0" : "opacity-100"}`}
        />

        <video
          ref={videoRef}
          className={`pointer-events-none absolute top-0 left-0 aspect-video w-full rounded-t-sm object-cover transition-opacity duration-200 ${isPlaying ? "opacity-100" : "opacity-0"}`}
          src={movie.videoUrl ?? undefined}
          muted
          loop
        />

        {isPlaying && (
          <button
            className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-white/60 bg-black/40 text-white hover:border-white"
            onClick={handleMuteToggle}
          >
            {isMuted ? (
              <VolumeOffIcon size={14} />
            ) : (
              <VolumeFullIcon size={14} />
            )}
          </button>
        )}

        <div className="absolute top-full right-0 left-0 rounded-b-sm bg-[#181818] opacity-0 transition-opacity delay-0 duration-200 group-hover:opacity-100 group-hover:delay-[400ms]">
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-white/80">
                  <PlayButtonIcon size={20} className="ml-0.5" />
                </button>
                <Tooltip delayDuration={400}>
                  <TooltipTrigger asChild>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/5 text-white hover:border-white"
                      onClick={handleMyListToggle}
                    >
                      {isInMyList ? (
                        <CheckIcon size={20} />
                      ) : (
                        <AddIcon size={20} />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-white px-4 py-2 text-base font-medium text-black"
                  >
                    {isInMyList ? "Remove from My List" : "Add to My List"}
                  </TooltipContent>
                </Tooltip>
              </div>

              <Tooltip delayDuration={400}>
                <TooltipTrigger asChild>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/5 text-white hover:border-white"
                    onClick={(e) => {
                      e.preventDefault();
                      openModal("movie-info", movie);
                    }}
                  >
                    <ChevronDownIcon className="mt-0.5" size={20} />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="bg-white px-4 py-2 text-base font-medium text-black"
                >
                  More Info
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-2">
              <MaturityBadge rating={movie.maturityRating!} size="xs" />
              {movie.releaseYear && (
                <span className="text-xs text-white/70">
                  {movie.releaseYear}
                </span>
              )}
              {movie.duration && (
                <span className="text-xs text-white/70">
                  {formatDuration(movie.duration)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default MovieCard;
