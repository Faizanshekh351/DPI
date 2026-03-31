import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldPlus, Trash2, StopCircle } from 'lucide-react';
import { api } from '../api/client';

interface Rule {
  _id: string;
  type: 'IP' | 'APP' | 'DOMAIN';
  value: string;
  description?: string;
}

export default function RulesManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState(true);

  // New Rule State
  const [type, setType] = useState('DOMAIN');
  const [value, setValue] = useState('');
  const [desc, setDesc] = useState('');

  const fetchRules = async () => {
    try {
      const res = await api.get('/rules');
      setRules(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    try {
      await api.post('/rules', { type, value, description: desc });
      setValue('');
      setDesc('');
      fetchRules();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/rules/${id}`);
      fetchRules();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 pt-2 pb-6 max-w-5xl mx-auto w-full">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <StopCircle className="w-6 h-6 text-danger" /> DPI Blocking Rules
        </h2>
        <p className="text-sm text-gray-400 mt-1">Configure criteria to drop incoming matching packets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Rule Form */}
        <div className="col-span-1 glass-panel p-6 h-max">
          <h3 className="text-lg font-medium text-white mb-4">Add New Rule</h3>
          <form onSubmit={handleAdd} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Rule Type</label>
              <select 
                className="input-field appearance-none" 
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="DOMAIN">SNI Domain</option>
                <option value="APP">App Type</option>
                <option value="IP">Source IP</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Match Value</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder={type === 'DOMAIN' ? 'e.g., youtube.com' : type === 'IP' ? '192.168.1.1' : 'FACEBOOK'}
                value={value}
                onChange={e => setValue(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">Description (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Reason for blocking..."
                value={desc}
                onChange={e => setDesc(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary mt-2 flex items-center justify-center gap-2">
              <ShieldPlus className="w-4 h-4" /> Create Rule
            </button>
          </form>
        </div>

        {/* Existing Rules List */}
        <div className="col-span-2 glass-panel p-6">
          <h3 className="text-lg font-medium text-white mb-4">Active Rules</h3>
          
          <div className="flex flex-col gap-3">
            {loading ? (
              <p className="text-gray-500 text-center py-8">Loading rules...</p>
            ) : rules.length === 0 ? (
              <div className="text-center py-12 border border-white/5 rounded-xl bg-black/20">
                <p className="text-gray-500">No active blocking rules.</p>
              </div>
            ) : (
              <AnimatePresence>
                {rules.map((rule, idx) => (
                  <motion.div 
                    key={rule._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-danger/20 bg-gradient-to-r from-danger/5 to-transparent hover:border-danger/40 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 px-2 py-1 rounded text-xs font-bold bg-danger/20 text-danger border border-danger/30 w-16 text-center">
                        {rule.type}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-white">{rule.value}</p>
                        <p className="text-sm text-gray-400">{rule.description || 'No description provided'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(rule._id)}
                      className="p-2 text-gray-500 hover:text-danger hover:bg-danger/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Remove Rule"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
