import React from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F4F7F5] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FDEAEA] text-[#E84040] flex items-center justify-center mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8 stroke-[2]" />
          </div>
          <h2 className="text-lg font-bold text-[#111F1A] mb-1">
            Terjadi Kendala pada Halaman
          </h2>
          <p className="text-xs text-[#4A6358] max-w-xs mb-6 leading-relaxed">
            Halaman mengalami masalah teknis saat dimuat. Silakan muat ulang atau kembali ke beranda.
          </p>

          <div className="flex gap-2 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="flex-1 bg-[#1A6B4A] hover:bg-[#145339] text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
            >
              <Home className="w-4 h-4 stroke-[2]" />
              Ke Beranda
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-white border border-[#E2EBE7] text-[#4A6358] hover:text-[#111F1A] py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4 stroke-[2]" />
              Refresh
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
