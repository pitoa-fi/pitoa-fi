import { Controller } from "@hotwired/stimulus"

// Lightweight Stimulus example kept for docs/demo pages; delete if you do not
// mount the `hello` controller anywhere.

export default class extends Controller {
  connect() {
    this.element.textContent = "Hello World!"
  }
}
