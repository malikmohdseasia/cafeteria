import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAnalyticsStore } from "../../store/analyticsStore";
import { useEffect, useState } from "react";

const RevenueChart = () => {
  const { fetchRevenueData, revenueData } = useAnalyticsStore();
  const [range, setRange] = useState("7");

  useEffect(() => {
    fetchRevenueData(range);
  }, [range]);

  const categories =
    revenueData?.map((item: any) =>
      new Date(item.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    ) || [];

  const revenueSeries = revenueData?.map((item: any) => item.revenue) || [];
  const ordersSeries = revenueData?.map((item: any) => item.orders) || [];

  const options: Highcharts.Options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      spacingRight: 0,
    },

    title: { text: undefined },

    credits: { enabled: false },

    xAxis: {
      categories: categories,
      title: { text: "Day" },
      gridLineWidth: 1,
    },

    yAxis: {
      title: { text: "Amount" },
      gridLineWidth: 1,
    },

    legend: {
      enabled: true,
      align: "right",
      verticalAlign: "middle",
      layout: "vertical",
    },

    plotOptions: {
      series: {
        marker: { enabled: false },
      },
    },

    series: [
      {
        type: "line",
        name: "Revenue",
        data: revenueSeries,
        color: "#A02C63",
      },
      {
        type: "line",
        name: "Orders",
        data: ordersSeries,
        color: "#7E97D0",
      },
    ],
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Revenue Chart
        </h2>

        <div className="space-x-2">
          <button
            onClick={() => setRange("today")}
            className={`px-2 py-1 rounded-md cursor-pointer ${range === "today" ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
          >
            Today
          </button>

          <button
            onClick={() => setRange("3")}
            className={`px-2 py-1 rounded-md cursor-pointer ${range === "3" ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
          >
            3 Days
          </button>
          <button
            onClick={() => setRange("7")}
            className={`px-2 py-1 rounded-md cursor-pointer ${range === "7" ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
          >
            Week
          </button>

          <button
            onClick={() => setRange("30")}
            className={`px-2 py-1 rounded-md cursor-pointer ${range === "30" ? "bg-purple-600 text-white" : "bg-gray-200"
              }`}
          >
            Month
          </button>
        </div>
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default RevenueChart;