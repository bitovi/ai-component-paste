import { getFormFields, updateUncontrolledForm } from "./utils";

export class SmartPasteButton extends HTMLElement {
  private apiUrl: string | null = null;
  private button!: HTMLButtonElement;
  private errorMessage!: HTMLParagraphElement;
  private isExecuting = false;

  set api(value: string) {
    this.apiUrl = value;
  }

  get api(): string | null {
    return this.apiUrl;
  }

  static observedAttributes = ["api"];

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (name === "api") {
      this.apiUrl = newVal;
    }
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    this.innerHTML = `
        <div>
          <button type="button">
            Smart Paste
          </button>
          <p style="display: none;"></p>
        </div>
      `;

    this.button = this.querySelector("button")!;
    this.errorMessage = this.querySelector("p")!;

    this.button.addEventListener("click", (e) => this.handleClick(e));
  }

  private async handleClick(event: MouseEvent) {
    if (this.isExecuting) return;

    const form = (event.currentTarget as HTMLElement).closest("form");

    if (!form) {
      this.setError(new Error("No form found."));
      return;
    }

    if (!this.apiUrl) {
      throw new Error("API has not been set");
    }

    this.setExecuting(true);
    this.setError(null);

    try {
      const clipboardText = await navigator.clipboard.readText();

      const elements = Array.from(form.elements).filter(
        (element): element is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
          element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA"
      );

      const fields = getFormFields(elements);

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clipboardText, fields }),
      });

      if (!response.ok) throw new Error("Failed to extract data.");

      const extracted = await response.json();

      this.dispatchEvent(
        new CustomEvent("extracted", {
          detail: extracted,
          bubbles: true,
          composed: true,
        })
      );

      updateUncontrolledForm(elements, extracted);
    } catch (error) {
      this.setError(error instanceof Error ? error : new Error("Something went wrong"));
    } finally {
      this.setExecuting(false);
    }
  }

  private setExecuting(isExecuting: boolean) {
    this.isExecuting = isExecuting;
    this.button.disabled = isExecuting;
    this.button.textContent = isExecuting ? "Smart Pasting…" : "Smart Paste";
  }

  private setError(error: Error | null) {
    if (error) {
      this.errorMessage.textContent = error.message;
      this.errorMessage.style.display = "block";
    } else {
      this.errorMessage.style.display = "none";
    }
  }
}

customElements.define("smart-paste-button", SmartPasteButton);
