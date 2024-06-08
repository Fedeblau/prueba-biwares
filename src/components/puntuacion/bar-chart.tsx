
import {ResponsiveBar} from '@nivo/bar';


export const BarChart = (props) => {
    const data = props.data;
  
    const getYears = (data) => {
        // Crear un conjunto para almacenar los valores únicos
        let valoresUnicos = new Set();
    
        // Iterar sobre los objetos en los datos
        data.forEach((dato) => {
            // Agregar el valor de la clave "year" al conjunto
            valoresUnicos.add(dato.year);
        });
    
        // Convertir el conjunto de valores únicos a un array y devolverlo
        return Array.from(valoresUnicos);
    }

    const years = getYears(data)

    console.log("years ", years)

  
    return (
      <div {...props}>
        <ResponsiveBar
          data={data}
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
            tickValues: 4,
            tickPadding: 16,
          }}
          gridYValues={4}
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
    );
  }
  
