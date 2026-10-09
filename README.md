# SUDARSHAN AI
**"Knowledge Without Limits."**

Sudarshan AI is an intelligent AI companion designed to help you understand ideas, solve problems, learn faster and explore knowledge in your own language. Inspired by the Sudarshan Chakra, it provides a premium, futuristic, and fast interface to an advanced AI backend.

## 🚀 Features
- **ChatGPT-like Interface:** Responsive chat UI with markdown support and syntax highlighting.
- **Multilingual Support:** Ask and receive answers in multiple languages.
- **Secure Authentication:** JWT-based user authentication and bcrypt password hashing.
- **Chat History:** Save, search, and manage your conversation history.
- **Dark/Light Mode:** Premium theme system.
- **AI Integration ready:** Configurable for different AI providers (e.g., Gemini, OpenAI, Claude).

## 🛠️ Technology Stack
- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Framer Motion, Lucide React, Three.js
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs

## 📦 Installation

### 1. Backend Setup
1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your values (like `MONGO_URI` and `AI_API_KEY`).
   ```bash
   MONGO_URI=mongodb://localhost:27017/sudarshan_ai
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 🔒 Security Notes
- `AI_API_KEY` is completely isolated in the backend.
- Passwords are encrypted before storage.
- Rate limiting and Helmet headers are enabled on the backend.
