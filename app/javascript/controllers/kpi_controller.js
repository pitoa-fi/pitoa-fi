import { Controller } from "@hotwired/stimulus"

// KPI controller for animating metric values and gauges
export default class extends Controller {
  static targets = ["value"]

  connect() {
    this.animateValue()
  }

  animateValue() {
    if (!this.hasValueTarget) return

    const element = this.valueTarget
    const text = element.textContent.trim()

    // Extract number from text (e.g., "285K€" -> 285)
    const match = text.match(/[\d.]+/)
    if (!match) return

    const finalValue = parseFloat(match[0])
    const duration = 1500 // milliseconds
    const steps = 60
    const increment = finalValue / steps
    let current = 0

    const interval = setInterval(() => {
      current += increment
      if (current >= finalValue) {
        current = finalValue
        clearInterval(interval)
      }

      // Update text while preserving units
      const newText = text.replace(/[\d.]+/, current.toFixed(text.includes('.') ? 1 : 0))
      element.textContent = newText
    }, duration / steps)
  }

  refresh() {
    this.animateValue()
  }
}
