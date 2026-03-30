import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, UploadCloud, Database, HelpCircle } from 'lucide-react';
import UploadPcap from '../components/UploadPcap';
import Dashboard from '../components/Dashboard';
import FlowTable from '../components/FlowTable';
import RulesManager from '../components/RulesManager';
import TourGuide from '../components/TourGuide';
import { api } from '../api/client';

// Stats shape returned by GET /api/stats
interface AppStat { _id: string; count: number; bytes: number; }
interface ProtoStat { _id: number; count: number; }
interface Stats {
  totalFlows: number;
  blockedFlows: number;
  appsStats: AppStat[];
  protoStats: ProtoStat[];
}

export default function Engine() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'upload', label: 'Upload PCAP', icon: UploadCloud },
    { id: 'flows', label: 'Flows Log', icon: Database },
    { id: 'rules', label: 'Block Rules', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full max-w-7xl mx-auto w-full">
      {/* Sidebar - Local to the Tool */}
      <div className="w-full md:w-64 flex flex-col gap-6 flex-shrink-0">
        <nav className="flex flex-col gap-2 glass-panel p-3 h-full max-h-[400px] relative">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-primary/20 text-white border border-primary/50 shadow-[0_0_15px_rgba(79,70,229,0.2)]' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-primary' : ''}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="mt-auto border-t border-white/10 pt-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-gray-400 hover:text-white hover:bg-white/5 w-full text-left"
            >
              <HelpCircle className="w-5 h-5 text-secondary" />
              Engine Tour
            </button>
          </div>
        </nav>
      </div>

      {/* Tour Guide Modal */}
      <TourGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* Content Area */}
      <div className="flex-1 glass-panel p-6 relative overflow-hidden min-h-[75vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && <Dashboard stats={stats} />}
            {activeTab === 'upload' && (
               <UploadPcap 
                  onUploadComplete={() => { 
                     fetchStats(); 
                     setActiveTab('dashboard'); 
                  }} 
               />
            )}
            {activeTab === 'flows' && <FlowTable />}
            {activeTab === 'rules' && <RulesManager />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
