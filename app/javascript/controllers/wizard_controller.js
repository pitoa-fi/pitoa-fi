import { Controller } from "@hotwired/stimulus"

// Wizard controller for managing multi-step interactive flow
export default class extends Controller {
  static targets = ["step", "progress", "progressBar", "nextBtn", "prevBtn", "toolCard"]
  static values = {
    currentStep: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 },
    stage: { type: String, default: "idea" },
    revealedTools: { type: Array, default: [] }
  }

  connect() {
    this.totalStepsValue = this.stepTargets.length
    this.updateView()
    this.setupKeyboardNavigation()
  }

  disconnect() {
    this.removeKeyboardNavigation()
  }

  setupKeyboardNavigation() {
    this.handleKeydown = this.handleKeydown.bind(this)
    document.addEventListener("keydown", this.handleKeydown)
  }

  removeKeyboardNavigation() {
    document.removeEventListener("keydown", this.handleKeydown)
  }

  handleKeydown(event) {
    if (event.key === "ArrowRight" && this.canGoNext()) {
      event.preventDefault()
      this.next()
    } else if (event.key === "ArrowLeft" && this.canGoPrevious()) {
      event.preventDefault()
      this.previous()
    }
  }

  next(event) {
    if (event) event.preventDefault()

    if (this.currentStepValue < this.totalStepsValue - 1) {
      this.transitionOut(() => {
        this.currentStepValue++
        this.updateView()
        this.transitionIn()
      })
    }
  }

  previous(event) {
    if (event) event.preventDefault()

    if (this.currentStepValue > 0) {
      this.transitionOut(() => {
        this.currentStepValue--
        this.updateView()
        this.transitionIn()
      })
    }
  }

  goToStep(event) {
    const stepIndex = parseInt(event.currentTarget.dataset.stepIndex)

    if (stepIndex !== this.currentStepValue && stepIndex >= 0 && stepIndex < this.totalStepsValue) {
      this.transitionOut(() => {
        this.currentStepValue = stepIndex
        this.updateView()
        this.transitionIn()
      })
    }
  }

  selectStage(event) {
    event.preventDefault()
    this.stageValue = event.currentTarget.dataset.stage
    this.next()
  }

  revealTool(event) {
    const toolId = event.currentTarget.dataset.toolId

    if (!this.revealedToolsValue.includes(toolId)) {
      this.revealedToolsValue = [...this.revealedToolsValue, toolId]
    }

    // Animate the tool card reveal
    const card = event.currentTarget.closest('[data-wizard-target="toolCard"]')
    if (card) {
      card.classList.add('revealed')
    }
  }

  updateView() {
    // Update step visibility
    this.stepTargets.forEach((step, index) => {
      if (index === this.currentStepValue) {
        step.classList.remove('hidden')
        step.classList.add('active')
      } else {
        step.classList.add('hidden')
        step.classList.remove('active')
      }
    })

    // Update progress bar
    this.updateProgress()

    // Update navigation buttons
    this.updateNavigationButtons()

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  updateProgress() {
    const progress = ((this.currentStepValue + 1) / this.totalStepsValue) * 100

    if (this.hasProgressBarTarget) {
      this.progressBarTarget.style.width = `${progress}%`
      this.progressBarTarget.setAttribute('aria-valuenow', progress)
    }

    if (this.hasProgressTarget) {
      this.progressTarget.textContent = `Step ${this.currentStepValue + 1} of ${this.totalStepsValue}`
    }
  }

  updateNavigationButtons() {
    if (this.hasNextBtnTarget) {
      if (this.canGoNext()) {
        this.nextBtnTarget.disabled = false
        this.nextBtnTarget.classList.remove('opacity-50', 'cursor-not-allowed')
      } else {
        this.nextBtnTarget.disabled = true
        this.nextBtnTarget.classList.add('opacity-50', 'cursor-not-allowed')
      }
    }

    if (this.hasPrevBtnTarget) {
      if (this.canGoPrevious()) {
        this.prevBtnTarget.disabled = false
        this.prevBtnTarget.classList.remove('opacity-50', 'cursor-not-allowed')
      } else {
        this.prevBtnTarget.disabled = true
        this.prevBtnTarget.classList.add('opacity-50', 'cursor-not-allowed')
      }
    }
  }

  canGoNext() {
    return this.currentStepValue < this.totalStepsValue - 1
  }

  canGoPrevious() {
    return this.currentStepValue > 0
  }

  transitionOut(callback) {
    const currentStep = this.stepTargets[this.currentStepValue]

    currentStep.classList.add('fade-out')

    setTimeout(() => {
      callback()
      currentStep.classList.remove('fade-out')
    }, 300)
  }

  transitionIn() {
    const currentStep = this.stepTargets[this.currentStepValue]

    currentStep.classList.add('fade-in')

    setTimeout(() => {
      currentStep.classList.remove('fade-in')
    }, 300)
  }

  // Animation utility for tool cards
  staggerRevealTools() {
    if (this.hasToolCardTarget) {
      this.toolCardTargets.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('revealed')
        }, index * 150)
      })
    }
  }
}
