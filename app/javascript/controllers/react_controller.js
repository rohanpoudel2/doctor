import { Controller } from "@hotwired/stimulus";
import { renderDashboardPage } from "../src/dashboard";

export default class extends Controller {
  connect() {
    document.addEventListener("turbo:load", renderDashboardPage);
  }
}
