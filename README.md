# Mema Chatbot

A minimalist, light-theme LLM chatbot built with Next.js and deployed on Vercel.

## What it uses

- **Frontend:** Next.js + React
- **LLM:** OpenAI GPT-OSS 20B (`openai/gpt-oss-20b`)
- **API provider:** Groq's OpenAI-compatible API
- **Secret:** `GROQ_API_KEY` stored only on the server / Vercel environment variables
- **Persistence:** Browser `localStorage` for chat history
- **Deployment:** Vercel

> Important: this project uses an OpenAI GPT-OSS model served by Groq. The API key is a Groq key. This is different from using the paid OpenAI API directly.

## Features

- Light, minimalist, responsive interface
- Mema Chatbot branding
- Multiple chats
- Persistent chat history in the browser
- Delete any chat
- New chat button
- Conversation context is sent to the model
- Friendly API error handling
- Mobile sidebar
- API key is never exposed to client-side code

## Local setup

1. Install Node.js 18.18+ (Node 20+ recommended).
2. Copy `.env.example` to `.env.local`.
3. Put your Groq API key in `.env.local`:

```env
GROQ_API_KEY=your_real_groq_key
```

4. Install packages:

```bash
npm install
```

5. Start the development server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

Never commit `.env.local` or a real API key.

## GitHub

Create an empty GitHub repository, then from this project folder run:

```bash
git init
git add .
git commit -m "Build Mema Chatbot"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Do not create or commit a real `.env.local` file.

## Vercel

1. Import the GitHub repository into Vercel.
2. In the Vercel project, open **Settings → Environment Variables**.
3. Add:

```text
Name: GROQ_API_KEY
Value: your_real_groq_key
```

4. Enable it for the environments you need (Production, Preview, and/or Development).
5. Deploy/redeploy.
6. Open the generated Vercel URL and test a message.

## Assignment alignment

The assignment asks for a Groq API integration, a server-side API route, secure environment-variable handling, GitHub, Vercel, a README, and a live public URL. Mema implements those requirements and adds persistent browser chat history and chat deletion.

## Security note

The browser calls `/api/chat`; it does **not** receive the Groq API key. The server-side route reads `process.env.GROQ_API_KEY` and calls Groq. The `.gitignore` file excludes local environment files.
