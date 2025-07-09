"use client"

import React from "react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback
      return <Fallback error={this.state.error!} reset={() => this.setState({ hasError: false, error: undefined })} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--tg-theme-bg-color)] p-4">
      <div className="text-center max-w-md">
        <h2 className="text-xl font-bold mb-4 text-[var(--tg-theme-text-color)]">Xatolik yuz berdi</h2>
        <p className="text-[var(--tg-theme-hint-color)] mb-4">{error.message || "Noma'lum xatolik"}</p>
        <button
          onClick={reset}
          className="bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)] px-4 py-2 rounded hover:opacity-90"
        >
          Qayta urinish
        </button>
      </div>
    </div>
  )
}
