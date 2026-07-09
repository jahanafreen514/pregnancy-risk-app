import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    trimester: "1st",
    pregnancies: 212,
  },
  {
    trimester: "2nd",
    pregnancies: 478,
  },
  {
    trimester: "3rd",
    pregnancies: 296,
  },
];

function TrimesterChart() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-[360px]">

      <h2 className="text-2xl font-bold mb-5">
        Pregnancies by Trimester
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="trimester" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="pregnancies"
            fill="#8B5CF6"
            radius={[10, 10, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}

export default TrimesterChart;