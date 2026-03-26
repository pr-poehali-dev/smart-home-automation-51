import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const GIGACHAT_URL = "https://functions.poehali.dev/f0fc879c-86f5-41ce-9111-5ae39ecc4300"

interface Message {
  role: "user" | "assistant"
  text: string
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Привет! Я NeyroMAX на базе GigaChat. Задайте вопрос или попросите написать код — отвечу мгновенно." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: "user", text: trimmed }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const apiMessages = newMessages.map(m => ({
      role: m.role,
      content: m.text,
    }))

    const resp = await fetch(GIGACHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    })
    const data = await resp.json()
    const reply = data.reply || "Не удалось получить ответ. Попробуйте ещё раз."
    setMessages(prev => [...prev, { role: "assistant", text: reply }])
    setLoading(false)
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
        <span className="text-[#00F5FF] text-sm font-medium">NeyroMAX · GigaChat · онлайн</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
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
              NeyroMAX думает...
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
          disabled={loading}
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
