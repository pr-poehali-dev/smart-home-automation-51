import type { ReactNode } from "react"

export interface Section {
  id: string
  title: string
  subtitle?: ReactNode
  content?: string
  showButton?: boolean
  buttonText?: string
  showChat?: boolean
  footer?: string
}

export interface SectionProps extends Section {
  isActive: boolean
  onButtonClick?: () => void
}