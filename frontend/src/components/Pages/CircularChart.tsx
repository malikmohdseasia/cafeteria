import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";


interface Props {
    percentage: number;
    icon: React.ReactNode;
}

const CircularChart = ({ percentage, icon }: Props) => {
    const options: Highcharts.Options = {
        chart: {
            type: "pie",
            backgroundColor: "transparent",
            height: 110,
            width: 110,
        },
        title: { text: undefined },
        credits: { enabled: false },
        tooltip: { enabled: false },

        plotOptions: {
            pie: {
                innerSize: "75%",
                startAngle: 0,  
                endAngle: 360,     
                borderWidth: 0,
                dataLabels: { enabled: false },
                allowPointSelect: false,
                states: {
                    hover: { enabled: false },
                    inactive: { enabled: false },
                },
            },
        },

       series: [
  {
    type: "pie",
    enableMouseTracking: false,
    data: [
        { y: percentage, color: "#7B2FF7" },
      { y: 100 - percentage, color: "#EEE9FF" },
    ],
    size: "100%",
  },
],
    };

    return (
        <div className="relative w-27.5 h-27.5 flex items-center justify-center">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
                containerProps={{ style: { width: "110px", height: "110px" } }}
            />

            <div className="absolute flex items-center justify-center text-[#7B2FF7] text-2xl">
                {icon}
            </div>
        </div>
    );
};

export default CircularChart;