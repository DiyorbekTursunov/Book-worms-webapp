export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--tg-theme-button-color)] mx-auto mb-4"></div>
        <p className="text-[var(--tg-theme-text-color)]">Yuklanmoqda...</p>
      </div>
    </div>
  )
}
