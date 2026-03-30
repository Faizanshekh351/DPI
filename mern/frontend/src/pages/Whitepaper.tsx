import { motion } from 'framer-motion';

export default function Whitepaper() {
  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      variants={containerVars} initial="hidden" animate="show"
      className="max-w-4xl mx-auto w-full py-10"
    >
      <article className="glass-panel p-8 md:p-12 rounded-3xl prose prose-invert prose-lg max-w-none">
        
        <h1 className="text-4xl md:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-12">
          Project Whitepaper: <br /> Deep Packet Inspection Architecture
        </h1>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 mb-4">1. Abstract</h2>
          <p className="text-gray-300">
            Network visibility is increasingly obscured by pervasive TLS encryption. Traditional firewalls and Layer 4 packet analyzers that rely solely on Port and IP addressing are no longer sufficient to identify the actual application (e.g., Netflix vs. Google Workspace) generating the traffic. This project details a lightweight, custom-built Deep Packet Inspection (DPI) engine capable of parsing raw PCAP binary files, traversing the OSI model layers up to Layer 7, and extracting the <strong>Server Name Indication (SNI)</strong> from TLS Client Hello handshakes to accurately fingerprint modern web applications.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 mb-4">2. Technical Architecture</h2>
          <p className="text-gray-300">
            The platform is constructed utilizing a MERN stack (MongoDB, Express.js, React, Node.js) paired with TypeScript for rigorous type safety.
          </p>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li><strong className="text-primary">Frontend:</strong> Built with React 19 and Vite. Navigation is handled by React Router, and the UI is styled via Tailwind CSS v4 alongside Framer Motion for fluidity.</li>
            <li><strong className="text-secondary">Backend API:</strong> Built on Express.js. Processing raw `.pcap` files is an intensive task. Instead of executing an external shell layer like `tcpdump`, the backend implements a bespoke binary parser using native Node.js Buffer manipulation.</li>
            <li><strong className="text-accent">Persistence:</strong> MongoDB manages the state of "Flows" (the 5-tuple tracking of Source IP, Dest IP, Source Port, Dest Port, and Protocol) over time, and stores the user-defined filtering rules.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 mb-4">3. Deep Packet Inspection Methodology</h2>
          <p className="text-gray-300 mb-4">
            The core feature of this engine is the `pcapParser.ts` service. When a Wireshark capture file is uploaded:
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-3">
            <li><strong>Global Header Validation:</strong> The engine reads the first 24 bytes to confirm the magic number (`0xd4c3b2a1` or `0xa1b2c3d4`), determining the file's endianness.</li>
            <li><strong>Ethernet & IPv4 Stripping:</strong> It steps over the 14-byte Ethernet frame, verifies IPv4 (`0x0800`), and determines the IP header length.</li>
            <li><strong>Transport Layer Resolution:</strong> Depending on precisely whether the protocol is 6 (TCP) or 17 (UDP), the engine calculates where the dynamic packet payload begins.</li>
            <li><strong>TLS SNI Extraction:</strong> If the destination port is 443 (HTTPS) and the payload begins with `0x16 0x03 0x01` (TLS Handshake, Client Hello), the parser sequentially leaps across the cipher suites, compression methods, and extensions bounds until it locates Extension Type `0x0000` (Server Name). The raw bytes of the domain name are then parsed into a UTF-8 string.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 mb-4">4. Limitations & Conclusion</h2>
          <p className="text-gray-300">
            While highly successful as a demonstration of protocol analysis, this Node.js implementation has bottlenecks if exposed to live gigabit network interfaces. Buffer manipulation in Javascript is memory intensive. In a production enterprise setting, this logic would typically be deployed in C, Rust, or eBPF running directly in the kernel space. 
          </p>
          <p className="text-gray-300 mt-4">
            However, as an educational portfolio piece bridging the gap between low-level network engineering and high-level web visualization, this DPI Engine successfully proves that complex cybersecurity heuristics can be made accessible and visually intuitive.
          </p>
        </section>

      </article>
    </motion.div>
  );
}
