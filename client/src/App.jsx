import React, { useEffect, useMemo, useState } from "react";
import { Search, Rocket, X } from "lucide-react";
import NextLaunchCard from "./components/NextLaunchCard";
import StatCard from "./components/StatCard";
import SuccessPie from "./components/SuccessPie";
import YearBarChart from "./components/YearBarChart";
import LaunchTable from "./components/LaunchTable";
import LaunchModal from "./components/LaunchModal";
import { getDB, setDB } from "./db/launchDB";

/* ----------------------------- Helpers / Mock ---------------------------- */
const generateMockData = () => {
  const launches = [];
  const agencies = [
    "SpaceX",
    "NASA",
    "Roscosmos",
    "ISRO",
    "ESA",
    "Blue Origin",
    "Rocket Lab",
  ];
  const missions = [
    "Communications Satellite",
    "ISS Resupply",
    "Earth Observation",
    "GPS Constellation",
    "Mars Mission",
    "Moon Landing",
    "Scientific Research",
  ];

  for (let year = 2018; year <= 2024; year++) {
    const numLaunches = Math.floor(Math.random() * 30) + 20;
    for (let i = 0; i < numLaunches; i++) {
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      const success = Math.random() > 0.15;

      launches.push({
        id: `${year}-${i}`,
        date: new Date(year, month - 1, day),
        agency: agencies[Math.floor(Math.random() * agencies.length)],
        mission: missions[Math.floor(Math.random() * missions.length)],
        rocket: `Rocket-${Math.floor(Math.random() * 100)}`,
        success,
        year,
        image: null,
        webcast: null,
        status: success ? "Launch Success" : "Launch Failure",
      });
    }
  }

  return launches.sort((a, b) => b.date - a.date);
};

/* ------------------------------- Mapping -------------------------------- */
const mapLaunch = (l) => {
  const net = l.net || l.window_start || l.window_end || null;
  const date = net ? new Date(net) : null;

  return {
    id: l.id,
    date,
    mission: l.mission?.name || l.name || "Unnamed Mission",
    missionDescription: l.mission?.description || "",
    agency: l.launch_service_provider?.name || "Unknown",
    rocket:
      l.rocket?.configuration?.name ||
      l.configuration?.name ||
      "Unknown Rocket",
    rocketFamily: l.rocket?.configuration?.family || l.family || "",
    rocketVariant:
      l.rocket?.configuration?.variant || l.configuration?.variant || "",
    rocketFullName:
      l.rocket?.configuration?.full_name || l.configuration?.full_name || "",
    location: l.pad?.location?.name || l.pad?.location?.name || "",
    padName: l.pad?.name || "",
    image: l.image || l.infographic || null,
    // LL2 exposes vidURLs array, and webcast_live bool — prefer first vidURL if present
    webcast: l.vidURLs?.[0]?.url || (l.webcast_live ? l.webcast_live : null),
    status: l.status?.name || "Unknown",
    success:
      l.status?.abbrev === "Success"
        ? true
        : l.status?.abbrev === "Failure"
        ? false
        : null,
    failReason: l.failreason || null,
    holdReason: l.holdreason || null,
    weatherConcerns: l.weather_concerns || null,
    slug: l.slug || null,
    attempts: {
      agency: l.agency_launch_attempt_count || 0,
      location: l.location_launch_attempt_count || 0,
      pad: l.pad_launch_attempt_count || 0,
      orbital: l.orbital_launch_attempt_count || 0,
    },
    year: date ? date.getFullYear() : null,
  };
};

/* ------------------------------- Main App -------------------------------- */
const SpaceLaunchDashboard = () => {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLaunch, setSelectedLaunch] = useState(null);
  const [upcomingLaunch, setUpcomingLaunch] = useState({});
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [error, setError] = useState(null);

  /* ------------------------------- Fetching ------------------------------- */
  useEffect(() => {
    const controller = new AbortController();

    async function loadLaunches() {
      try {
        setLoading(true);
        setError(null);

        const now = Date.now();
        const cacheDurationPast = 10 * 60 * 1000; // 10 min
        const cacheDurationUpcoming = 2 * 60 * 1000; // 2 min

        const cachedPast = await getDB("pastLaunches", "data");
        const cachedPastTime = await getDB("timestamps", "past");
        const cachedNext = await getDB("upcomingLaunch", "data");
        const cachedNextTime = await getDB("timestamps", "upcoming");

        let usePastCache = false;
        let useUpcomingCache = false;

        if (
          cachedPast &&
          cachedPastTime &&
          now - cachedPastTime < cacheDurationPast
        ) {
          setLaunches(cachedPast);
          usePastCache = true;
        }

        if (
          cachedNext &&
          cachedNextTime &&
          now - cachedNextTime < cacheDurationUpcoming
        ) {
          setUpcomingLaunch(cachedNext);
          useUpcomingCache = true;
        }

        // Fetch PAST launches
        if (!usePastCache) {
          const pastRes = await fetch(
            "https://ll.thespacedevs.com/2.2.0/launch/past/?limit=200&ordering=-net",
            { signal: controller.signal }
          );
          const pastJson = await pastRes.json();
          const mapped = (pastJson.results || [])
            .map(mapLaunch)
            .filter((l) => l.date);

          setLaunches(mapped);
          await setDB("pastLaunches", "data", mapped);
          await setDB("timestamps", "past", now);
        }

        // Fetch NEXT launch
        if (!useUpcomingCache) {
          const nextRes = await fetch(
            "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=1&ordering=net",
            { signal: controller.signal }
          );
          const nextJson = await nextRes.json();

          if (nextJson.results?.length > 0) {
            const mapped = mapLaunch(nextJson.results[0]);
            setUpcomingLaunch(mapped);
            await setDB("upcomingLaunch", "data", mapped);
            await setDB("timestamps", "upcoming", now);
          }
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("API failed. Using fallback data.");
        setLaunches(generateMockData());
      } finally {
        setLoading(false);
      }
    }

    loadLaunches();
    return () => controller.abort();
  }, []);

  /* ------------------------------ Countdown ------------------------------- */
  useEffect(() => {
    let timer = null;

    function update() {
      const now = new Date();
      const target =
        upcomingLaunch?.date instanceof Date ? upcomingLaunch.date : null;
      if (!target) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const diff = target - now;
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }

    // initial
    update();
    timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [upcomingLaunch]);

  /* --------------------------------- Stats -------------------------------- */
  const stats = useMemo(() => {
    const total = launches.length;
    const successful = launches.filter((l) => l.success === true).length;
    const successRate = total ? ((successful / total) * 100).toFixed(1) : 0;

    const byYear = launches.reduce((acc, launch) => {
      const y = launch.year || "Unknown";
      if (!acc[y]) acc[y] = { year: y, success: 0, failure: 0, total: 0 };
      acc[y].total++;
      if (launch.success === true) acc[y].success++;
      else if (launch.success === false) acc[y].failure++;
      return acc;
    }, {});

    const yearData = Object.values(byYear)
      .filter((d) => d.year !== "Unknown")
      .sort((a, b) => a.year - b.year);

    if (yearData.length === 0) {
      return {
        total,
        successRate,
        bestYear: "N/A",
        bestYearRate: "0.0",
        yearData: [],
        pieData: [
          { name: "Successful", value: 0, color: "#06b6d4" },
          { name: "Failed", value: 0, color: "#f43f5e" },
        ],
      };
    }

    const bestYear = yearData.reduce((best, current) => {
      const currentRate = (current.success / current.total) * 100;
      const bestRate = (best.success / best.total) * 100;
      return currentRate > bestRate ? current : best;
    }, yearData[0]);

    return {
      total,
      successRate,
      bestYear: bestYear.year,
      bestYearRate: ((bestYear.success / bestYear.total) * 100).toFixed(1),
      yearData,
      pieData: [
        { name: "Successful", value: successful, color: "#06b6d4" },
        { name: "Failed", value: total - successful, color: "#f43f5e" },
      ],
    };
  }, [launches]);

  /* ---------------------------- Filtering / Selection --------------------- */
  const filteredLaunches = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return launches;
    return launches.filter(
      (launch) =>
        (launch.agency || "").toLowerCase().includes(term) ||
        (launch.mission || "").toLowerCase().includes(term) ||
        (launch.rocket || "").toLowerCase().includes(term)
    );
  }, [launches, searchTerm]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-6xl font-black mb-2">LAUNCH STATS</h1>
          <div className="h-1 w-32 bg-cyan-500"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <NextLaunchCard
            upcomingLaunch={upcomingLaunch}
            countdown={countdown}
          />

          <div className="space-y-6">
            <StatCard
              label="TOTAL"
              value={stats.total}
              accentClass="border-cyan-500"
              sub="launches tracked"
            />
            <StatCard
              label="SUCCESS"
              value={`${stats.successRate}%`}
              accentClass="border-emerald-500"
              sub="mission success rate"
            />
            <StatCard
              label="PEAK YEAR"
              value={stats.bestYear}
              accentClass="border-purple-500"
              sub={`${stats.bestYearRate}% success`}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <YearBarChart yearData={stats.yearData} />
          <SuccessPie pieData={stats.pieData} />
        </div>

        <div className="bg-zinc-900 p-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              placeholder="Filter by agency, mission, or vehicle..."
              className="w-full pl-10 pr-4 py-3 bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 font-mono text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <LaunchTable
            filteredLaunches={filteredLaunches}
            loading={loading}
            onSelect={setSelectedLaunch}
          />
        </div>
      </div>

      <LaunchModal
        selectedLaunch={selectedLaunch}
        onClose={() => setSelectedLaunch(null)}
      />

      {/* Optional error message for visibility */}
      {error && (
        <div className="fixed left-4 bottom-4 bg-rose-700 text-white px-4 py-2 rounded">
          API Error: {error}
        </div>
      )}
    </div>
  );
};

export default SpaceLaunchDashboard;
