import { Rocket } from "lucide-react";

const NextLaunchCard = ({ upcomingLaunch, countdown }) => {
  return (
    <div className="lg:col-span-2 bg-zinc-900 border-2 border-cyan-500 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Rocket className="w-6 h-6 text-cyan-500" />
        <span className="text-sm font-mono text-cyan-500">NEXT LAUNCH</span>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "DAYS", value: countdown.days },
          { label: "HOURS", value: countdown.hours },
          { label: "MINS", value: countdown.minutes },
          { label: "SECS", value: countdown.seconds },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <div className="text-5xl font-black text-cyan-400 mb-1">
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="text-xs text-zinc-500 font-mono">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 text-sm border-t border-zinc-800 pt-4">
        <div className="flex justify-between">
          <span className="text-zinc-500">MISSION</span>
          <span className="font-mono">{upcomingLaunch?.mission || "TBD"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">AGENCY</span>
          <span className="font-mono">{upcomingLaunch?.agency || "TBD"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">VEHICLE</span>
          <span className="font-mono">{upcomingLaunch?.rocket || "TBD"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-zinc-500">SITE</span>
          <span className="font-mono">{upcomingLaunch?.location || "TBD"}</span>
        </div>
      </div>
    </div>
  );
};

export default NextLaunchCard;
