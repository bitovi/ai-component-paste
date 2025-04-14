interface BaseField {
  name: string;
  type: string;
  description?: string | null;
}
type InputField = BaseField;

export interface SelectField extends BaseField {
  options: Array<string>;
}

export type FormField = InputField | SelectField;

export type FormValue = string | boolean | string[] | null;

export type FormElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
