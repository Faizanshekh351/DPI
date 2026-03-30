import { Link } from 'react-router-dom';
import { motion, type Variants, type Easing } from 'framer-motion';
import { ShieldCheck, Database, Layers, ArrowRight, Code2 } from 'lucide-react';

export default function Home() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const EASE: Easing = 'easeOut';

  const itemVars: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }
  };

  return (
    <motion.div 
      variants={containerVars} initial="hidden" animate="show"
      className="max-w-5xl mx-auto w-full flex flex-col gap-16 py-10"
    >
      {/* Hero Section */}
      <motion.div variants={itemVars} className="text-center space-y-6">
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Packet Inspection</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          A high-performance Deep Packet Inspection (DPI) engine built for real-time traffic analysis, application identification, and rule-based flow blocking.
        </p>
        <div className="flex items-center justify-center gap-4 pt-6">
          <Link to="/engine" className="btn-primary flex items-center gap-2 text-lg px-8 py-3">
            Open DPI Engine <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/whitepaper" className="glass-panel text-white hover:bg-white/5 transition-colors flex items-center gap-2 text-lg px-8 py-3 rounded-lg font-medium border border-white/10">
            Read Whitepaper
          </Link>
        </div>
      </motion.div>

      {/* Tech Stack Banner */}
      <motion.div variants={itemVars} className="glass-panel p-8 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Code2 className="w-64 h-64" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Layers className="text-primary" /> Technical Architecture
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">Frontend</h3>
            <p className="text-sm text-gray-400">React 19, Vite, Tailwind CSS v4, Framer Motion</p>
          </div>
          <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">Backend API</h3>
            <p className="text-sm text-gray-400">Node.js, Express, TypeScript, RESTful architecture</p>
          </div>
          <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">Data Processing</h3>
            <p className="text-sm text-gray-400">Custom PCAP Buffer parsing, TLS SNI chunk extraction</p>
          </div>
          <div className="bg-black/40 border border-white/5 p-5 rounded-xl">
            <h3 className="text-white font-semibold flex items-center gap-2 mb-2">Storage</h3>
            <p className="text-sm text-gray-400">MongoDB / Mongoose for indexed flow tracking & rules</p>
          </div>
        </div>
      </motion.div>

      {/* Feature Highlights */}
      <motion.div variants={itemVars} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-secondary">
          <ShieldCheck className="w-12 h-12 text-secondary mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">L7 Application Identity</h3>
          <p className="text-gray-400">
            Going beyond traditional IP/Port blocking, the engine processes Transport Layer Security (TLS) handshakes to extract 
            Server Name Indications (SNI). This enables highly accurate identification of applications like Netflix, YouTube, or TikTok, regardless of dynamic IPs.
          </p>
        </div>
        
        <div className="glass-panel p-8 rounded-2xl border-t-4 border-t-accent">
          <Database className="w-12 h-12 text-accent mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">Live Traffic Analytics</h3>
          <p className="text-gray-400">
            Visualize network states instantaneously. Track allowed vs. blocked flows, analyze historical application protocol usage, 
            and define granular filtering rules that instantly simulate packet dropping entirely within the browser.
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
}
