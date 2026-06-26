"use client";

import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/context/globalContext";
import useDeleteMovie from "@/hooks/movie/useDeleteMovie";
import useFetchMovies from "@/hooks/movie/useFetchMovies";
import { Film, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

function Page() {
  const { openModal } = useGlobalContext();
  const { data: movies, isLoading } = useFetchMovies();
  const { mutate: deleteMovie } = useDeleteMovie();

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="border-b border-white/5 px-8 pt-10 pb-7">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.22em] text-[#e50914] uppercase">
              Content Library
            </p>
            <h1 className="text-[1.75rem] leading-none font-bold tracking-tight text-white">
              Movies
            </h1>
            <p className="mt-2 text-sm text-white/35 tabular-nums">
              {isLoading ? (
                <span className="inline-block h-3 w-16 animate-pulse rounded-sm bg-white/10" />
              ) : (
                `${movies?.length ?? 0} title${(movies?.length ?? 0) !== 1 ? "s" : ""}`
              )}
            </p>
          </div>

          <Button
            variant="brand-primary"
            className="h-9 px-5 text-sm font-semibold"
            onClick={() => openModal("add-movie")}
          >
            <Plus className="mr-2" /> Add Movie
          </Button>
        </div>
      </div>

      {movies?.length === 0 && (
        <div className="px-8 py-6">
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
              <Film className="h-8 w-8 text-white/50" />
            </div>
            <p className="text-sm font-medium text-white/50">No movies yet</p>
            <p className="mt-1 text-xs text-white/25">
              Add your first title to get started
            </p>
            <Button
              variant="brand-primary"
              className="mt-6 h-9 px-5 text-sm font-semibold"
              onClick={() => openModal("add-movie")}
            >
              <Plus className="mr-2" /> Add Movie
            </Button>
          </div>
        </div>
      )}

      <div className="px-8 py-6">
        {movies && movies.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className="group relative aspect-video cursor-pointer overflow-hidden rounded-sm bg-[#1c1c1c]"
                  onClick={() => router.push(`/admin/movies/${movie.id}`)}
                >
                  {movie.thumbnailUrl ? (
                    <Image
                      src={movie.thumbnailUrl}
                      alt={movie.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="px-3 text-center text-[11px] leading-snug font-medium text-white/20">
                        {movie.title}
                      </p>
                    </div>
                  )}

                  {(movie.isTrending || movie.isFeatured) && (
                    <div className="absolute top-1.5 left-1.5 z-10 flex gap-1 duration-200 group-hover:opacity-0">
                      {movie.isTrending && (
                        <span className="rounded-xs bg-[#e50914] px-1.5 py-0.75 text-xs leading-none font-bold tracking-wider text-white uppercase">
                          Trending
                        </span>
                      )}
                      {movie.isFeatured && (
                        <span className="rounded-xs bg-white/15 px-1.5 py-0.75 text-xs leading-none font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent px-2 pt-8 pb-2 transition-opacity duration-200 group-hover:opacity-0">
                    <p className="line-clamp-1 text-sm leading-snug font-medium text-white">
                      {movie.title}
                    </p>
                  </div>

                  <div className="absolute inset-0 flex flex-col justify-between bg-black/70 p-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="flex h-full flex-col justify-between">
                      <p className="mb-2 line-clamp-2 text-sm font-medium">
                        {movie.title}
                      </p>

                      <div className="flex gap-1.5">
                        <Button
                          size="xs"
                          variant="secondary"
                          className="h-7 flex-1 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/admin/movies/${movie.id}`);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          className="h-7 flex-1 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteMovie(movie.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
