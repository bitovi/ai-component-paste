<div align="center">
  <h1>AI Component Paste</h1>
  <p><b>Intelligent, AI-powered form filling with a simple copy and paste</b></p>
</div>

<div align='center'>
<table>
  <tr>
    <td align="center"><h3>⏱️ Save Time</h3>Eliminate tedious manual data entry</td>
    <td align="center"><h3>🎯 Reduce Errors</h3>AI-powered accuracy in form filling</td>
    <td align="center"><h3>😌 Better UX</h3>Smoother, faster user experience</td>
  </tr>
  <tr>
    <td align="center"><h3>🔌 Easy to Add</h3>Just a few lines of code to integrate</td>
    <td align="center"><h3>🧩 Flexible</h3>Works with any form structure</td>
    <td align="center"><h3>🛠️ Developer Friendly</h3>TypeScript + modern web standards</td>
  </tr>
</table>
</div>

## Overview

AI Component Paste solves a common frustration, manually transferring data from one source to web forms, in three simple steps:

1. **Copy any text** containing relevant information (email, address, contact details, etc.)
2. **Click the AI Paste button** in your form
3. **Watch as fields automatically populate** with the correct information

Behind the scenes, this web component extracts text from your clipboard and sends it to your server. There, our extractor function leverages OpenAI's GPT models to intelligently parse the data and match it to your form fields—creating a seamless, error-free data entry experience.

**[Try the live demo](https://ai-component-paste.bitovi-sandbox.com/)** to see it in action.

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
