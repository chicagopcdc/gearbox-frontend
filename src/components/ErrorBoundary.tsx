import { Component } from 'react'

type ErrorBoundaryProps = {
  children: React.ReactNode
  fallback: React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
}

type ErrorBoundaryState = {
  hasError: boolean
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch = this.props.onError ?? console.error

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}
