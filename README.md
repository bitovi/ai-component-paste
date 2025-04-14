# AI Component Paste

<div align="center">
  <h1>AI Component Paste</h1>
</div>

## Overview

AI Component Paste is a web component and function to run on a server endpoint that enables intelligent form filling using AI. It analyzes clipboard content and automatically populates form fields with relevant information, making data entry faster and more accurate.

## Installation

```bash
npm install @bitovi/ai-component-paste
```

## Usage

1. Import the component in your HTML:

```html
<script type="module">
  import "@bitovi/ai-component-paste/component";
</script>
```

2. Add the component to your form:

```html
<form>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <input type="tel" name="phone" />

  <ai-paste api="YOUR_API_ENDPOINT"></ai-paste>
</form>
```

3. Configure OpenAI API Key (Server-side)

Before setting up the API endpoint, you need to configure your OpenAI API key on the server:

```bash
# Set the OpenAI API key as an environment variable
export OPENAI_API_KEY=your-api-key-here
```

⚠️ **Security Warning**: Never commit your OpenAI API key to version control. Use environment variables or a secure secrets management system. The API key should be kept private and secure.

4. Set up the API endpoint to handle the extraction:

```javascript
import { extractFormData } from "@bitovi/ai-component-paste/extractor";

// Example API endpoint handler
app.post("/api/extract", async (req, res) => {
  const { text, fields } = req.body;
  const extracted = await extractFormData(text, fields);
  res.json(extracted);
});
```

## API Configuration

The `ai-paste` component requires an API endpoint to be configured:

```html
<ai-paste api="https://your-api.com/extract"></ai-paste>
```

## Events

The component dispatches two events:

1. `ai-paste-extracted` - Fired when data is successfully extracted:

```javascript
document.querySelector("ai-paste").addEventListener("ai-paste-extracted", (event) => {
  const extractedData = event.detail;
  console.log("Extracted data:", extractedData);
});
```

2. `ai-paste-error` - Fired when an error occurs:

```javascript
document.querySelector("ai-paste").addEventListener("ai-paste-error", (event) => {
  const error = event.detail;
  console.error("Error:", error);
});
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
