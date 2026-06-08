# BotStudio AI

A Next.js app for building and testing custom AI chatbots powered by OpenAI. Configure your bot's persona, tone, and behavior — then chat with it live in the browser.

## Features

- **Bot Configuration Panel** — set your bot's name, role, tone, welcome message, and more
- **Preset Templates** — quickly load pre-built bot configs (IT support, customer service, etc.)
- **Live Chat** — test your bot in real time with a clean chat interface
- **Share** — copy a shareable link to your bot demo

## Tech Stack

- [Next.js 16](https://nextjs.org/) — React framework
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [OpenAI API](https://platform.openai.com/) — GPT-4o chat completions
- TypeScript

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/malaksayed22/BotstudioAi.git
cd BotstudioAi
```

1. **Install dependencies**

```bash
npm install
```

1. **Add your OpenAI API key**

Create a `.env.local` file in the root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

1. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
app/          → Next.js app router pages
components/   → BotStudio, ChatPanel, ConfigPanel, Navbar
lib/          → presets and prompt builder
types/        → shared TypeScript types
```

## License

MIT
