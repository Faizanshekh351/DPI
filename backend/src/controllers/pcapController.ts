import { Request, Response } from 'express';
import { parsePcap } from '../services/pcapParser';
import Flow from '../models/Flow';
import Rule from '../models/Rule';
import fs from 'fs';

import path from 'path';

export const uploadPcap = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const filePath = req.file.path;
        console.log(`Processing file: ${filePath}`);

        const result = await parsePcap(filePath);

        // Clean up raw uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({ 
            message: 'File processed successfully', 
            flowsCount: result.flowsCount,
            droppedPackets: result.droppedPackets,
            downloadUrl: `/api/download/${result.outFilename}`
        });
    } catch (error: any) {
        console.error('Error processing PCAP:', error);
        res.status(500).json({ message: 'Error processing PCAP file', error: error.message });
    }
};

export const downloadPcap = (req: Request, res: Response) => {
    try {
        const filename = req.params.filename as string;
        // Basic security against path traversal
        if (filename.includes('..') || filename.includes('/')) {
             res.status(403).json({ message: 'Invalid filename' });
             return;
        }
        
        const file = path.resolve(process.cwd(), 'outputs', filename);
        if (!fs.existsSync(file)) {
             res.status(404).json({ message: 'Filtered PCAP not found' });
             return;
        }

        res.download(file, filename);
    } catch (error: any) {
         res.status(500).json({ message: 'Error downloading file', error: error.message });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalFlows = await Flow.countDocuments();
        const blockedFlows = await Flow.countDocuments({ blocked: true });
        const appsStats = await Flow.aggregate([
            { $group: { _id: '$app_type', count: { $sum: 1 }, bytes: { $sum: '$byte_count' } } },
            { $sort: { count: -1 } }
        ]);

        const protoStats = await Flow.aggregate([
            { $group: { _id: '$protocol', count: { $sum: 1 } } }
        ]);

        res.status(200).json({ totalFlows, blockedFlows, appsStats, protoStats });
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

export const getFlows = async (req: Request, res: Response) => {
    try {
        const flows = await Flow.find().sort({ createdAt: -1 }).limit(100);
        res.status(200).json(flows);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching flows', error: error.message });
    }
};

export const clearData = async (req: Request, res: Response) => {
    try {
        await Flow.deleteMany({});
        res.status(200).json({ message: 'Data cleared' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error clearing data', error: error.message });
    }
};

export const getRules = async (req: Request, res: Response) => {
    try {
        const rules = await Rule.find();
        res.status(200).json(rules);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching rules', error: error.message });
    }
};

export const addRule = async (req: Request, res: Response) => {
    try {
        const { type, value, description } = req.body;
        const rule = await Rule.create({ type, value, description });
        
        // Retrospectively block existing flows? (Optional, skipped for simplicity)
        res.status(201).json(rule);
    } catch (error: any) {
        res.status(500).json({ message: 'Error adding rule', error: error.message });
    }
};

export const deleteRule = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Rule.findByIdAndDelete(id);
        res.status(200).json({ message: 'Rule deleted' });
    } catch (error: any) {
        res.status(500).json({ message: 'Error deleting rule', error: error.message });
    }
};
