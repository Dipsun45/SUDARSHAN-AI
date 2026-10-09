import express from 'express';
import multer from 'multer';
import { sendMessage, getConversations, getConversationById, deleteConversation, searchConversations } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit for unlimited documents & zip archives
});

router.use(protect);

router.post('/', upload.single('file'), sendMessage);
router.get('/search', searchConversations);
router.get('/conversations', getConversations);
router.get('/conversations/:id', getConversationById);
router.delete('/conversations/:id', deleteConversation);

export default router;
