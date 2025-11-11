import { Controller } from "@hotwired/stimulus"

// Interactive Lean Canvas controller with localStorage persistence
export default class extends Controller {
  static targets = ["field", "downloadBtn", "clearBtn"]
  static values = {
    canvasId: { type: String, default: "lean_canvas" }
  }

  connect() {
    this.loadFromStorage()
    this.updateDownloadButton()
  }

  saveField(event) {
    const fieldName = event.target.dataset.fieldName
    const value = event.target.value

    this.saveToStorage(fieldName, value)
    this.updateDownloadButton()
  }

  saveToStorage(fieldName, value) {
    const key = `${this.canvasIdValue}_${fieldName}`
    localStorage.setItem(key, value)
  }

  loadFromStorage() {
    this.fieldTargets.forEach(field => {
      const fieldName = field.dataset.fieldName
      const key = `${this.canvasIdValue}_${fieldName}`
      const savedValue = localStorage.getItem(key)

      if (savedValue) {
        field.value = savedValue
      }
    })
  }

  clearCanvas(event) {
    event.preventDefault()

    if (confirm("Are you sure you want to clear all fields?")) {
      this.fieldTargets.forEach(field => {
        const fieldName = field.dataset.fieldName
        const key = `${this.canvasIdValue}_${fieldName}`

        field.value = ""
        localStorage.removeItem(key)
      })

      this.updateDownloadButton()
    }
  }

  downloadCanvas(event) {
    event.preventDefault()

    const canvasData = {}
    this.fieldTargets.forEach(field => {
      const fieldName = field.dataset.fieldName
      canvasData[fieldName] = field.value
    })

    const content = this.generateMarkdown(canvasData)
    this.downloadFile(content, "lean-canvas.md")
  }

  generateMarkdown(data) {
    return `# Lean Canvas

## Problem
${data.problem || "_Not filled yet_"}

### Existing Alternatives
${data.alternatives || "_Not filled yet_"}

## Customer Segments
${data.segments || "_Not filled yet_"}

### Early Adopters
${data.early_adopters || "_Not filled yet_"}

## Unique Value Proposition
${data.uvp || "_Not filled yet_"}

## Solution
${data.solution || "_Not filled yet_"}

## Channels
${data.channels || "_Not filled yet_"}

## Revenue Streams
${data.revenue || "_Not filled yet_"}

## Cost Structure
${data.costs || "_Not filled yet_"}

## Key Metrics
${data.metrics || "_Not filled yet_"}

## Unfair Advantage
${data.advantage || "_Not filled yet_"}

---
Generated with Pitoa - ${new Date().toLocaleDateString()}
`
  }

  downloadFile(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    link.href = url
    link.download = filename
    link.click()

    URL.revokeObjectURL(url)
  }

  updateDownloadButton() {
    const hasContent = this.fieldTargets.some(field => field.value.trim() !== "")

    if (this.hasDownloadBtnTarget) {
      this.downloadBtnTarget.disabled = !hasContent

      if (hasContent) {
        this.downloadBtnTarget.classList.remove("opacity-50", "cursor-not-allowed")
      } else {
        this.downloadBtnTarget.classList.add("opacity-50", "cursor-not-allowed")
      }
    }
  }
}
