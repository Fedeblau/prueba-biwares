
import { ResponsiveBar } from '@nivo/bar';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';


export const BarChart = (props) => {
    const { data, histograma } = props
    const [genre, setGenero] = useState(null)
    const [graf, setGraf] = useState(data)
    const [histoGraf, setHistoGraf] = useState(data)

    const genres = ['Action', 'Adventure', 'Animation', 'Children\'s', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Film-Noir', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'War', 'Western'];

    function transformarObjetoAArray(obj) {
        return Object.entries(obj).map(([clave, valor]) => ({
            prop: clave,
            ...valor
        }));
    }


    useEffect(() => {
        if (genre) {
            setGraf(data.filter(e => e.genre === genre))
            console.log("genre", genre)
            const arr = transformarObjetoAArray(histograma[genre])
            console.log(transformarObjetoAArray(histograma[genre]))
            setHistoGraf(arr)
        }
    }, [genre])



    console.log("HISTOGRAF!!!! ", histoGraf)



    return (
        <>
            <header className="mt-20 text-white">
                {
                    genres.map(g => <Button key={g} variant={"borde"} onClick={() => setGenero(g)}>{g}</Button>)
                }
            </header>

            <div className='grid grid-cols-2'>

                <div>

                
                        <h2 className='text-2xl my-10 font text-white'>{genre || "Selecciona un género"}</h2>
                    
                    <div {...props}>
                        <ResponsiveBar

                            data={graf}
                            keys={["average_rating"]}
                            indexBy="year"
                            margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
                            padding={0.3}
                            colors={["#2563eb"]}
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 16,
                            }}
                            axisLeft={{
                                tickSize: 0,
                                tickValues: 5,
                                tickPadding: 16,
                            }}
                            gridYValues={5}
                            theme={{
                                tooltip: {
                                    chip: {
                                        borderRadius: "9999px",
                                    },
                                    container: {
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        borderRadius: "6px",
                                    },
                                },
                                grid: {
                                    line: {
                                        stroke: "#f3f4f6",
                                    },
                                },
                            }}
                            tooltipLabel={({ id }) => `${id}`}
                            enableLabel={false}
                            role="application"
                            ariaLabel="peliculas por rating"
                        />
                    </div>
                </div>
                <div>
                    <h2 className='text-2xl my-10 font text-white'>Histograma</h2>
                    <div {...props}>
                        <ResponsiveBar
                            data={histoGraf}
                            keys={["0-18","19-25","26-45","+46"]}
                            indexBy="prop"
                            margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
                            padding={0.3}
                            
                            axisBottom={{
                                tickSize: 0,
                                tickPadding: 16,
                            }}
                            axisLeft={{
                                tickSize: 0,
                                tickValues: 5,
                                tickPadding: 16,
                            }}
                            gridYValues={5}
                            theme={{
                                tooltip: {
                                    chip: {
                                        borderRadius: "9999px",
                                    },
                                    container: {
                                        fontSize: "12px",
                                        textTransform: "capitalize",
                                        borderRadius: "6px",
                                    },
                                },
                                grid: {
                                    line: {
                                        stroke: "#f3f4f6",
                                    },
                                },
                            }}
                            tooltipLabel={({ id }) => `${id}`}
                            enableLabel={false}
                            role="application"
                            ariaLabel="peliculas por rating"
                        />
                    </div>
                </div>
            </div>
        </>


    );
}

