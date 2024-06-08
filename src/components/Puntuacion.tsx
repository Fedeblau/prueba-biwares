import { useContext, useEffect, useState } from 'react';
import { DataTable } from './puntuacion/data-table';
import { Pelicula, columns } from './puntuacion/columns';
import { UserContext } from '../context/userContext';
import { Skeleton } from "../components/ui/skeleton"


type Item = {
    id: string;
    Name: string;
    'Release Date': string;
    [key: string]: any; // This allows for other genre properties
}

type Rating = {
    movie_id: string;
    rating: number;
    // Add other properties as needed
}

type Promedio = {
    movie_id: number;
    promedio: number;
}

const genres = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

// Loader component
const Loader = () => (
    <Skeleton className="w-[100px] h-[20px] rounded-full" />
);

const Puntuacion = () => {
    const { user } = useContext(UserContext);

    const [data, setData] = useState<Pelicula[]>([]);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2, response3] = await Promise.all([
                    fetch('https://script.google.com/macros/s/AKfycbzkTqrecKUFNvqUtK279UB01r0oNYaSOzSj8QthrooK_-Sj0LLomQ7KbJZMhH3hGB6R/exec'),
                    fetch('https://script.google.com/macros/s/AKfycbynvRUOEdQV-cNWj3NBh4az3DJpNHaK9tbNE-ppHG50DifyBNxcAvKqEpaln1mdWQ2f/exec'),
                    fetch(`https://script.google.com/macros/s/AKfycbyGZPRQ0tqucsonA5a9MpFZi9-hblcSI6fvguMtrmBjfC5z3CU1IywBWblBwii4_mZg6Q/exec?id=${user.id}`)
                ]);

                const data1 = await response1.json() as Item[];
                const ratings = await response2.json() as Rating[];
                const userRatings = await response3.json() as Rating[];

                // Transform data1 into the desired format
                const peliculas = data1.map(item => {
                    const genero = genres.filter(genre => item[genre] === '1')
                    return {
                        id: item.id,
                        name: item.Name, // Usa 'Name' en lugar de 'name'
                        release_date: new Date(item['Release Date']).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                        }), // Usa 'Release Date' en lugar de 'release_date'
                        genero,
                        promedio: 0, // This will be updated later
                        user_score: null
                    }
                });

                // Función para calcular el promedio de rating para cada movie_id
                function calcularPromedio(arr: number[]): number {
                    const sum = arr.reduce((total, current) => total + current, 0);
                    const prom = Math.round((sum / arr.length) * 10) / 10
                    return prom;
                }

                // Función para calcular el promedio de rating para cada movie_id
                function calcularPromedioPorMovieId(ratings: Rating[]): Promedio[] {
                    const promedios: { [key: string]: number[] } = {};

                    // Agrupar calificaciones por movie_id
                    ratings.forEach(rating => {
                        if (!promedios[rating.movie_id]) {
                            promedios[rating.movie_id] = [];
                        }
                        promedios[rating.movie_id].push(rating.rating * 1);
                    });

                    // Calcular el promedio para cada movie_id
                    const result: Promedio[] = [];
                    for (const movie_id in promedios) {
                        if (promedios.hasOwnProperty(movie_id)) {
                            const promedio = calcularPromedio(promedios[movie_id]);
                            result.push({ movie_id: parseInt(movie_id), promedio });
                        }
                    }

                    return result;
                }

                // Calcular promedio de rating para cada movie_id
                const promedioPorMovieId: Promedio[] = calcularPromedioPorMovieId(ratings);

                // Actualizar el promedio de cada película en el estado de data
                const peliculasConPromedio = peliculas.map(pelicula => {
                    const promedio = promedioPorMovieId.find(p => p.movie_id === parseInt(pelicula.id))?.promedio || 0;
                    return { ...pelicula, promedio };
                });

                const peliculasConUserRating = peliculasConPromedio.map(peli => {
                    const usrRating = userRatings.find(p => p.movie_id == peli.id)

                    return { ...peli, user_score: usrRating?.rating }
                });

                setData(peliculasConUserRating);
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