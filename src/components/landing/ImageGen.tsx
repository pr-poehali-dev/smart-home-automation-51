import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

interface ImageGenProps {
  open: boolean
  onClose: () => void
}

export default function ImageGen({ open, onClose }: ImageGenProps) {
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generate = async () => {
    const trimmed = prompt.trim()
    if (!trimmed || loading) return

    setLoading(true)
    setError(null)
    setImageUrl(null)

    const encoded = encodeURIComponent(trimmed)
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${Date.now()}`

    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error("Ошибка генерации")
      const blob = await res.blob()
      const objectUrl = URL.createObjectURL(blob)
      setImageUrl(objectUrl)
    } catch {
      setError("Не удалось сгенерировать изображение. Попробуйте ещё раз.")
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      generate()
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return
    const a = document.createElement("a")
    a.href = imageUrl
    a.download = "neyromax-image.png"
    a.click()
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
              <span className="text-[#00F5FF] font-semibold text-lg">NeyroMAX Изображения</span>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors"
            >
              <Icon name="X" size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-4 md:px-8 py-8">
            <div className="w-full max-w-2xl flex flex-col items-center gap-6">
              {!imageUrl && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full aspect-square max-w-md rounded-2xl border border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 text-white/20"
                >
                  <Icon name="ImageIcon" size={64} />
                  <span className="text-sm">Введите описание — получите изображение</span>
                </motion.div>
              )}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full aspect-square max-w-md rounded-2xl border border-[#00F5FF]/20 bg-white/5 flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-[#00F5FF]/30 border-t-[#00F5FF] animate-spin" />
                  <span className="text-white/40 text-sm">Генерирую изображение...</span>
                </motion.div>
              )}

              {imageUrl && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-md flex flex-col gap-3"
                >
                  <img
                    src={imageUrl}
                    alt="Сгенерированное изображение"
                    className="w-full rounded-2xl border border-white/10"
                  />
                  <button
                    onClick={handleDownload}
                    className="w-full py-2.5 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <Icon name="Download" size={16} />
                    Скачать
                  </button>
                </motion.div>
              )}

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 md:px-8 pt-4 pb-2 border-t border-white/10 flex-shrink-0">
            <div className="max-w-2xl mx-auto flex gap-3 items-end">
              <textarea
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-[#00F5FF]/50 transition-colors resize-none"
                placeholder="Опишите изображение... (например: закат над морем, масло)"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                onKeyDown={handleKey}
                disabled={loading}
                style={{ maxHeight: "120px" }}
              />
              <button
                onClick={generate}
                disabled={loading || !prompt.trim()}
                className="w-11 h-11 rounded-2xl bg-[#00F5FF] text-black flex items-center justify-center disabled:opacity-40 hover:bg-[#00F5FF]/80 transition-colors flex-shrink-0"
              >
                <Icon name="Sparkles" size={18} />
              </button>
            </div>
            <div className="max-w-2xl mx-auto text-center mt-2 pb-1">
              <span className="text-white/10 text-2xl font-bold tracking-[0.3em] uppercase select-none">NEYROMAX</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
