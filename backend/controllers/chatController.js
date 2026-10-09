import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { GoogleGenAI } from '@google/genai';
import { parseFileContent } from '../utils/fileParser.js';

const generateAIResponse = async (messages, prompt, fileParsedObj = null) => {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || apiKey === 'your_ai_api_key_here') {
    throw new Error("Missing Gemini API Key. Please add your key to AI_API_KEY in backend/.env.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // Format previous messages for Gemini context
  let history = '';
  if (messages && messages.length > 0) {
    history = "Previous conversation context:\n";
    messages.forEach(m => {
      history += `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}\n`;
    });
    history += "\nNow, please analyze and answer the user query based on all previous context and any attached documents/images.\nNew Query: ";
  }

  const fullPromptText = history + prompt;

  // Prepare multimodal contents payload (supports text + images)
  let contentsPayload = fullPromptText;
  if (fileParsedObj && fileParsedObj.isImage && fileParsedObj.base64) {
    contentsPayload = [
      fullPromptText,
      {
        inlineData: {
          mimeType: fileParsedObj.mimeType || 'image/jpeg',
          data: fileParsedObj.base64
        }
      }
    ];
  }

  const candidateModels = [
    process.env.AI_MODEL || 'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-3.1-flash-lite',
    'gemini-flash-lite-latest',
    'gemini-3.8-flash'
  ];

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contentsPayload,
        config: {
          systemInstruction: "You are Sudarshan AI, an expert, highly accurate divine knowledge assistant inspired by Lord Sri Krishna's Sudarshan Chakra. You possess high-precision document and image analysis capabilities. When presented with PDFs, Word documents, Zip archives, text files, code, or images, thoroughly analyze all attached details, cite specific sections/files when answering, and deliver clear, structured, and helpful responses in Markdown format."
        }
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`Model ${modelName} failed:`, err.message || err);
      lastError = err;
    }
  }

  throw new Error("Failed to generate AI response: " + (lastError?.message || "All AI models unavailable."));
};

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    let conversation;
    let fileParsedObj = null;

    if (req.file) {
      fileParsedObj = await parseFileContent(req.file);
    }

    const documentText = fileParsedObj?.text || '';
    const messageContent = (content || '') + (documentText ? `\n${documentText}` : '');
    const displayContent = req.file ? `📎 **[File Attached: ${req.file.originalname}]**\n${content || ''}` : messageContent;

    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId: req.user._id });
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      // First message, generate title
      const titlePrompt = req.file ? `Document: ${req.file.originalname}` : content;
      const title = titlePrompt.length > 30 ? titlePrompt.substring(0, 30) + '...' : titlePrompt;
      conversation = await Conversation.create({
        userId: req.user._id,
        title: title,
        messageCount: 0
      });
    }

    // Save user message in Mongoose database
    const userMessage = await Message.create({
      conversationId: conversation._id,
      userId: req.user._id,
      role: 'user',
      content: displayContent
    });

    conversation.messageCount += 1;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    // Fetch previous messages for conversation memory
    const previousMessages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });

    // Call Gemini AI API with parsed document / multimodal image payload
    const aiResponseContent = await generateAIResponse(previousMessages, messageContent, fileParsedObj);

    // Save AI response
    const aiMessage = await Message.create({
      conversationId: conversation._id,
      userId: req.user._id,
      role: 'assistant',
      content: aiResponseContent
    });

    conversation.messageCount += 1;
    conversation.lastMessageAt = Date.now();
    await conversation.save();

    res.json({
      conversationId: conversation._id,
      userMessage,
      aiMessage
    });

  } catch (error) {
    console.error("Chat Controller Error:", error);
    res.status(500).json({ message: error.message || 'Error processing message' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id }).sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
    res.json({ conversation, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching conversation' });
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ _id: req.params.id, userId: req.user._id });
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

    await Message.deleteMany({ conversationId: conversation._id });
    await conversation.deleteOne();

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
};

export const searchConversations = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const conversations = await Conversation.find({ 
            userId: req.user._id,
            title: { $regex: query, $options: 'i' }
        });

        res.json(conversations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching conversations' });
    }
};
