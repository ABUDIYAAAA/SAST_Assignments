import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const SuccessPie = ({ pieData }) => (
  <div className="bg-zinc-900 p-6">
    <h3 className="text-lg font-bold mb-4 font-mono">OVERALL SUCCESS RATE</h3>
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #27272a",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default SuccessPie;
