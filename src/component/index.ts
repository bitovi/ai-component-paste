import { FormElement } from "../shared/types";
import { getFormFields, updateUncontrolledForm } from "./utils";

export class AIPaste extends HTMLElement {
  private apiUrl: string | null = null;
  private button!: HTMLButtonElement;
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
          <button type="button">
            Smart Paste
          </button>
      `;

    this.addEventListener("click", (event) => this.handleClick(event));
  }

  private async handleClick(event: MouseEvent) {
    if (this.isExecuting) return;

    const form = (event.currentTarget as HTMLElement).closest("form");

    if (!form) {
      this.dispatchError(new Error("No form found."));
      return;
    }

    if (!this.apiUrl) {
      this.dispatchError(new Error("API has not been set"));
      return;
    }

    this.setExecuting(true);

    try {
      const clipboardText = await navigator.clipboard.readText();

      const elements = Array.from(form.elements).filter(
        (element): element is FormElement =>
          element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA"
      );

      const fields = getFormFields(elements);

      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: clipboardText, fields }),
      }).catch((error) => {
        this.dispatchError(error instanceof Error ? error : new Error("Failed to extract data."));
        return error;
      });

      if (!response.ok) {
        this.dispatchError(new Error("Failed to extract data."));
        return;
      }

      const extracted = await response.json();

      this.dispatchEvent(
        new CustomEvent("ai-paste-extracted", {
          detail: extracted,
          bubbles: true,
        })
      );

      updateUncontrolledForm(elements, extracted);
    } catch (error) {
      this.dispatchError(error instanceof Error ? error : new Error("Something went wrong"));
    } finally {
      this.setExecuting(false);
    }
  }

  private setExecuting(isExecuting: boolean) {
    this.isExecuting = isExecuting;
    this.button.disabled = isExecuting;
    this.button.textContent = isExecuting ? "Smart Pasting…" : "Smart Paste";
  }

  private dispatchError(error: Error) {
    console.error(error);

    this.dispatchEvent(
      new CustomEvent("ai-paste-error", {
        detail: error,
        bubbles: true,
      })
    );
  }
}

customElements.define("ai-paste", AIPaste);
