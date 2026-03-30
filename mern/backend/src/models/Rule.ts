import mongoose from 'mongoose';

const ruleSchema = new mongoose.Schema({
  type: { type: String, enum: ['IP', 'APP', 'DOMAIN'], required: true },
  value: { type: String, required: true },
  description: String
}, { timestamps: true });

const Rule = mongoose.model('Rule', ruleSchema);

// Insert default block rules from the C++ project if they don't exist
export const seedDefaultRules = async () => {
    const rulesConfig = [
        { type: 'IP', value: '198.51.100.1', description: 'Malicious IP' },
        { type: 'APP', value: 'FACEBOOK', description: 'Block Social Media' },
        { type: 'DOMAIN', value: 'tiktok.com', description: 'Block Video App' }
    ];

    for (const r of rulesConfig) {
        const exists = await Rule.findOne({ type: r.type, value: r.value });
        if (!exists) await Rule.create(r);
    }
};

export default Rule;
