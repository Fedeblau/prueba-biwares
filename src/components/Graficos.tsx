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

type User = {
    user_id: number;
    age: number;
    gender: string;
    occupation: string;
    zip_code: string;
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
    const [data, setData] = useState([]);
    const [histograma, setHistograma] = useState([]);

    const genres = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2, response3] = await Promise.all([
                    fetch('https://script.google.com/macros/s/AKfycbzkTqrecKUFNvqUtK279UB01r0oNYaSOzSj8QthrooK_-Sj0LLomQ7KbJZMhH3hGB6R/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbynvRUOEdQV-cNWj3NBh4az3DJpNHaK9tbNE-ppHG50DifyBNxcAvKqEpaln1mdWQ2f/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbyzFbdkHoPBORZcFBX1Ob-cp0W6qHa3hUWBXrBg35sceGmpjUZlRjMwt44tj3z_D4Dtgw/exec')
                ]);

                const peliculas = await response1.json() as Movie[];
                const ratings = await response2.json() as Rating[];
                const users = await response3.json() as User[];

                const moviesDict: { [key: string]: Movie } = {};
                peliculas.forEach(movie => {
                    moviesDict[movie.id] = movie;
                });

                const genreYearRating: GenreYearRating = {};

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

                function groupRatingsByGenre(ratings, movies) {
                    const genreRatings = {};

                    movies.forEach(movie => {
                        Object.keys(movie).forEach(key => {
                            if (key !== "id" && key !== "Name" && key !== "Release Date" && key !== "IMDB URL" && movie[key] === "1") {
                                if (!genreRatings[key]) {
                                    genreRatings[key] = [];
                                }

                                const movieId = parseInt(movie.id);
                                const movieRatings = ratings.filter(rating => rating.movie_id === movieId);
                                movieRatings.forEach(rating => {
                                    genreRatings[key].push(rating.rating);
                                });
                            }
                        });
                    });

                    return genreRatings;
                }

                const genreRatingCounts = {};

                genres.forEach(genre => {
                    genreRatingCounts[genre] = {
                        1: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Set(), movies: new Set() },
                        2: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Set(), movies: new Set() },
                        3: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Set(), movies: new Set() },
                        4: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Set(), movies: new Set() },
                        5: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Set(), movies: new Set() }
                    };
                });

                ratings.forEach(rating => {
                    const { rating: userRating, user_id, movie_id } = rating;
                    const movie = moviesDict[movie_id];
                    if (movie) {
                        genres.forEach(genre => {
                            if (movie[genre] === "1") {
                                const genreData = genreRatingCounts[genre][userRating];
                                genreData.count++;
                                genreData.users.add(user_id);
                                genreData.movies.add(movie_id);
                            }
                        });
                    }
                });

            
            
              

                
                const userAges = users.map(e=>1998-parseInt(e['year of birth']))
               

                Object.keys(genreRatingCounts).forEach(genre => {
                    Object.keys(genreRatingCounts[genre]).forEach(rating => {
                        const usersSet = genreRatingCounts[genre][rating].users;
                        usersSet.forEach(user_id => {
                            const age = userAges[user_id];
                            
                            if (age*1 <= 18) {
                                genreRatingCounts[genre][rating]["0-18"]++;
                            } else if (age*1 <= 25) {
                                console.log("entro aca")
                                genreRatingCounts[genre][rating]["19-25"]++;
                            } else if (age*1 <= 45) {
                                genreRatingCounts[genre][rating]["26-45"]++;
                            } else {
                                genreRatingCounts[genre][rating]["+46"]++;
                            }
                        });
                        genreRatingCounts[genre][rating].users = Array.from(usersSet);
                        genreRatingCounts[genre][rating].movies = Array.from(genreRatingCounts[genre][rating].movies);
                    });
                });

                console.log("genreRatingCounts", genreRatingCounts);

                setHistograma(genreRatingCounts);

                setData(genreYearAvgRating);
            } catch (error) {
                console.error("se rompio todo");
            }
        };
        fetchData();
    }, []);

    console.log("histograma!!!", histograma);

    return (
        <>
            <BarChart className="aspect-[6/3] max-w-[75vw] text-black" data={data} histograma={histograma} />
        </>
    );
};

export default Graficos;
