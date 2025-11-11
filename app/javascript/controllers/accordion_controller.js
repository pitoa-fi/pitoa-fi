import { Controller } from "@hotwired/stimulus"

// Accordion controller for expandable/collapsible sections
export default class extends Controller {
  static targets = ["content"]

  connect() {
    this.isExpanded = false
  }

  toggle() {
    this.isExpanded = !this.isExpanded

    if (this.hasContentTarget) {
      if (this.isExpanded) {
        this.contentTarget.classList.remove("hidden")
      } else {
        this.contentTarget.classList.add("hidden")
      }
    }
  }
}
