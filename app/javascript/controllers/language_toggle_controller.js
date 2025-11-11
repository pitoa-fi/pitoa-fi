import { Controller } from "@hotwired/stimulus"

// Simple language toggle for hero copy; extends easily to more locales later.
export default class extends Controller {
  static targets = ["copy", "button"]
  static values = {
    defaultLang: { type: String, default: "en" },
  }

  connect() {
    this.currentLang = this.defaultLangValue
    this.updateView()
  }

  switch(event) {
    event.preventDefault()
    const lang = event.currentTarget.dataset.lang
    if (!lang || lang === this.currentLang) return

    this.currentLang = lang
    this.updateView()
  }

  updateView() {
    this.copyTargets.forEach((element) => {
      element.classList.toggle("hidden", element.dataset.lang !== this.currentLang)
    })

    this.buttonTargets.forEach((button) => {
      const isActive = button.dataset.lang === this.currentLang
      button.classList.toggle("bg-blue-600", isActive)
      button.classList.toggle("text-white", isActive)
      button.classList.toggle("bg-gray-100", !isActive)
      button.classList.toggle("text-gray-700", !isActive)
      button.setAttribute("aria-pressed", isActive)
    })
  }
}
