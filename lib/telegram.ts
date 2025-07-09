export type TelegramWebApp = {
  ready: () => void
  MainButton: {
    setText: (text: string) => void
    setParams: (params: { color: string; text_color: string }) => void
    show: () => void
    onClick: (callback: () => void) => void
  }
  themeParams: {
    bg_color: string
    text_color: string
    button_color: string
    button_text_color: string
    hint_color: string
    destructive_text_color: string
    section_bg_color: string
    section_header_text_color: string
  }
  onEvent: (event: string, callback: () => void) => void
}

export const getTelegramWebApp = (): TelegramWebApp | null => {
  if (typeof window !== "undefined" && window.Telegram) {
    return window.Telegram.WebApp
  }
  return null
}
