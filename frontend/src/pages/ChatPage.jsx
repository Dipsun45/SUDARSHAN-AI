import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, Sparkles, MessageSquare, Menu, Plus, User as UserIcon, Mic, MicOff, Volume2, VolumeX, LogOut, Trash2, PanelLeftClose, PanelLeftOpen, Paperclip, FileText, FileArchive, Image as ImageIcon, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import SudarshanChakraCanvas from '../components/SudarshanChakraCanvas';
import SudarshanLogo from '../components/SudarshanLogo';

export default function ChatPage() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! I am **Sudarshan AI**, your divine knowledge engine. Ask any question, speak into the microphone, or click **+** to upload PDFs, Word docs, Images, or ZIP archives for analysis!' }
  ]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  // Load User & Conversations
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }

    fetchConversations(token);
  }, [navigate]);

  // Auto Scroll logic ensuring bottom content is 100% visible above input bar
  const scrollToBottom = () => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Speech Recognition Setup (Mic)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setInput(currentTranscript);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const fetchConversations = async (token) => {
    try {
      const authToken = token || localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/chat/conversations', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setConversations(res.data);
    } catch (err) {
      console.error("Fetch conversations error:", err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      setActiveConversationId(conversationId);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/chat/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.messages) {
        setMessages(res.data.messages);
      }
      scrollToBottom();
    } catch (err) {
      console.error("Load conversation error:", err);
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([
      { role: 'assistant', content: 'Namaste! I am **Sudarshan AI**. Ask me anything, speak into the microphone, or click **+** to upload documents!' }
    ]);
    setInput('');
    setSelectedFile(null);
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/chat/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (activeConversationId === conversationId) {
        handleNewChat();
      }
      fetchConversations(token);
    } catch (err) {
      console.error("Delete conversation error:", err);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser version. Please try Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSpeak = (text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const cleanText = text.replace(/[*#_`]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !selectedFile) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const currentInput = input;
    const currentFile = selectedFile;
    const userPromptDisplay = currentFile 
      ? `📎 **[File Attached: ${currentFile.name}]**\n${currentInput || 'Analyze this document.'}`
      : currentInput;

    const newMessages = [...messages, { role: 'user', content: userPromptDisplay }];
    setMessages(newMessages);
    setInput('');
    setSelectedFile(null);
    setIsTyping(true);
    scrollToBottom();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (activeConversationId) formData.append('conversationId', activeConversationId);
      if (currentInput) formData.append('content', currentInput);
      if (currentFile) formData.append('file', currentFile);

      const res = await axios.post('http://localhost:5000/api/chat', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      if (res.data) {
        if (res.data.conversationId) {
          setActiveConversationId(res.data.conversationId);
        }

        const aiResponseText = res.data.aiMessage?.content || "No response generated.";
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: aiResponseText 
        }]);

        fetchConversations(token);
      }
    } catch (err) {
      console.error("Send message error:", err);
      const serverMessage = err.response?.data?.message || "Sorry, unable to connect to backend server. Please verify your connection.";
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `⚠️ **Error**: ${serverMessage}`
      }]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive size={16} className="text-amber-400" />;
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) return <ImageIcon size={16} className="text-blue-400" />;
    return <FileText size={16} className="text-purple-400" />;
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden relative font-sans">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
        accept=".pdf,.docx,.doc,.zip,.txt,.json,.csv,.md,.png,.jpg,.jpeg,.webp"
      />

      {/* 3D Blazing Sun Sudarshan Chakra Canvas Background */}
      <SudarshanChakraCanvas opacity={0.65} speed={1.2} showChakra={true} />

      {/* Animated Collapsible Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0, x: -50 }}
            animate={{ width: 288, opacity: 1, x: 0 }}
            exit={{ width: 0, opacity: 0, x: -50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-slate-900/95 backdrop-blur-2xl border-r border-slate-800 flex flex-col z-30 overflow-hidden shadow-2xl relative"
          >
            {/* Brand Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <SudarshanLogo size="md" />
                <span className="font-black tracking-wider bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent text-lg drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                  SUDARSHAN AI
                </span>
              </Link>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSidebarOpen(false)}
                className="p-2 bg-slate-800/80 hover:bg-amber-500/20 text-slate-400 hover:text-amber-400 rounded-xl border border-slate-700/80 hover:border-amber-400/50 shadow-md transition"
                title="Hide Sidebar"
              >
                <PanelLeftClose size={18} />
              </motion.button>
            </div>

            {/* New Chat Button */}
            <div className="p-4">
              <button 
                onClick={handleNewChat}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-600 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all transform hover:scale-[1.02]"
              >
                <Plus size={20} /> New Chat
              </button>
            </div>

            {/* Conversations Sidebar List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <p className="text-xs text-amber-400/80 font-bold mb-3 uppercase tracking-wider px-2">Your Conversations</p>
              
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No previous chats found.<br />Start a new conversation!
                </div>
              ) : (
                conversations.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => loadConversation(c._id)}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm transition-all ${activeConversationId === c._id ? 'bg-amber-500/20 border border-amber-500/50 text-white font-semibold shadow-lg shadow-amber-500/10' : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'}`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <MessageSquare size={16} className={activeConversationId === c._id ? 'text-amber-400' : 'text-slate-400'} />
                      <span className="truncate">{c.title || 'Conversation'}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(e, c._id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition"
                      title="Delete Chat"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* User Account & Logout */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <div className="flex items-center gap-3 truncate">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg border border-amber-400/50">
                  {user?.firstName ? user.firstName[0].toUpperCase() : <UserIcon size={18} />}
                </div>
                <div className="truncate">
                  <p className="text-sm font-bold text-white truncate">{user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User Account'}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email || 'Logged in'}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Floating Control Bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/70 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <motion.button
                initial={{ scale: 0, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 90 }}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 bg-gradient-to-tr from-slate-900 to-slate-800 border border-amber-500/40 hover:border-amber-400 rounded-2xl text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center"
                title="Open Sidebar"
              >
                <PanelLeftOpen size={20} className="filter drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
              </motion.button>
            )}
            <div className="flex items-center gap-2.5">
              <SudarshanLogo size="sm" />
              <span className="font-extrabold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent text-base md:text-lg">
                SUDARSHAN AI
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleNewChat}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white font-bold text-xs rounded-xl transition shadow-md"
            >
              <Plus size={16} /> New Chat
            </button>
          </div>
        </div>

        {/* Messages List Container */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-48 custom-scrollbar"
        >
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[92%] md:max-w-[78%] p-5 rounded-2xl shadow-2xl transition-all ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-br-none border border-blue-400/40 shadow-blue-500/10'
                      : 'bg-slate-900/95 text-slate-100 rounded-bl-none border border-amber-500/30 backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className="absolute top-3 right-3 p-2 text-slate-400 hover:text-amber-400 bg-slate-800/80 rounded-xl transition shadow-md"
                      title="Read Answer Aloud"
                    >
                      {isSpeaking ? <VolumeX size={16} className="text-amber-400 animate-pulse" /> : <Volume2 size={16} />}
                    </button>
                  )}

                  {msg.role === 'assistant' ? (
                    <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed pr-6">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm md:text-base font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-slate-900/95 border border-amber-500/40 backdrop-blur-xl p-4 rounded-2xl rounded-bl-none flex items-center gap-3 shadow-lg shadow-amber-500/10">
                <SudarshanLogo size="sm" />
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-bounce"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-xs text-amber-400/90 font-semibold ml-2">Sudarshan AI analyzing query & documents...</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>

        {/* Input Control Bar Fixed at Bottom */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent z-20">
          <div className="max-w-4xl mx-auto relative flex flex-col gap-2">
            
            {/* Selected File Badge Preview */}
            <AnimatePresence>
              {selectedFile && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="self-start flex items-center gap-2 bg-slate-900/95 border border-amber-500/60 px-3.5 py-2 rounded-xl text-xs text-amber-300 backdrop-blur-md shadow-xl"
                >
                  {getFileIcon(selectedFile.name)}
                  <span className="font-bold truncate max-w-[250px]">{selectedFile.name}</span>
                  <span className="text-slate-400 text-[10px]">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="p-1 hover:text-red-400 transition"
                    title="Remove File"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative flex items-center">
              {/* Ultra-Attractive Glowing + Add Document Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute left-3 z-30 p-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.7)] transition-all flex items-center justify-center cursor-pointer border border-amber-300"
                title="Click + to Upload PDF, Word, Images, ZIP files"
              >
                <Plus size={20} className="stroke-[3] drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]" />
              </motion.button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "🎙️ Listening to your speech... Speak now!" : "Ask Sudarshan AI anything, click + to attach files (PDF, Word, Zip, Images)..."}
                className={`w-full bg-slate-900/95 backdrop-blur-2xl border ${isListening ? 'border-amber-400 ring-2 ring-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50'} rounded-2xl pl-16 pr-28 py-4 text-white placeholder-slate-400 resize-none h-[64px] max-h-[180px] shadow-2xl focus:outline-none transition-all text-sm md:text-base`}
                rows={1}
              />

              <div className="absolute right-3 top-3 flex items-center gap-2">
                {/* Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all shadow-lg ${
                    isListening
                      ? 'bg-red-500 text-white animate-pulse shadow-red-500/50 ring-2 ring-red-400'
                      : 'bg-slate-800 text-slate-300 hover:text-amber-400 hover:bg-slate-700'
                  }`}
                  title={isListening ? "Stop listening" : "Click to speak"}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!input.trim() && !selectedFile}
                  className="p-3 bg-gradient-to-r from-amber-500 via-orange-500 to-blue-600 rounded-xl text-white disabled:opacity-40 hover:from-amber-600 hover:to-blue-700 transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
                  title="Send Message"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2 font-semibold">Sudarshan AI Knowledge Engine • Real-time Speech, Document & ZIP Analysis</p>
        </div>
      </div>
    </div>
  );
}
