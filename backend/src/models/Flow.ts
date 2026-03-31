import mongoose from 'mongoose';

const flowSchema = new mongoose.Schema({
  src_ip: String,
  dst_ip: String,
  src_port: Number,
  dst_port: Number,
  protocol: Number,
  app_type: String,
  sni: String,
  packet_count: { type: Number, default: 0 },
  byte_count: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false }
}, { timestamps: true });

// Create compound index for 5-tuple
flowSchema.index({ src_ip: 1, dst_ip: 1, src_port: 1, dst_port: 1, protocol: 1 });

const Flow = mongoose.model('Flow', flowSchema);
export default Flow;
