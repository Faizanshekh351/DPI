import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, HelpCircle, FileBox, Activity, ShieldAlert, Database } from 'lucide-react';

interface TourGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TourGuide({ isOpen, onClose }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Reset to first step when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const steps = [
    {
      title: "Welcome to the DPI Engine",
      icon: HelpCircle,
      content: "This built-in guide will explain what this tool does and how to use its various features. Let's learn about Deep Packet Inspection!",
      color: "text-primary",
      bg: "bg-primary/20"
    },
    {
      title: "What is a PCAP file?",
      icon: FileBox,
      content: "PCAP stands for Packet Capture. It is a file that contains recorded network traffic (like emails, browsing activity, or video streams). Network administrators and security analysts use tools like Wireshark to capture these packets of data as they travel across a network to analyze them for security threats or performance issues.",
      color: "text-secondary",
      bg: "bg-secondary/20"
    },
    {
      title: "Upload PCAP Tool",
      icon: FileBox, // using generic since UploadCloud might not be imported if I reuse this, wait I have FileBox
      content: "In the 'Upload PCAP' tab, you can drag and drop your `.pcap` files into the engine. Our custom Node.js parser will process the raw binary data, extract the Server Name Indication (SNI) from encrypted HTTPS traffic, and store the resulting 'flow' data into our database for analysis.",
      color: "text-accent",
      bg: "bg-accent/20"
    },
    {
      title: "The Dashboard",
      icon: Activity,
      content: "The Dashboard provides a real-time, interactive visualization of your uploaded network traffic. You can see how many packets were allowed versus blocked, what applications (like TikTok or Netflix) were trying to connect, and the split between TCP and UDP protocols.",
      color: "text-primary",
      bg: "bg-primary/20"
    },
    {
      title: "Flows Log (Raw Data)",
      icon: Database,
      content: "The 'Flows Log' tab acts as a detailed ledger. It lists every single network connection found in the uploaded file, showing source and destination IP addresses, ports, application types, amount of data transferred, and whether the flow was ultimately Allowed or Blocked by your rules.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/20"
    },
    {
      title: "Custom Block Rules",
      icon: ShieldAlert,
      content: "In the 'Block Rules' tab, you can play the role of a firewall administrator. Create rules that instruct the DPI engine to actively 'drop' or 'block' specific applications (like FACEBOOK) or domains (like youtube.com). Once rules are created, re-upload your PCAP to see those connections get intercepted!",
      color: "text-danger",
      bg: "bg-danger/20"
    }
  ];

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="relative w-full max-w-lg bg-panel/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${steps[currentStep].bg}`}>
                   {(() => {
                     const Icon = steps[currentStep].icon;
                     return <Icon className={`w-5 h-5 ${steps[currentStep].color}`} />;
                   })()}
                </div>
                <h2 className="text-xl font-bold text-white">Engine Guide</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body (Fixed height so buttons don't jump around) */}
            <div className="p-8 sm:p-10 min-h-[250px] relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col h-full"
                >
                  <h3 className="text-2xl font-bold text-white mb-4">{steps[currentStep].title}</h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {steps[currentStep].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer / Controls */}
            <div className="p-6 bg-black/40 border-t border-white/5 flex items-center justify-between">
              
              {/* Progress Dots */}
              <div className="flex items-center gap-2">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep ? 'w-6 bg-primary' : 'bg-white/20'
                    }`} 
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    currentStep === 0 
                      ? 'text-gray-600 cursor-not-allowed bg-white/5' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
                
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={nextStep}
                    className="btn-primary flex items-center gap-1 px-5"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="btn-primary flex items-center gap-1 px-5 bg-accent ring-0 border-0"
                    style={{ backgroundImage: 'none' }}
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
