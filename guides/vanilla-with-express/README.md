<div align="center">
  <h1>Using AI Component Paste with Vanilla and Express</h1>
</div>

> [!Warning]
>
> 🚧 Under Construction 🚧

## Overview

This guide demonstrates how to integrate `@bitovi/ai-component-paste` with a Vanilla and Express application to build an intelligent Job Post form. You'll learn how to create a form that leverages AI to automatically extract and categorize job posting information from copied text. By the end of this tutorial, you'll have a functional form that allows users to simply copy text from any source (slack message, email, etc.) and fill out a form to create the job posting.

[image of completed project]

## The Express Project

We'll begin by setting up the backend of our application using Express and TypeScript. This server will host the AI extraction endpoint used by the `<ai-paste>` component to parse and map clipboard text into form field values.

### Project Configuration

To get started we will bootstrap an express application with TypeScript.

```sh
mkdir ai-component-paste-be
cd ai-component-paste-be
npm init -y
npm install express
npm install typescript tsx @types/node @types/express --save-dev
```

Next we'll need to create a `tsconfig.json` file that's setup for a node environment, this can be done by running

```sh
npx tsc --init

```

and replacing the content of the newly create `tsconfig.json` file with

```json
{
  "compilerOptions": {
    "target": "es2022",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Next, update the `package.json` to include scripts for building and running your application. You can remove the default `"test"` script and replace the entire `"scripts"` section with the following:

```diff
{
  // ... rest of package.json
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1"
+   "build": "tsc",
+   "start": "node dist/index.js",
+   "dev": "tsx src/index.ts"
  }
}
```

We need to create two files. Open the project in a code editor and create:

1. `.env` to house our environment
2. `src/index.ts` to house our server

Once done, your project should look like this:

```
└── node_modules
├── src/
│   └── index.ts (this file is empty)
└── .env (this file is)
└── package.json
└── package-lock.json
└── tsconfig.json
```

With our project scaffolded and development scripts in place, we’re ready to build the Express server that will handle AI-powered form extraction.

### Building the Server

Next, we'll need to create the server itself. Open the `src/index.ts` file and add teh following code:

```ts
import express, { Request, Response } from "express";

const app = express();
const port = 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`@bitovi/ai-component-paste example app listening on port ${port}`);
});
```

You can verify your setup is correct by running:

```sh
npm run dev
```

you should see a `"@bitovi/ai-component-paste example app listening on port 3000"` in the terminal and if you visit `http://localhost:3000` in your browser you should see "Hello World!".

Now that we’ve confirmed our server is up and running, let’s integrate the AI extraction logic using `@bitovi/ai-component-paste`.

### Integrating `@bitovi/ai-component-paste`

Next we can install and use `@bitovi/ai-component-paste`

```sh
npm install @bitovi/ai-component-paste
```

We’ll also need to configure our environment. In the `.env` file you created earlier, add your OpenAI API key:

> [!NOTE]
>
> Need help creating an OpenAI key? Check out our guide to getting one
> to help you get set up.

```
OPENAI_API_KEY=your-openai-key-here
```

> [!WARNING]
>
> We aren't using git in this guide, but if you are, make sure not to
> commit this file to version control.
