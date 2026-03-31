import { Routes, Route } from 'react-router-dom';
import TopNav from './components/TopNav';
import Engine from './pages/Engine';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Guide from './pages/Guide';
import Whitepaper from './pages/Whitepaper';

export default function App() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background decorations - consistent across entire site */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Global Navigation */}
      <TopNav />

      {/* Main Page Content */}
      <main className="relative z-10 flex-1 px-6 py-12 flex flex-col items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/engine" element={<Engine />} />
          <Route path="*" element={
            <div className="flex items-center justify-center flex-1 text-gray-400 h-[60vh]">
               Page not found (404)
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}
