import { motion } from 'framer-motion';
import { Download, UploadCloud, PieChart, ShieldAlert } from 'lucide-react';

export default function Guide() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  const steps = [
    {
      title: "1. Capture Network Traffic",
      icon: Download,
      color: "text-primary",
      bg: "bg-primary/20",
      content: "Before you can analyze packets, you need a .pcap (Packet Capture) file. The standard way to get this is by using Wireshark, a free network protocol analyzer. Open Wireshark, select your active network interface (like Wi-Fi), and start capturing. Browse a few websites, then stop the capture and save the file via File > Save As."
    },
    {
      title: "2. Upload the PCAP File",
      icon: UploadCloud,
      color: "text-secondary",
      bg: "bg-secondary/20",
      content: "Navigate to the DPI Engine page and click the 'Upload PCAP' tab. Drag and drop your newly saved .pcap file into the upload zone. Our Node.js backend will silently parse the bytes, identifying the source, destination, and—crucially—the Server Name Indication (SNI) to figure out which apps you were using."
    },
    {
      title: "3. Analyze the Dashboard",
      icon: PieChart,
      color: "text-accent",
      bg: "bg-accent/20",
      content: "Switch to the 'Dashboard' tab. Here, you'll see a visual breakdown of your network traffic. The charts will highlight which applications consumed the most packets and bytes, giving you a top-down view of where your bandwidth is actually going."
    },
    {
      title: "4. Create Blocking Rules",
      icon: ShieldAlert,
      color: "text-danger",
      bg: "bg-danger/20",
      content: "Want to simulate dropping traffic? Go to the 'Block Rules' tab. You can create rules based on Domain Name (e.g., 'netflix.com'), App Type ('FACEBOOK'), or specific IP addresses. Once active, upload your PCAP file again. You'll instantly see how many flows the engine would have successfully intercepted and dropped!"
    }
  ];

  return (
    <motion.div 
      variants={containerVars} initial="hidden" animate="show"
      className="max-w-4xl mx-auto w-full flex flex-col gap-10 py-10"
    >
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">User Guide</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Learn how to generate payload files, parse them through the engine, and enforce your custom security rules.
        </p>
      </div>

      <div className="relative border-l-2 border-white/10 ml-6 md:ml-12 pl-8 pb-4 space-y-16">
        {steps.map((step, idx) => (
          <motion.div key={idx} variants={itemVars} className="relative">
            {/* Timeline dot */}
            <div className={`absolute -left-[45px] top-1 w-12 h-12 rounded-full ${step.bg} border-4 border-background flex items-center justify-center -translate-x-[50%] z-10 box-content`}>
               <step.icon className={`w-5 h-5 ${step.color}`} />
            </div>
            
            <div className="glass-panel p-6 rounded-2xl relative">
              <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {step.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
