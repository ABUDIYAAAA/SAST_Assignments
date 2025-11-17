import { Search } from "lucide-react";

const LaunchTable = ({ filteredLaunches, loading, onSelect }) => (
  <div className="bg-zinc-900 p-6">
    <h3 className="text-lg font-bold mb-4 font-mono">LAUNCH HISTORY</h3>

    <div className="relative mb-4">
      <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
      {/* Search input lives in parent to preserve layout; placeholder left intentionally */}
    </div>

    <div className="max-h-96 overflow-y-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-zinc-800 sticky top-0 bg-zinc-900">
          <tr className="text-left text-zinc-500 font-mono text-xs">
            <th className="pb-3">STATUS</th>
            <th className="pb-3">DATE</th>
            <th className="pb-3">MISSION</th>
            <th className="pb-3">AGENCY</th>
            <th className="pb-3">VEHICLE</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-zinc-500">
                Loading launches...
              </td>
            </tr>
          ) : (
            filteredLaunches.map((launch) => (
              <tr
                key={launch.id}
                onClick={() => onSelect(launch)}
                className="border-b border-zinc-900 hover:bg-zinc-800 cursor-pointer transition-colors"
              >
                <td className="py-3">
                  <span
                    className={`w-2 h-2 rounded-full inline-block ${
                      launch.success === true
                        ? "bg-cyan-500"
                        : launch.success === false
                        ? "bg-rose-500"
                        : "bg-yellow-400"
                    }`}
                  ></span>
                </td>
                <td className="py-3 text-zinc-400 font-mono text-xs">
                  {launch.date ? launch.date.toLocaleDateString() : "TBD"}
                </td>
                <td className="py-3">{launch.mission}</td>
                <td className="py-3 text-zinc-400">{launch.agency}</td>
                <td className="py-3 text-zinc-400 font-mono text-xs">
                  {launch.rocket}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default LaunchTable;
