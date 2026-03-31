import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion, type Variants, type Easing } from 'framer-motion';
import { Shield, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react';

// ------------------------------------------------------------------
// Typed interfaces matching the /api/stats response shape
// ------------------------------------------------------------------
interface AppStat { _id: string; count: number; bytes: number; }
interface ProtoStat { _id: number; count: number; }
interface Stats {
  totalFlows: number;
  blockedFlows: number;
  appsStats: AppStat[];
  protoStats: ProtoStat[];
}

// Shapes produced by the .map() transforms below
interface AppChartRow { name: string; Count: number; Bytes: number; }
interface ProtoChartRow { name: string; val: number; }

export default function Dashboard({ stats }: { stats: Stats | null }) {

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400 animate-pulse text-lg">Loading statistics...</p>
      </div>
    );
  }

  const { totalFlows, blockedFlows, appsStats, protoStats } = stats;

  const COLORS = ['#4f46e5', '#a855f7', '#ec4899', '#f43f5e', '#facc15', '#10b981'];

  // Transform API data → chart-friendly rows
  const protoData: ProtoChartRow[] = protoStats.map((p) => ({
    name: p._id === 6 ? 'TCP' : p._id === 17 ? 'UDP' : `Proto ${p._id}`,
    val: p.count
  }));

  const appData: AppChartRow[] = appsStats.map((a) => ({
    name: a._id,
    Count: a.count,
    Bytes: a.bytes
  }));

  // 'easeOut' must be typed as Easing (not a plain string) to satisfy Framer Motion v12
  const EASE: Easing = 'easeOut';

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: EASE }
    })
  };

  return (
    <div className="space-y-6 flex flex-col h-full overflow-y-auto pr-2 pb-12">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Network Traffic Overview</h2>
          <p className="text-gray-400 text-sm mt-1">Real-time deep packet inspection metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="bg-gradient-to-br from-panel to-panel/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Activity className="w-32 h-32" />
          </div>
          <div>
            <p className="text-gray-400 font-medium">Total Flows Tracked</p>
            <p className="text-4xl font-bold text-white mt-2">{totalFlows}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
            <Activity className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="bg-gradient-to-br from-panel to-panel/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Shield className="w-32 h-32" />
          </div>
          <div>
            <p className="text-gray-400 font-medium">Allowed Flows</p>
            <p className="text-4xl font-bold text-accent mt-2">{totalFlows - blockedFlows}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30 text-accent">
            <Shield className="w-6 h-6" />
          </div>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bg-gradient-to-br from-panel to-panel/50 border border-white/5 p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <ShieldAlert className="w-32 h-32" />
          </div>
          <div>
            <p className="text-gray-400 font-medium">Blocked &amp; Dropped</p>
            <p className="text-4xl font-bold text-danger mt-2">{blockedFlows}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center border border-danger/30 text-danger">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 min-h-[400px]">
        {/* Apps Bar Chart */}
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            Top Applications Identified <ArrowUpRight className="w-4 h-4 text-gray-500" />
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {appData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appData.slice(0, 8)} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={true} vertical={false} />
                  <XAxis type="number" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#ffffff90" fontSize={12} tickLine={false} axisLine={false} width={80} />
                  <Tooltip
                    cursor={{fill: '#ffffff05'}}
                    contentStyle={{ backgroundColor: '#151520', border: '1px solid #ffffff20', borderRadius: '12px' }}
                  />
                  <Bar dataKey="Count" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                    {appData.map((_entry: AppChartRow, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No App Data Available</div>
            )}
          </div>
        </motion.div>

        {/* Protocol Pie Chart */}
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="glass-panel p-6 flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            Protocol Distribution <ArrowUpRight className="w-4 h-4 text-gray-500" />
          </h3>
          <div className="flex-1 w-full min-h-[300px]">
            {protoData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={protoData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="val"
                    stroke="none"
                  >
                    {protoData.map((_entry: ProtoChartRow, index: number) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#4f46e5' : '#10b981'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#151520', border: '1px solid #ffffff20', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
             ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No Protocol Data Available</div>
            )}

            {/* Legend inside Pie */}
            <div className="absolute inset-0 flex items-center justify-center mt-6 pointer-events-none">
                <div className="text-center">
                    <p className="text-3xl font-bold">{totalFlows}</p>
                    <p className="text-xs text-gray-400">Total Flows</p>
                </div>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
