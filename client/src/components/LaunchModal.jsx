import { X } from "lucide-react";

const LaunchModal = ({ selectedLaunch, onClose }) => {
  if (!selectedLaunch) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border-2 border-cyan-500 max-w-2xl w-full p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-xs text-cyan-500 font-mono mb-2">
              MISSION DETAILS
            </div>
            <h2 className="text-3xl font-black">{selectedLaunch.mission}</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {selectedLaunch.image && (
          <img
            src={selectedLaunch.image}
            alt="mission"
            className="w-full rounded-md mb-4 object-cover"
          />
        )}

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <div className="text-zinc-500 text-xs font-mono mb-1">AGENCY</div>
            <div className="text-lg font-bold">{selectedLaunch.agency}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-mono mb-1">VEHICLE</div>
            <div className="text-lg font-bold">{selectedLaunch.rocket}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-mono mb-1">
              LAUNCH DATE
            </div>
            <div className="text-lg font-bold">
              {selectedLaunch.date
                ? selectedLaunch.date.toLocaleDateString()
                : "TBD"}
            </div>
          </div>
          <div>
            <div className="text-zinc-500 text-xs font-mono mb-1">STATUS</div>
            <div
              className={`text-lg font-bold ${
                selectedLaunch.success === true
                  ? "text-cyan-400"
                  : selectedLaunch.success === false
                  ? "text-rose-400"
                  : "text-yellow-400"
              }`}
            >
              {selectedLaunch.status}
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <div className="text-zinc-400 leading-relaxed">
            {selectedLaunch.missionDescription || (
              <>
                Mission{" "}
                {selectedLaunch.success === true
                  ? "successfully completed"
                  : selectedLaunch.success === false
                  ? "encountered an anomaly"
                  : "is scheduled"}{" "}
                {selectedLaunch.date
                  ? `on ${selectedLaunch.date.toLocaleDateString()}.`
                  : "."}
              </>
            )}

            {selectedLaunch.failReason && (
              <div className="text-rose-400 text-sm mt-3">
                Failure Reason: {selectedLaunch.failReason}
              </div>
            )}

            {selectedLaunch.holdReason && (
              <div className="text-yellow-400 text-sm mt-3">
                Hold Reason: {selectedLaunch.holdReason}
              </div>
            )}

            {selectedLaunch.weatherConcerns && (
              <div className="text-orange-400 text-sm mt-3">
                Weather: {selectedLaunch.weatherConcerns}
              </div>
            )}

            {selectedLaunch.webcast && (
              <div className="mt-4">
                <a
                  href={selectedLaunch.webcast}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline"
                >
                  Watch Webcast
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchModal;
