import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Statistic {
  id: string;
  label: string;
  value: string;
  sort_order: number;
}

export function StatsSection() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("statistics")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setStats(data);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Fallback data if database is empty
  const fallbackStats = [
    { id: "1", label: "Successful Events", value: "400+", sort_order: 1 },
    { id: "2", label: "Valued Partnerships", value: "170+", sort_order: 2 },
    { id: "3", label: "Companies", value: "8,000+", sort_order: 3 },
    { id: "4", label: "Experts Featured", value: "1,350+", sort_order: 4 },
    { id: "5", label: "Delegates Engaged", value: "14,000+", sort_order: 5 },
    { id: "6", label: "Industry Awards", value: "500+", sort_order: 6 },
  ];

  const displayStats = stats.length > 0 ? stats : fallbackStats;

  return (
    <section className="py-8 bg-background">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {displayStats.map((stat, index) => (
            <div
              key={stat.id}
              className="stats-card animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="stats-number">{stat.value}</div>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
