import { Badge } from "@/components/ui/badge"

export const sections = [
  {
    id: 'hero',
    subtitle: <Badge variant="outline" className="text-[#00F5FF] border-[#00F5FF]">AI нового поколения</Badge>,
    title: "NeyroMAX — думай быстрее.",
    showButton: true,
    buttonText: 'Попробовать'
  },
  {
    id: 'about',
    title: 'Что такое NeyroMAX?',
    content: 'NeyroMAX — умный AI-ассистент, который отвечает на вопросы, помогает с задачами и пишет код за вас. Просто спросите — и получите результат за секунды.'
  },
  {
    id: 'features',
    title: 'Возможности',
    content: 'Общение на естественном языке, генерация кода на любом языке программирования, объяснение сложных концепций простыми словами — всё в одном окне.'
  },
  {
    id: 'cta',
    title: 'Начните работать умнее.',
    content: 'NeyroMAX доступен 24/7 и готов помочь с любой задачей — от простых ответов до сложного кода.',
    footer: 'Создатель Полиенко Максим',
  },
]