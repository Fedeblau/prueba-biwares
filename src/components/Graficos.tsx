import React, { useEffect, useState } from "react";
import { BarChart } from "./puntuacion/bar-chart";

type Rating = {
    index: number;
    user_id: number;
    movie_id: number;
    rating: number;
    Date: string;
};

type Movie = {
    id: string;
    Name: string;
    "Release Date": string;
    "IMDB URL": string;
    unknown: string;
    Action: string;
    Adventure: string;
    Animation: string;
    "Children's": string;
    Comedy: string;
    Crime: string;
    Documentary: string;
    Drama: string;
    Fantasy: string;
    "Film-Noir": string;
    Horror: string;
    Musical: string;
    Mystery: string;
    Romance: string;
    "Sci-Fi": string;
    Thriller: string;
    War: string;
    Western: string;
};

type GenreYearRating = {
    [genre: string]: {
        [year: number]: {
            total_rating: number;
            count: number;
        };
    };
};

type GenreYearAvgRating = {
    genre: string;
    year: number;
    average_rating: number;
};

interface GraficosProps {
    data: {
        ratings: Rating[];
        peliculas: Movie[];
    };
}

const Graficos: React.FC<GraficosProps> = () => {
    const [data, setData] = useState([])

    const [genero, setGenero] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch('https://script.google.com/macros/s/AKfycbzkTqrecKUFNvqUtK279UB01r0oNYaSOzSj8QthrooK_-Sj0LLomQ7KbJZMhH3hGB6R/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbynvRUOEdQV-cNWj3NBh4az3DJpNHaK9tbNE-ppHG50DifyBNxcAvKqEpaln1mdWQ2f/exec'),

                ]);

                const peliculas = await response1.json() as Movie[];
                const ratings = await response2.json() as Rating[];

                const moviesDict: { [key: string]: Movie } = {};
                peliculas.forEach(movie => {
                    moviesDict[movie.id] = movie;
                });

                // Inicializar un diccionario para almacenar las sumas de las puntuaciones y los conteos por año y género
                const genreYearRating: GenreYearRating = {};

                // Procesar las puntuaciones
                ratings.forEach(rating => {
                    const movie = moviesDict[rating.movie_id];
                    if (movie) {
                        const ratingYear = new Date(rating.Date).getFullYear();
                        const ratingValue = rating.rating;

                        Object.keys(movie).forEach(genre => {
                            if (genre !== 'id' && genre !== 'Name' && genre !== 'Release Date' && genre !== 'IMDB URL' && genre !== 'unknown' && movie[genre] === "1") {
                                if (!genreYearRating[genre]) {
                                    genreYearRating[genre] = {};
                                }
                                if (!genreYearRating[genre][ratingYear]) {
                                    genreYearRating[genre][ratingYear] = { total_rating: 0, count: 0 };
                                }
                                genreYearRating[genre][ratingYear].total_rating += ratingValue;
                                genreYearRating[genre][ratingYear].count += 1;
                            }
                        });
                    }
                });

                // Calcular el promedio de puntuación por género y año
                const genreYearAvgRating: GenreYearAvgRating[] = [];

                Object.keys(genreYearRating).forEach(genre => {
                    Object.keys(genreYearRating[genre]).forEach(year => {
                        const data = genreYearRating[genre][parseInt(year)];
                        const averageRating = data.total_rating / data.count;
                        genreYearAvgRating.push({
                            genre,
                            year: parseInt(year),
                            average_rating: averageRating
                        });
                    });
                });
                setData(genreYearAvgRating)
            }
            catch(error) {
                console.error("se rompio todo")
            }
        }
            fetchData()
        }, []);



    // Convertir la lista de películas a un diccionario para acceso rápido


    console.log("Promedios de puntuación por género y año:", data);

    return (
        <>
            {
                data &&
                <BarChart className="aspect-[6/3] max-w-[75vw] text-black" data={data} />
            }
        </>
    );
};

export default Graficos;
