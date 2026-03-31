import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/client';
import type { AxiosError } from 'axios';

export default function UploadPcap({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [droppedStats, setDroppedStats] = useState<{ flows: number, dropped: number } | null>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
      setDroppedStats(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setDownloadUrl(null);
      setDroppedStats(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus('uploading');
    setMessage('Parsing packets and running DPI rules...');

    const formData = new FormData();
    formData.append('pcap', file);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setDownloadUrl(res.data.downloadUrl);
      setDroppedStats({ flows: res.data.flowsCount, dropped: res.data.droppedPackets });
      setStatus('success');
      // No automatic timeout anymore; let the user download the file!
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setStatus('error');
      setMessage(axiosErr.response?.data?.message ?? axiosErr.message ?? 'Failed to process file');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Deep Packet Inspection</h2>
        <p className="text-gray-400">Upload a Wireshark PCAP file to analyze app traffic and test blocking rules.</p>
      </div>

      <motion.div
        className={`w-full p-12 border-2 border-dashed rounded-3xl transition-all relative overflow-hidden flex flex-col items-center justify-center gap-4 ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/40'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {!file && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 flex items-center justify-center pointer-events-none shadow-[0_0_30px_rgba(79,70,229,0.3)]">
                <UploadCloud className="w-10 h-10 text-primary" />
              </div>
              <p className="text-lg font-medium text-gray-300 pointer-events-none">Drag & drop your PCAP file here</p>
              <p className="text-sm text-gray-500 pointer-events-none">or click to browse</p>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pcap"
                onChange={handleFileChange}
              />
            </motion.div>
          )}

          {file && status === 'idle' && (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6 w-full"
            >
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-lg">
                <File className="w-10 h-10 text-secondary" />
              </div>
              <div className="text-center">
                <p className="text-xl font-medium text-white max-w-[200px] truncate">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setFile(null)} 
                  className="px-6 py-2 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button onClick={handleUpload} className="btn-primary flex items-center gap-2">
                  Analyze Packet Log
                </button>
              </div>
            </motion.div>
          )}

          {status === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="text-lg font-medium text-primary animate-pulse">{message}</p>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4 w-full max-w-md"
            >
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-accent" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-xl font-bold text-accent">Analysis Complete!</p>
                {droppedStats && (
                  <div className="text-gray-300 mt-2 bg-black/30 p-4 rounded-xl border border-white/5 space-y-1">
                    <p>Processed <strong>{droppedStats.flows}</strong> unique flows</p>
                    <p className="text-danger">Dropped <strong>{droppedStats.dropped}</strong> blocked packets</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-3 mt-4 w-full px-6">
                {downloadUrl && (
                  <a href={`http://localhost:5000${downloadUrl}`} download className="w-full">
                    <button className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] transition-all flex justify-center items-center gap-2 border-0">
                      Download Filtered PCAP
                    </button>
                  </a>
                )}
                
                <button 
                  onClick={() => {
                    setFile(null);
                    setDownloadUrl(null);
                    setStatus('idle');
                    onUploadComplete();
                  }}
                  className="w-full py-3 rounded-xl font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/10"
                >
                  Continue to Dashboard
                </button>
              </div>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-danger/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-danger" />
              </div>
              <p className="text-lg font-medium text-danger">{message}</p>
              <button onClick={() => setStatus('idle')} className="mt-2 text-sm text-gray-400 hover:text-white underline">
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
