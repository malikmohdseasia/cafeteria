import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect } from "react";
import { useAnalyticsStore } from "../store/analyticsStore";

const TrendingMenuChart = () => {
  const { fetchTopSelling, topSelling } = useAnalyticsStore();

  useEffect(() => {
    fetchTopSelling("today");
  }, []);

  const chartData =
    topSelling?.map((item: any) => ({
      name: item.foodName,
      y: item.totalSold,
    })) || [];

  const options: Highcharts.Options = {
    chart: {
      type: "pie",
      backgroundColor: "transparent",
    },

    title: {
      text: undefined,
    },

    credits: { enabled: false },

    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
    },

    plotOptions: {
      pie: {
        showInLegend: true,
        allowPointSelect: false,
        dataLabels: { enabled: false },
        borderWidth: 0,
        states: {
          hover: { enabled: false },
          inactive: { enabled: false },
        },
      },
    },

    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
      backgroundColor: "transparent",
      borderWidth: 0,
      itemStyle: {
        fontWeight: "500",
        color: "#34495e",
      },
      itemHoverStyle: {
        color: "#34495e",
      },
    },

    series: [
      {
        type: "pie",
        name: "Items",
        data: chartData, 
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Trending Menus
      </h2>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TrendingMenuChart;