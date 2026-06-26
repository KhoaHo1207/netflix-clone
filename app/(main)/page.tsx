"use client";

import Header from "@/components/Header";
import MaturityBadge from "@/components/movie/MaturityBadge";
import MoviesRow from "@/components/movie/MoviesRow";
import { useGlobalContext } from "@/context/globalContext";
import useFetchFeaturedMovies from "@/hooks/movie/useFetchFeaturedMovies";
import useFetchMovies from "@/hooks/movie/useFetchMovies";
import useFetchTrendingMovies from "@/hooks/movie/useFetchTredingMovies";
import useFetchMyListMovies from "@/hooks/my-list/useFetchMyListMovies";
import { InfoIcon, PlayIcon, VolumeFullIcon, VolumeOffIcon } from "@/lib/Icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { openModal } = useGlobalContext();

  const { data: featuredMovies, isLoading: featuredLoading } =
    useFetchFeaturedMovies();
  const { data: allMovies = [], isLoading: allMoviesLoading } =
    useFetchMovies();
  const { data: trendingMovies = [], isLoading: trendingLoading } =
    useFetchTrendingMovies();
  const { data: myListMovies = [] } = useFetchMyListMovies();

  const [isMuted, setIsMuted] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies?.length) {
      setFeaturedIndex(Math.floor(Math.random() * featuredMovies.length));
    }
  }, [featuredMovies]);

  if (featuredLoading || allMoviesLoading || trendingLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  const featured = featuredMovies?.[featuredIndex];

  return (
    <div>
      <Header />

      <div className="relative -mt-17.5 w-full">
        <video
          autoPlay
          loop
          muted={isMuted}
          src={featured?.videoUrl ?? undefined}
          className="aspect-video w-full"
        ></video>

        <div className="absolute right-0 bottom-[25%] flex items-center gap-3 md:bottom-[30%]">
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white bg-white/5 hover:bg-white/15 md:h-11 md:w-11"
          >
            {isMuted ? (
              <VolumeOffIcon size={22} />
            ) : (
              <VolumeFullIcon size={22} />
            )}
          </button>

          <div className="border-l-3 border-white/80 bg-black/50 pr-8 pl-4 md:pr-16">
            <MaturityBadge rating={featured?.maturityRating} />
          </div>
        </div>

        <div className="absolute bottom-[25%] left-4 max-w-[55%] md:bottom-[30%] md:left-14 md:max-w-lg">
          <div className="flex flex-col gap-2 md:gap-6">
            <h1 className="u-text-shadow text-xl font-bold md:text-3xl">
              {featured?.title}
            </h1>
            <p className="u-text-shadow hidden text-sm font-medium md:text-xl lg:block">
              {featured?.description.substring(0, 120)}...
            </p>

            <div>
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  className="btn-play"
                  onClick={() => {
                    router.push(`/watch/${featured?.publicId}`);
                  }}
                >
                  <PlayIcon size={28} /> Play
                </button>
                <button
                  className="btn-info"
                  onClick={() => featured && openModal("movie-info", featured)}
                >
                  <InfoIcon size={28} /> More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative z-20 -mt-26 flex flex-col gap-10 overflow-x-clip px-4 pt-8 md:-mt-32 md:px-14 lg:-mt-62"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-brand-background) 10rem)",
        }}
      >
        <MoviesRow title="Trending Now" movies={trendingMovies} />
        <MoviesRow title="New on Netflix" movies={allMovies} />
        <MoviesRow title="My List" movies={myListMovies} />
      </div>
    </div>
  );
}
