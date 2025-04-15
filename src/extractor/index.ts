import { z, ZodRawShape } from "zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { FormField, FormValue } from "../shared/types";

export type { FormField } from "../shared/types";

const gpt = openai("gpt-4-turbo");

function toZod(field: FormField) {
  if ("options" in field) {
    return z.enum(field.options as [string, ...string[]]).optional();
  }

  switch (field.type) {
    case "number":
      return z.coerce.number().optional();
    case "checkbox":
      return z.boolean().optional();
    case "email":
      return z.string().email().optional();
    case "date":
      return z.string().date().optional();
    default:
      return z.string().optional();
  }
}

function buildZodSchema(fields: FormField[]) {
  const shape: ZodRawShape = {};
  for (const field of fields) {
    let base = toZod(field);
    if (field?.description) {
      base = base.describe(field.description);
    }
    shape[field.name] = base;
  }

  return z.object(shape);
}

export const extractFormData = async (text: string, fields: FormField[]): Promise<Record<string, FormValue>> => {
  const schema = buildZodSchema(fields);

  const prompt = `
  Given the following unstructured text:
  
  """ 
  ${text}
  """
  
  Extract the fields as a JSON object. If you do not have enough information to 
  fill out part of the object, leave it as undefined.

  Only output a valid JSON object. Do not include explanation or comments.
  `;

  const { object } = await generateObject({
    model: gpt,
    prompt,
    schema,
  });

  return object;
};
