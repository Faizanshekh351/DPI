import { motion } from 'framer-motion';
import { Shield, GraduationCap, Briefcase } from 'lucide-react';

export default function HowItWorks() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      variants={containerVars} initial="hidden" animate="show"
      className="max-w-4xl mx-auto w-full flex flex-col gap-10 py-10"
    >
      <motion.div variants={itemVars} className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Real-world Use Cases</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Deep Packet Inspection isn't just an abstract concept—it is the backbone of modern network security and management.
        </p>
      </motion.div>

      <div className="flex flex-col gap-8">
        
        {/* Use Case 1 */}
        <motion.div variants={itemVars} className="glass-panel p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 text-primary">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Enterprise Network Administrators</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              A company might have strict policies against using peer-to-peer file sharing or streaming services like Netflix on corporate Wi-Fi. Traditional firewalls fail because these services share the same ports (443) as legitimate traffic.
            </p>
            <p className="text-sm text-gray-500">
              <strong className="text-primary mr-2">How this engine helps:</strong> It peers into the encrypted payloads, extracting the TLS headers to identify the application, allowing admins to silently drop Netflix packets while leaving vital web traffic untouched.
            </p>
          </div>
        </motion.div>

        {/* Use Case 2 */}
        <motion.div variants={itemVars} className="glass-panel p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0 border border-secondary/30 text-secondary">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Home Users & Parental Content Control</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Parents wanting to ensure younger children aren't accessing platforms like TikTok late at night face a challenge when standard router blocking fails against VPNs or direct IP connections.
            </p>
            <p className="text-sm text-gray-500">
              <strong className="text-secondary mr-2">How this engine helps:</strong> By setting a simple domain rule for `tiktok.com`, the engine interrupts the connection at the application level—enabling robust, device-agnostic parental blocking.
            </p>
          </div>
        </motion.div>

        {/* Use Case 3 */}
        <motion.div variants={itemVars} className="glass-panel p-8 flex flex-col md:flex-row gap-6 items-start relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0 border border-accent/30 text-accent">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Cybersecurity Education</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Students learning about network protocols need visual, interactive methods of seeing how packets form connections and exactly where encryption secures (and fails to secure) identity metadata.
            </p>
            <p className="text-sm text-gray-500">
              <strong className="text-accent mr-2">How this engine helps:</strong> The tool visually strips down massive PCAP files into readable analytic charts, demonstrating the mapping between raw byte flows and real-life web apps.
            </p>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}
