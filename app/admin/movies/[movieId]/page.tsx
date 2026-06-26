"use client";

import React from "react";
import FormMovieUpdate from "@/components/movie/FormMovieUpdate";
import useUpdateMovie from "@/hooks/movie/useUpdateMovie";
import useFetchMovie from "@/hooks/movie/useFetchMovie";
import { MovieUpdateData } from "@/types/types";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface Props {
  params: Promise<{ movieId: string }>;
}

function Page({ params }: Props) {
  const { movieId } = React.use(params);
  const { mutate: updateMovie } = useUpdateMovie();
  const { data: movie, isLoading } = useFetchMovie(movieId);

  const handleMovieUpdate = (data: MovieUpdateData) => {
    const { releaseYear, rating, ...rest } = data;

    updateMovie({
      id: movieId,
      ...rest,
      ...(releaseYear !== undefined && { releaseYear: Number(releaseYear) }),
      ...(rating !== undefined && { maturityRating: rating }),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loader"></span>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 md:px-14">
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-white/50">
        <Link href="/" className="transition-colors hover:text-white">
          Home
        </Link>
        <ChevronRight size={14} className="shrink-0" />
        <Link href="/admin" className="transition-colors hover:text-white">
          Admin
        </Link>
        <ChevronRight size={14} className="shrink-0" />
        <span className="max-w-xs truncate text-white/80">
          {movie?.title ?? "Edit Movie"}
        </span>
      </nav>

      <div className="flex items-center justify-center">
        <FormMovieUpdate handleSubmit={handleMovieUpdate} movie={movie} />
      </div>
    </div>
  );
}

export default Page;
