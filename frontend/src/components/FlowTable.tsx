import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Database, RefreshCcw } from 'lucide-react';
import { api } from '../api/client';

interface Flow {
  _id: string;
  src_ip: string;
  dst_ip: string;
  src_port: number;
  dst_port: number;
  protocol: number; // 6 = TCP, 17 = UDP
  app_type: string;
  sni: string;
  packet_count: number;
  byte_count: number;
  blocked: boolean;
}

export default function FlowTable() {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlows = async () => {
    setLoading(true);
    try {
      const res = await api.get('/flows');
      setFlows(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlows();
  }, []);

  return (
    <div className="h-full flex flex-col pt-2 pb-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-primary" /> Flow Logs
          </h2>
          <p className="text-sm text-gray-400 mt-1">Recent 100 recorded connections</p>
        </div>
        <button 
          onClick={fetchFlows} 
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-all active:scale-95"
          title="Refresh"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden glass-panel flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 text-gray-400 text-sm border-b border-white/10">
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Destination</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Protocol</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">App / SNI</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Stats</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 overflow-y-auto">
              {flows.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No flow data found. Upload a PCAP file to get started.
                  </td>
                </tr>
              )}
              {flows.map((f, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02, duration: 0.2 }}
                  key={f._id} 
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{f.src_ip}</span>
                    <span className="text-gray-500 text-xs ml-1">:{f.src_port}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{f.dst_ip}</span>
                    <span className="text-gray-500 text-xs ml-1">:{f.dst_port}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${f.protocol === 6 ? 'bg-primary/20 text-primary' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {f.protocol === 6 ? 'TCP' : 'UDP'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {f.app_type !== 'UNKNOWN' ? (
                      <div className="flex flex-col">
                        <span className="font-medium text-white">{f.app_type}</span>
                        {f.sni && <span className="text-xs text-secondary truncate max-w-[150px]">{f.sni}</span>}
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Unknown Data</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-gray-300">{f.packet_count} Pkts</span>
                      <span className="text-gray-500 text-xs">{(f.byte_count / 1024).toFixed(1)} KB</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {f.blocked ? (
                      <div className="flex items-center gap-1 text-danger bg-danger/10 px-2 py-1 rounded w-max text-sm font-medium">
                        <ShieldAlert className="w-4 h-4" /> Dropped
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-accent bg-accent/10 px-2 py-1 rounded w-max text-sm font-medium">
                        <ShieldCheck className="w-4 h-4" /> Forwarded
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
