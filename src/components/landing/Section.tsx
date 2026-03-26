import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { SectionProps } from "@/types"
import ChatWidget from "./ChatWidget"

export default function Section({ id, title, subtitle, content, footer, isActive, showButton, buttonText, showImageButton, imageButtonText, showChat, onButtonClick, onImageButtonClick }: SectionProps) {
  return (
    <section id={id} className="relative h-screen w-full snap-start flex flex-col justify-center p-8 md:p-16 lg:p-24">
      {subtitle && (
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {subtitle}
        </motion.div>
      )}
      <motion.h2
        className={`font-bold leading-[1.1] tracking-tight max-w-4xl text-white ${showChat ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-4xl md:text-6xl lg:text-[5rem] xl:text-[6rem]'}`}
        initial={{ opacity: 0, y: 50 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>
      {content && (
        <motion.p
          className="text-lg md:text-xl max-w-2xl mt-4 text-neutral-400"
          initial={{ opacity: 0, y: 50 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ChatWidget />
        </motion.div>
      )}
      {footer && (
        <motion.p
          className="text-sm text-white/30 mt-8"
          initial={{ opacity: 0 }}
          animate={isActive ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {footer}
        </motion.p>
      )}
      {(showButton || showImageButton) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 md:mt-16 flex flex-wrap gap-4"
        >
          {showButton && (
            <Button
              variant="outline"
              size="lg"
              className="text-[#00F5FF] bg-transparent border-[#00F5FF] hover:bg-[#00F5FF] hover:text-black transition-colors"
              onClick={onButtonClick}
            >
              {buttonText}
            </Button>
          )}
          {showImageButton && (
            <Button
              variant="outline"
              size="lg"
              className="text-white/70 bg-transparent border-white/30 hover:bg-white hover:text-black transition-colors"
              onClick={onImageButtonClick}
            >
              {imageButtonText}
            </Button>
          )}
        </motion.div>
      )}
    </section>
  )
}