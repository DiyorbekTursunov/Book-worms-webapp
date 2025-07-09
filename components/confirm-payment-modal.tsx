"use client"

interface ConfirmPaymentModalProps {
  isOpen: boolean
  userName: string
  newPaymentStatus: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmPaymentModal({
  isOpen,
  userName,
  newPaymentStatus,
  onClose,
  onConfirm,
}: ConfirmPaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[var(--tg-theme-bg-color)] p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-[var(--tg-theme-section-header-text-color)]">Tasdiqlash</h2>
        <p className="mb-4">
          Haqiqatan ham {userName} uchun to&apos;lov holatini &quot;{newPaymentStatus ? "to'langan" : "to'lanmagan"}&quot; deb
          o&apos;zgartirmoqchimisiz?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-4 py-2 rounded hover:opacity-90"
            onClick={onClose}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Tasdiqlash
          </button>
        </div>
      </div>
    </div>
  )
}
