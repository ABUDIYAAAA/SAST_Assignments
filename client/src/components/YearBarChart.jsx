import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const YearBarChart = ({ yearData }) => (
  <div className="bg-zinc-900 p-6">
    <h3 className="text-lg font-bold mb-4 font-mono">
      SUCCESS / FAILURE BY YEAR
    </h3>
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={yearData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="year" stroke="#71717a" />
        <YAxis stroke="#71717a" />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
          }}
          labelStyle={{ color: "#fff" }}
        />
        <Legend />
        <Bar dataKey="success" fill="#06b6d4" name="Success" />
        <Bar dataKey="failure" fill="#f43f5e" name="Failure" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default YearBarChart;
