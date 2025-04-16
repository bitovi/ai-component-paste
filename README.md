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

> [!NOTE]
> **Looking for Something a Little More Hands On? Checkout our Guides**
>
> - [Vanilla JS + Express](./guides/vanilla-express)
> - [Next.js Recipe Tracker](./guides/nextjs) (Under Construction 🚧)

To use AI Component Paste, you'll need three things:

1. **Frontend** An HTML form that includes the <ai-paste> component and the client-side script.

2. **AI Integration** An OpenAI API key

3. **Backend** An API endpoint that accepts clipboard text and field metadata, and returns structured data.

### Frontend Setup

Add the web component inside any HTML form you want to support smart paste on.

**Include the script**
If you're not using a bundler, import the component directly from [unpkg](https://unpkg.com/)

```html
<script type="module" src="https://unpkg.com/@bitovi/ai-component-paste@0.0.5/dist/component/index.js"></script>
```

If you're using a bundler like Vite, import the module:

```ts
import "@bitovi/ai-component-paste/component";
```

Add it to a `<form>`. Form inputs must have a `name` attribute defined for `ai-component-paste` to properly scrape the form.

```html
<form>
  <label>
    Name
    <input name="name" />
  </label>

  <label>
    Email
    <input type="email" name="email" />
  </label>

  <label>
    Interest
    <select name="interest">
      <option value="demo">Product Demo</option>
      <option value="pricing">Pricing Info</option>
    </select>
  </label>

  <ai-paste api="/extractor"></ai-paste>
</form>
```

Once clicked, `ai-paste` will:

1. Scrape visible form fields
2. Read the clipboard text
3. Send both to your `/extractor` endpoint
4. Automatically populate the form with AI-generated values

### Backend Setup

> You must run a server — this cannot be done from the frontend.
>
> 🔐 You must set the `OPENAI_API_KEY` as an environment variable on your server. For more on how to create an OpenAI key, see here.

To power the AI form-filling, you'll need to set up a backend server that handles requests from `<ai-paste>`.

This endpoint should:

1. Accept clipboard text and field metadata
2. Call `extractFormData` from `@bitovi/ai-component-paste/extractor`
3. Return a key-value map of field names to values

```ts
import express from "express";

import type { FormField } from "@bitovi/ai-component-paste/extractor";
import { extractFormData } from "@bitovi/ai-component-paste/extractor";

const app = express();
app.use(express.json());

app.post<{}, {}, { text: string; fields: FormField[] }>("/extractor", async (req, res) => {
  const { text, fields } = req.body;

  const result = await extractFormData(text, fields);

  res.json(result);
});

app.listen(3000, () => {
  console.log("Extractor API running on http://localhost:3000");
});
```

`extractFormData` handles formatting the request and parsing the result — you don't need to write any prompt engineering logic yourself. Make sure your environment includes:

```
OPENAI_API_KEY=sk-...
```

Once your endpoint is live, set the api attribute in your frontend form's <ai-paste> to point to it:

```html
<ai-paste api="/extractor"></ai-paste>
```

## Events

The <ai-paste> component emits custom DOM events you can listen to for logging, analytics, or extending behavior. These events bubble, so you can attach listeners higher up the DOM tree if needed.

> **Note:** if you are using a **Controlled Form** with React you will need to listen to the `ai-paste-extracted` event to update your form state.

`ai-paste-extracted`

```ts
document.querySelector("ai-paste").addEventListener("ai-paste-extracted", (event) => {
  const extractedData = event.detail;

  console.log("Extracted data:", extractedData);
});
```

`ai-paste-error`
Fired when an error occurs during extraction (e.g. network failure, invalid API key, etc.).

```ts
document.querySelector("ai-paste").addEventListener("ai-paste-error", (event) => {
  const error = event.detail;
  console.error("Error:", error);
});
```
