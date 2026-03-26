import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

interface Message {
  role: "user" | "ai"
  text: string
}

const RESPONSES: Record<string, string> = {
  default: "Привет! Я NeyroMAX — ваш AI-ассистент. Задайте любой вопрос или попросите написать код.",
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes("привет") || lower.includes("hello") || lower.includes("hi")) {
    return "Привет! 👋 Чем могу помочь? Я умею отвечать на вопросы и писать код."
  }
  if (lower.includes("код") || lower.includes("code") || lower.includes("функци") || lower.includes("напиши")) {
    const lang = lower.includes("python") ? "python" : lower.includes("java") ? "java" : "typescript"
    return `Вот пример на ${lang}:\n\`\`\`${lang}\nfunction hello(name: string): string {\n  return \`Привет, \${name}!\`\n}\n\nconsole.log(hello("Мир"))\n\`\`\``
  }
  if (lower.includes("что ты") || lower.includes("кто ты") || lower.includes("что умеешь")) {
    return "Я NeyroMAX — AI-ассистент нового поколения. Помогаю отвечать на вопросы, генерировать код, объяснять сложные темы и многое другое!"
  }
  if (lower.includes("помощь") || lower.includes("help")) {
    return "Я могу:\n• Отвечать на любые вопросы\n• Писать код на любом языке\n• Объяснять сложные концепции\n• Помогать с анализом данных\n\nПросто напишите, что вам нужно!"
  }
  if (lower.includes("погод")) {
    return "Я языковая модель и не имею доступа к реальным данным о погоде, но могу помочь с другими задачами!"
  }
  const answers = [
    "Отличный вопрос! NeyroMAX обрабатывает его и даёт точный ответ на основе обученных данных.",
    "Понял вас! Это интересная задача. В реальном режиме я использую мощные языковые модели для глубокого анализа.",
    "Готов помочь! Подключите полноценный API-ключ, и я отвечу развёрнуто и точно.",
    "Хороший вопрос. NeyroMAX специализируется именно на таких задачах — текст, код, анализ.",
  ]
  return answers[Math.floor(Math.random() * answers.length)]
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Привет! Я NeyroMAX. Задайте вопрос или попросите написать код — отвечу мгновенно." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return
    setMessages(prev => [...prev, { role: "user", text: trimmed }])
    setInput("")
    setLoading(true)
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: getAIResponse(trimmed) }])
      setLoading(false)
    }, 800)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="w-full max-w-2xl mt-8 rounded-2xl border border-[#00F5FF]/30 bg-black/60 backdrop-blur-sm overflow-hidden flex flex-col" style={{ height: "360px" }}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#00F5FF]/20">
        <div className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse" />
        <span className="text-[#00F5FF] text-sm font-medium">NeyroMAX · онлайн</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#00F5FF] text-black"
                  : "bg-white/10 text-white border border-white/10"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm text-white/50">
              NeyroMAX печатает...
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="px-4 py-3 border-t border-[#00F5FF]/20 flex gap-2">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[#00F5FF]/50 transition-colors"
          placeholder="Напишите сообщение или попросите написать код..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="w-9 h-9 rounded-xl bg-[#00F5FF] text-black flex items-center justify-center disabled:opacity-40 hover:bg-[#00F5FF]/80 transition-colors flex-shrink-0"
        >
          <Icon name="Send" size={16} />
        </button>
      </div>
    </div>
  )
}
