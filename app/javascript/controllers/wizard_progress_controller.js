import { Controller } from "@hotwired/stimulus"

// Tracks user progress through the wizard and provides actionable next steps
export default class extends Controller {
  static targets = ["completionCheckbox", "progressIndicator", "actionItem"]
  static values = {
    stage: { type: String, default: "idea" },
    currentTool: { type: String, default: "" }
  }

  connect() {
    this.loadProgress()
    this.updateProgressIndicators()
  }

  toggleActionItem(event) {
    const actionId = event.currentTarget.dataset.actionId
    const isCompleted = event.currentTarget.checked

    // Save to localStorage
    const completedActions = this.getCompletedActions()

    if (isCompleted) {
      if (!completedActions.includes(actionId)) {
        completedActions.push(actionId)
      }
    } else {
      const index = completedActions.indexOf(actionId)
      if (index > -1) {
        completedActions.splice(index, 1)
      }
    }

    localStorage.setItem('wizard_completed_actions', JSON.stringify(completedActions))
    this.updateProgressIndicators()
    this.celebrateIfAllCompleted(actionId)
  }

  markToolCompleted(event) {
    event.preventDefault()
    const toolId = this.currentToolValue

    if (!toolId) return

    const completedTools = this.getCompletedTools()

    if (!completedTools.includes(toolId)) {
      completedTools.push(toolId)
      localStorage.setItem('wizard_completed_tools', JSON.stringify(completedTools))

      // Visual feedback
      this.showCompletionAnimation(event.currentTarget)

      // Update UI
      event.currentTarget.innerHTML = `
        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        Completed!
      `
      event.currentTarget.classList.remove('bg-gradient-to-r', 'from-green-600', 'to-green-700')
      event.currentTarget.classList.add('bg-gray-400', 'cursor-default')
      event.currentTarget.disabled = true
    }
  }

  getCompletedActions() {
    const stored = localStorage.getItem('wizard_completed_actions')
    return stored ? JSON.parse(stored) : []
  }

  getCompletedTools() {
    const stored = localStorage.getItem('wizard_completed_tools')
    return stored ? JSON.parse(stored) : []
  }

  loadProgress() {
    const completedActions = this.getCompletedActions()

    if (this.hasCompletionCheckboxTarget) {
      this.completionCheckboxTargets.forEach(checkbox => {
        const actionId = checkbox.dataset.actionId
        if (completedActions.includes(actionId)) {
          checkbox.checked = true
        }
      })
    }
  }

  updateProgressIndicators() {
    const completedActions = this.getCompletedActions()
    const totalActions = this.hasActionItemTarget ? this.actionItemTargets.length : 0

    if (totalActions > 0 && this.hasProgressIndicatorTarget) {
      const percentage = Math.round((completedActions.length / totalActions) * 100)

      this.progressIndicatorTargets.forEach(indicator => {
        indicator.textContent = `${completedActions.length}/${totalActions} actions completed (${percentage}%)`
      })
    }
  }

  celebrateIfAllCompleted(actionId) {
    const completedActions = this.getCompletedActions()
    const totalActions = this.hasActionItemTarget ? this.actionItemTargets.length : 0

    if (completedActions.length === totalActions && totalActions > 0) {
      // Show celebration
      setTimeout(() => {
        if (confirm("🎉 Amazing! You've completed all actions for this framework. Ready to move to the next one?")) {
          // Trigger next button click if available
          const nextBtn = document.querySelector('[data-wizard-target="nextBtn"]')
          if (nextBtn) nextBtn.click()
        }
      }, 500)
    }
  }

  showCompletionAnimation(button) {
    button.classList.add('scale-110')
    setTimeout(() => {
      button.classList.remove('scale-110')
    }, 200)
  }

  resetProgress(event) {
    if (event) event.preventDefault()

    if (confirm("Are you sure you want to reset all your progress?")) {
      localStorage.removeItem('wizard_completed_actions')
      localStorage.removeItem('wizard_completed_tools')
      window.location.reload()
    }
  }

  exportProgress(event) {
    if (event) event.preventDefault()

    const completedActions = this.getCompletedActions()
    const completedTools = this.getCompletedTools()

    const report = {
      stage: this.stageValue,
      completedAt: new Date().toISOString(),
      completedActions: completedActions,
      completedTools: completedTools,
      progressPercentage: this.hasActionItemTarget
        ? Math.round((completedActions.length / this.actionItemTargets.length) * 100)
        : 0
    }

    const content = `# Pitoa Wizard Progress Report

**Stage:** ${this.stageValue}
**Date:** ${new Date().toLocaleDateString()}
**Progress:** ${report.progressPercentage}%

## Completed Actions
${completedActions.length > 0 ? completedActions.map(id => `- ${id}`).join('\n') : '- None yet'}

## Completed Frameworks
${completedTools.length > 0 ? completedTools.map(id => `- ${id}`).join('\n') : '- None yet'}

---
Keep going! Track your progress at Pitoa.
`

    this.downloadFile(content, `pitoa-progress-${this.stageValue}.md`)
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
}
