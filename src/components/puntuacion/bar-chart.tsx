
import {ResponsiveBar} from '@nivo/bar';


export const BarChart = (props) => {
    const data = props.data;
  
    const ratingCounts = {};
  
    data.forEach(item => {
      const rating = item.rating;
      ratingCounts[rating] = (ratingCounts[rating] || 0) + 1;
    });
  
    const barChartData = Object.keys(ratingCounts).map(rating => ({
      rating: rating,
      count: ratingCounts[rating]
    }));
  
    return (
      <div {...props}>
        <ResponsiveBar
          data={barChartData}
          keys={["count"]}
          indexBy="rating"
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
  
