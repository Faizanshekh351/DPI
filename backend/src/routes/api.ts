import { Router } from 'express';
import multer from 'multer';
import { uploadPcap, downloadPcap, getStats, getFlows, clearData, getRules, addRule, deleteRule } from '../controllers/pcapController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('pcap'), uploadPcap);
router.get('/download/:filename', downloadPcap);
router.get('/stats', getStats);
router.get('/flows', getFlows);
router.delete('/clear', clearData);

router.get('/rules', getRules);
router.post('/rules', addRule);
router.delete('/rules/:id', deleteRule);

export default router;
