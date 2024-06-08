import { BarChart } from "./puntuacion/bar-chart"

const Graficos = ({data}) => {


    
  return (
    <BarChart className="aspect-[6/3] max-w-[75vw] text-black" data={data} />         
  )
}

export default Graficos