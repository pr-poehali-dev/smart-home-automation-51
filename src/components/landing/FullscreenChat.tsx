import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

const GIGACHAT_URL = "https://functions.poehali.dev/f0fc879c-86f5-41ce-9111-5ae39ecc4300"

interface Message {
  role: "user" | "assistant"
  text: string
}

interface FullscreenChatProps {
  open: boolean
  onClose: () => void
}

export default function FullscreenChat({ open, onClose }: FullscreenChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Привет! Я NeyroMAX. Задайте любой вопрос или попросите написать код — отвечу мгновенно." }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: "user", text: trimmed }]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const apiMessages = newMessages.map(m => ({ role: m.role, content: m.text }))

    const resp = await fetch(GIGACHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: apiMessages }),
    })
    const data = await resp.json()
    setMessages(prev => [...prev, { role: "assistant", text: data.reply || "Не удалось получить ответ. Попробуйте ещё раз." }])
    setLoading(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.25 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#00F5FF]/20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#00F5FF] animate-pulse" />
              <span className="text-[#00F5FF] font-semibold text-lg">NeyroMAX</span>
              <span className="text-white/30 text-sm">· онлайн</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4 max-w-4xl w-full mx-auto">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0 mr-3 mt-1">
                    <Icon name="Sparkles" size={14} className="text-[#00F5FF]" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#00F5FF] text-black font-medium"
                      : "bg-white/5 text-white border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center flex-shrink-0">
                  <Icon name="Sparkles" size={14} className="text-[#00F5FF]" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF]/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 md:px-8 pt-4 pb-2 border-t border-white/10 flex-shrink-0">
            <div className="max-w-4xl mx-auto flex gap-3 items-end">
              <textarea
                ref={inputRef}
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#00F5FF]/50 transition-colors resize-none"
                placeholder="Напишите сообщение... (Enter — отправить, Shift+Enter — новая строка)"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                style={{ maxHeight: "160px" }}
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="w-11 h-11 rounded-2xl bg-[#00F5FF] text-black flex items-center justify-center disabled:opacity-40 hover:bg-[#00F5FF]/80 transition-colors flex-shrink-0"
              >
                <Icon name="Send" size={18} />
              </button>
            </div>
            <div className="max-w-4xl mx-auto text-center mt-2 pb-1">
              <span className="text-white/10 text-2xl font-bold tracking-[0.3em] uppercase select-none">NEYROMAX</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}