import React, { useEffect, useState } from "react";
import { BarChart } from "./grafs/bar-chart";


const Graficos = () => {
    const [data, setData] = useState([]);
    const [histograma, setHistograma] = useState({});
    const [loading, setLoading] = useState(true);
    const [peliculas, setPeliculas] =useState([])

    const genres = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2, response3] = await Promise.all([
                    fetch('https://script.google.com/macros/s/AKfycbzkTqrecKUFNvqUtK279UB01r0oNYaSOzSj8QthrooK_-Sj0LLomQ7KbJZMhH3hGB6R/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbynvRUOEdQV-cNWj3NBh4az3DJpNHaK9tbNE-ppHG50DifyBNxcAvKqEpaln1mdWQ2f/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbyzFbdkHoPBORZcFBX1Ob-cp0W6qHa3hUWBXrBg35sceGmpjUZlRjMwt44tj3z_D4Dtgw/exec')
                ]);

                const peliculas = await response1.json()
                const ratings = await response2.json()
                const users = await response3.json() 

                const moviesDict = {};
                peliculas.forEach(movie => {
                    moviesDict[(movie.id)] = movie;
                });

                setPeliculas(peliculas)

                const genreYearRating = {};

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

                const genreYearAvgRating = [];

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

                const genreRatingCounts = {};

                genres.forEach(genre => {
                    genreRatingCounts[genre] = {
                        1: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Map(), movies: new Set() },
                        2: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Map(), movies: new Set() },
                        3: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Map(), movies: new Set() },
                        4: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Map(), movies: new Set() },
                        5: { count: 0, "0-18": 0, "19-25": 0, "26-45": 0, "+46": 0, users: new Map(), movies: new Set() }
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
                                genreData.movies.add(movie_id);
                                if (!genreData.users.has(user_id)) {
                                    genreData.users.set(user_id, []);
                                }
                                genreData.users.get(user_id).push(movie_id);
                            }
                        });
                    }
                });

                const userAges = users.map(e => 1998 - parseInt(e['year of birth']));

                Object.keys(genreRatingCounts).forEach(genre => {
                    Object.keys(genreRatingCounts[genre]).forEach(rating => {
                        const usersMap = genreRatingCounts[genre][rating].users;
                        usersMap.forEach((movies, user_id) => {
                            const age = userAges[user_id];
                            if (age <= 18) {
                                genreRatingCounts[genre][rating]["0-18"]++;
                            } else if (age <= 25) {
                                genreRatingCounts[genre][rating]["19-25"]++;
                            } else if (age <= 45) {
                                genreRatingCounts[genre][rating]["26-45"]++;
                            } else {
                                genreRatingCounts[genre][rating]["+46"]++;
                            }
                        });
                        genreRatingCounts[genre][rating].users = new Map(usersMap);
                        genreRatingCounts[genre][rating].movies = new Set(genreRatingCounts[genre][rating].movies);
                    });
                });

                
                setHistograma(genreRatingCounts);

                setData(genreYearAvgRating);
                setLoading(false);  
            } catch (error) {
                console.error("se rompio todo");
                setLoading(false);  
            }
        };
        fetchData();
    }, []);


    if (loading) {
        return(<div className="flex flex-col " > 
            <h2 className="text-white mx-auto mt-28 mb-16 ">Cargando...</h2>
            <div className="w-full flex items-center justify-center">
            <div role="status" className="p-4 w-5/12 mx-4 rounded border shadow animate-pulse md:p-6 border-gray-700">
   
           <div className="h-2.5  rounded-full bg-gray-700 w-32 mb-2.5"></div>
           <div className="mb-10 w-48 h-2  rounded-full bg-gray-700"></div>
           <div className="flex items-baseline mt-4 space-x-6">
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-56  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-64  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-80  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-80  rounded-t-lg bg-gray-700"></div>
           </div>
           <span className="sr-only">Loading...</span>
           </div>
            <div role="status" className="p-4 w-5/12 rounded border shadow animate-pulse md:p-6 border-gray-700">
   
           <div className="h-2.5  rounded-full bg-gray-700 w-32 mb-2.5"></div>
           <div className="mb-10 w-48 h-2  rounded-full bg-gray-700"></div>
           <div className="flex items-baseline mt-4 space-x-6">
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-56  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-64  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-80  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-72  rounded-t-lg bg-gray-700"></div>
               <div className="w-full h-80  rounded-t-lg bg-gray-700"></div>
           </div>
           <span className="sr-only">Loading...</span>
           </div>
       </div>
        </div>
        )
        
       
    }

    return (
        <>
            <BarChart className="aspect-[6/3] max-w-[75vw] text-black" data={data} histograma={histograma} peliculas={peliculas}/>
        </>
    );
};

export default Graficos;
