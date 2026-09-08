import './globals.css';

export const metadata = {
  title: 'Mema Chatbot',
  description: 'A minimalist LLM chatbot powered by OpenAI GPT-OSS through Groq.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
