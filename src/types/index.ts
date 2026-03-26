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
  showImageButton?: boolean
  imageButtonText?: string
}

export interface SectionProps extends Section {
  isActive: boolean
  onButtonClick?: () => void
  onImageButtonClick?: () => void
}