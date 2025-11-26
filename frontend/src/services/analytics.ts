/**
 * Analytics Service - Phase 8 Optimization
 * Simple analytics tracking for Arkitecto AI PRO
 *
 * Events tracked:
 * - Page views
 * - Budget calculations
 * - Export actions
 * - User interactions
 */

type EventName =
  | 'page_view'
  | 'budget_calculated'
  | 'budget_exported'
  | 'project_created'
  | 'project_viewed'
  | 'project_deleted'
  | 'suggestion_clicked'
  | 'share_whatsapp'
  | 'share_email'
  | 'login'
  | 'signup'
  | 'logout'
  | 'error'

interface EventProperties {
  [key: string]: string | number | boolean | undefined
}

class Analytics {
  private enabled: boolean = true
  private queue: Array<{ name: EventName; properties: EventProperties; timestamp: number }> = []
  private sessionId: string

  constructor() {
    // Generate session ID
    this.sessionId = this.generateSessionId()

    // Check if analytics should be disabled
    if (typeof window !== 'undefined') {
      this.enabled = !window.localStorage.getItem('analytics_disabled')
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  }

  /**
   * Track an event
   */
  track(name: EventName, properties: EventProperties = {}) {
    if (!this.enabled) return

    const event = {
      name,
      properties: {
        ...properties,
        session_id: this.sessionId,
        url: typeof window !== 'undefined' ? window.location.pathname : '',
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        screen_width: typeof window !== 'undefined' ? window.innerWidth : 0,
        screen_height: typeof window !== 'undefined' ? window.innerHeight : 0,
        timestamp_local: new Date().toISOString()
      },
      timestamp: Date.now()
    }

    // Add to queue
    this.queue.push(event)

    // Log in development
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${name}`, properties)
    }

    // In production, this would send to an analytics backend
    // For now, we store locally and could later integrate with:
    // - Google Analytics 4
    // - Mixpanel
    // - Amplitude
    // - Custom backend
    this.persistQueue()
  }

  /**
   * Track page view
   */
  pageView(pageName: string) {
    this.track('page_view', { page: pageName })
  }

  /**
   * Track budget calculation
   */
  budgetCalculated(itemCount: number, totalAmount: number, category?: string) {
    this.track('budget_calculated', {
      item_count: itemCount,
      total_amount: totalAmount,
      category: category || 'general'
    })
  }

  /**
   * Track export action
   */
  budgetExported(format: 'pdf' | 'excel' | 'text', itemCount: number) {
    this.track('budget_exported', {
      format,
      item_count: itemCount
    })
  }

  /**
   * Track error
   */
  trackError(errorType: string, errorMessage: string, context?: string) {
    this.track('error', {
      error_type: errorType,
      error_message: errorMessage.substring(0, 500),
      context: context || 'unknown'
    })
  }

  /**
   * Persist queue to localStorage
   */
  private persistQueue() {
    if (typeof window === 'undefined') return

    try {
      // Keep only last 100 events
      const eventsToStore = this.queue.slice(-100)
      window.localStorage.setItem('analytics_queue', JSON.stringify(eventsToStore))
    } catch {
      // Storage full or unavailable
    }
  }

  /**
   * Get stored analytics (for debugging or export)
   */
  getStoredEvents(): typeof this.queue {
    if (typeof window === 'undefined') return []

    try {
      const stored = window.localStorage.getItem('analytics_queue')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Clear stored events
   */
  clearEvents() {
    this.queue = []
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('analytics_queue')
    }
  }

  /**
   * Disable analytics
   */
  disable() {
    this.enabled = false
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('analytics_disabled', 'true')
    }
  }

  /**
   * Enable analytics
   */
  enable() {
    this.enabled = true
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('analytics_disabled')
    }
  }

  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.enabled
  }
}

// Singleton instance
export const analytics = new Analytics()

// Export individual functions for convenience
export const trackEvent = (name: EventName, properties?: EventProperties) =>
  analytics.track(name, properties)

export const trackPageView = (pageName: string) =>
  analytics.pageView(pageName)

export const trackBudget = (itemCount: number, totalAmount: number, category?: string) =>
  analytics.budgetCalculated(itemCount, totalAmount, category)

export const trackExport = (format: 'pdf' | 'excel' | 'text', itemCount: number) =>
  analytics.budgetExported(format, itemCount)

export const trackError = (errorType: string, errorMessage: string, context?: string) =>
  analytics.trackError(errorType, errorMessage, context)

export default analytics
