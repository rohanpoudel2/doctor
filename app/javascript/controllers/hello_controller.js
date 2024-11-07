import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log("first");
    this.element.textContent = "Hello World!";
  }
}
