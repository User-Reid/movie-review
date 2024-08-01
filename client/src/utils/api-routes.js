import { useState, useEffect } from "react";

const KEY = "e91d2696";

export function useMovies(query) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(
        function() {
            // callback?.();

            const controller = new AbortController();

            async function fetchMovies() {
                try {
                    setIsLoading(true);
                    setError("");
                    const url = `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}`
                    const res = await fetch(
                        url,
                        { signal: controller.signal }
                    );
                    console.log(url)

                    if (!res.ok)
                        throw new Error("Something went wrong with fetching movies");

                    const data = await res.json();
                    if (data.Response === "False") throw new Error ("Movie not found");

                    setMovies(data.Search);
                    setError("");
                    }
                    catch (err) {
                            if (err.name !== "AbortError") {
                                console.log(err.message);
                                setError(err.message);
                            }
                 } finally {
                        setIsLoading(false);
                    }
                }
                
                if (!query.length) {
                    setMovies([]);
                    setError("");
                    return;
                }
                fetchMovies();

                return function() {
                    controller.abort();
                };
            },
            [query]
            );
            
            return { movies, isLoading, error };
        }
