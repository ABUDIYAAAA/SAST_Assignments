const StatCard = ({ label, value, accentClass, sub }) => (
  <div className={`bg-zinc-900 border-l-4 ${accentClass} p-6`}>
    <div className="text-zinc-500 text-xs mb-1 font-mono">{label}</div>
    <div className="text-5xl font-black">{value}</div>
    {sub && <div className="text-zinc-500 text-sm">{sub}</div>}
  </div>
);

export default StatCard;
