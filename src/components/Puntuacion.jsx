import { useContext, useEffect, useState } from 'react';
import { DataTable } from './puntuacion/data-table';
import { columns } from './puntuacion/columns';
import { UserContext } from '../context/userContext';
import { Skeleton } from "./ui/skeleton"

const genres = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];


const Loader = () => (
    <Skeleton className=" h-[20px] rounded-full" />
);

const Puntuacion = () => {
    const { user } = useContext(UserContext);

    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {

                    const [response1, response2, response3] = await Promise.all([
                        fetch('https://script.google.com/macros/s/AKfycbzkTqrecKUFNvqUtK279UB01r0oNYaSOzSj8QthrooK_-Sj0LLomQ7KbJZMhH3hGB6R/exec'),
                        fetch('https://script.google.com/macros/s/AKfycbynvRUOEdQV-cNWj3NBh4az3DJpNHaK9tbNE-ppHG50DifyBNxcAvKqEpaln1mdWQ2f/exec'),
                        fetch(`https://script.google.com/macros/s/AKfycbyGZPRQ0tqucsonA5a9MpFZi9-hblcSI6fvguMtrmBjfC5z3CU1IywBWblBwii4_mZg6Q/exec?id=${user.id}`)
                    ]);

                    const data1 = await response1.json();
                    const ratings = await response2.json();
                    const userRatings = await response3.json();

                   
                    const peliculas = data1.map(item => {
                        
                        const genero = genres.filter(genre => item[genre] === '1')
                        return {
                            id: item.id,
                            name: item.Name, 
                            release_date: new Date(item['Release Date']).toLocaleDateString('es-AR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }), 
                            genero,
                            promedio: 0, 
                            user_score: null
                        }
                    
                    });
                    function calcularPromedio(arr) {
                        const sum = arr.reduce((total, current) => total + current, 0);
                        const prom = Math.round((sum / arr.length) * 10) / 10
                        return prom;
                    }

                    function calcularPromedioPorMovieId(ratings) {
                        const promedios = {};

                   
                        ratings.forEach(rating => {
                            if (!promedios[rating.movie_id]) {
                                promedios[rating.movie_id] = [];
                            }
                            promedios[rating.movie_id].push(rating.rating * 1);
                        });

                     
                        const result = [];
                        for (const movie_id in promedios) {
                            if (promedios.hasOwnProperty(movie_id)) {
                                const promedio = calcularPromedio(promedios[movie_id]);
                                result.push({ movie_id: parseInt(movie_id), promedio });
                            }
                        }

                        return result;
                    }

                 
                    const promedioPorMovieId = calcularPromedioPorMovieId(ratings);

                  
                    const peliculasConPromedio = peliculas.map(pelicula => {
                        const promedio = promedioPorMovieId.find(p => p.movie_id === parseInt(pelicula.id))?.promedio || 0;
                        return { ...pelicula, promedio };
                    });

                    const peliculasConUserRating = peliculasConPromedio.map(peli => {
                        const usrRating = userRatings.find(p => p.movie_id == peli.id)

                        return { ...peli, user_score: usrRating?.rating }
                    });

                    setData(peliculasConUserRating);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full my-14">
            {loading ? (
                <Loader />
            ) : (
                data.length > 0 && <DataTable columns={columns} data={data} />
            )}
        </div>
    );
}

export default Puntuacion;