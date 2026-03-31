import fs from 'fs';
import Flow from '../models/Flow';
import Rule from '../models/Rule';

// Helper to format IP
const formatIp = (buffer: Buffer, offset: number) => {
    return `${buffer[offset]}.${buffer[offset + 1]}.${buffer[offset + 2]}.${buffer[offset + 3]}`;
};

// Map SNI to AppType
const sniToAppType = (sni: string): string => {
    sni = sni.toLowerCase();
    if (sni.includes('youtube') || sni.includes('googlevideo')) return 'YOUTUBE';
    if (sni.includes('facebook') || sni.includes('fbcdn')) return 'FACEBOOK';
    if (sni.includes('google')) return 'GOOGLE';
    if (sni.includes('netflix')) return 'NETFLIX';
    if (sni.includes('amazon')) return 'AMAZON';
    if (sni.includes('apple')) return 'APPLE';
    if (sni.includes('microsoft')) return 'MICROSOFT';
    if (sni.includes('whatsapp')) return 'WHATSAPP';
    if (sni.includes('instagram')) return 'INSTAGRAM';
    if (sni.includes('tiktok')) return 'TIKTOK';
    if (sni.includes('twitter') || sni.includes('x.com')) return 'TWITTER';
    return 'UNKNOWN';
};

// Extract SNI from TLS Client Hello
const extractSni = (payload: Buffer): string | null => {
    try {
        if (payload.length < 47) return null;
        if (payload[0] !== 0x16) return null; // Handshake
        if (payload[5] !== 0x01) return null; // Client Hello

        let offset = 43; // Skip random and version
        
        // Session ID
        const sessionLen = payload[offset];
        offset += 1 + sessionLen;
        
        // Cipher Suites
        const cipherLen = payload.readUInt16BE(offset);
        offset += 2 + cipherLen;

        // Compression
        const compLen = payload[offset];
        offset += 1 + compLen;

        if (offset + 2 > payload.length) return null;

        // Extensions
        const extLen = payload.readUInt16BE(offset);
        offset += 2;

        const extEnd = offset + extLen;
        while (offset + 4 <= extEnd && offset + 4 <= payload.length) {
            const extType = payload.readUInt16BE(offset);
            const extDataLen = payload.readUInt16BE(offset + 2);
            offset += 4;

            if (extType === 0x0000) { // SNI
                if (offset + 5 > payload.length) return null;
                const sniLen = payload.readUInt16BE(offset + 3);
                if (offset + 5 + sniLen > payload.length) return null;
                return payload.toString('utf8', offset + 5, offset + 5 + sniLen);
            }
            offset += extDataLen;
        }
        return null;
    } catch (e) {
        return null;
    }
};

export const parsePcap = async (filePath: string) => {
    const buffer = fs.readFileSync(filePath);
    if (buffer.length < 24) throw new Error('Invalid PCAP file: Too small');

    const magic = buffer.readUInt32BE(0);
    const isLittleEndian = magic === 0xd4c3b2a1;
    
    // Read function based on endianness
    const readUInt32 = (buf: Buffer, offset: number) => isLittleEndian ? buf.readUInt32LE(offset) : buf.readUInt32BE(offset);
    
    // Pre-fetch active rules once
    const rules = await Rule.find();
    
    // Output array to hold permitted packet bytes
    const outputChunks: Buffer[] = [];
    
    // Write 24-byte PCAP Global Header immediately
    outputChunks.push(buffer.subarray(0, 24));
    
    let offset = 24; 
    const flows: { [key: string]: any } = {};
    let droppedPackets = 0;

    while (offset < buffer.length) {
        if (offset + 16 > buffer.length) break;

        const packetStartOffset = offset;
        const inclLen = readUInt32(buffer, offset + 8);
        offset += 16; // Skip packet header

        if (offset + inclLen > buffer.length || inclLen < 14) {
            offset += inclLen;
            continue;
        }

        const packetData = buffer.subarray(offset, offset + inclLen);
        offset += inclLen; // Move offset past payload completely

        // Parse Ethernet (14 bytes)
        const etherType = packetData.readUInt16BE(12);
        if (etherType !== 0x0800) {
            outputChunks.push(buffer.subarray(packetStartOffset, offset)); // Forward non-IPv4
            continue; 
        }

        // IPv4 (min 20 bytes)
        const ipHeaderLen = (packetData[14] & 0x0F) * 4;
        if (packetData.length < 14 + ipHeaderLen) {
            outputChunks.push(buffer.subarray(packetStartOffset, offset)); // Forward malformed IP
            continue;
        }

        const protocol = packetData[23];
        const srcIp = formatIp(packetData, 26);
        const dstIp = formatIp(packetData, 30);

        if (protocol !== 6 && protocol !== 17) {
            outputChunks.push(buffer.subarray(packetStartOffset, offset)); // Forward non TCP/UDP
            continue; 
        }

        const transportOffset = 14 + ipHeaderLen;
        if (packetData.length < transportOffset + 4) {
            outputChunks.push(buffer.subarray(packetStartOffset, offset)); // Forward malformed transport
            continue;
        }

        const srcPort = packetData.readUInt16BE(transportOffset);
        const dstPort = packetData.readUInt16BE(transportOffset + 2);

        let payloadOffset = transportOffset + 8; // UDP default
        if (protocol === 6) { // TCP
            if (packetData.length < transportOffset + 14) {
                outputChunks.push(buffer.subarray(packetStartOffset, offset)); // Forward malformed TCP
                continue;
            }
            const dataOffset = (packetData[transportOffset + 12] >> 4) * 4;
            payloadOffset = transportOffset + dataOffset;
        }

        const payload = packetData.subarray(payloadOffset);
        const tupleKey = `${srcIp}:${srcPort}-${dstIp}:${dstPort}-${protocol}`;

        if (!flows[tupleKey]) {
            // Check IP match right at creation
            let isBlocked = false;
            for (const rule of rules) {
                 if (rule.type === 'IP' && (rule.value === srcIp || rule.value === dstIp)) {
                     isBlocked = true; 
                     break;
                 }
            }
            flows[tupleKey] = {
                src_ip: srcIp, dst_ip: dstIp, src_port: srcPort, dst_port: dstPort, protocol,
                packet_count: 0, byte_count: 0, app_type: 'UNKNOWN', sni: '', blocked: isBlocked
            };
        }

        const flow = flows[tupleKey];
        flow.packet_count++;
        flow.byte_count += inclLen;

        // If not yet blocked, attempt Deep Packet Inspection
        if (!flow.blocked && dstPort === 443 && payload.length > 5 && !flow.sni) {
            const sni = extractSni(payload);
            if (sni) {
                flow.sni = sni;
                flow.app_type = sniToAppType(sni);
                
                // Active rule validation the millisecond identity is discovered!
                for (const rule of rules) {
                    if (rule.type === 'APP' && rule.value === flow.app_type) { flow.blocked = true; break; }
                    if (rule.type === 'DOMAIN' && flow.sni.includes(rule.value)) { flow.blocked = true; break; }
                }
            }
        }

        // Action Engine
        if (flow.blocked) {
            droppedPackets++;
            // SILENTLY DROP: we skip pushing to the output buffer
        } else {
            // FORWARD: write packet header and raw data to output stream
            outputChunks.push(buffer.subarray(packetStartOffset, offset));
        }
    }

    console.log(`Parsed ${Object.keys(flows).length} unique flows. Dropped ${droppedPackets} packets.`);
    
    // Save Filtered PCAP
    const finalBuffer = Buffer.concat(outputChunks);
    const outFilename = `filtered_${Date.now()}.pcap`;
    fs.writeFileSync(`outputs/${outFilename}`, finalBuffer);

    // Save DB state
    const flowDocs = Object.values(flows);
    if (flowDocs.length > 0) {
        await Flow.insertMany(flowDocs);
    }
    
    return {
        flowsCount: flowDocs.length,
        droppedPackets,
        outFilename
    };
};
