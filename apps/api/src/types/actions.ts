export interface ActionErrorResponse {
  message: string;
}

export interface ActionParameter {
  name: string;
  label: string;
  type?: "number" | "text" | "url" | "email" | "date" | "datetime-local" | "checkbox" | "radio";
  required?: boolean;
}

export interface LinkedAction {
  type?: "transaction" | "post";
  label: string;
  href: string;
  parameters?: ActionParameter[];
}

export interface ActionGetResponse {
  type: "action";
  icon: string;
  title: string;
  description: string;
  label: string;
  disabled?: boolean;
  error?: ActionErrorResponse;
  links?: {
    actions: LinkedAction[];
  };
}

export interface ActionPostRequestBody {
  account: string;
}

export interface ActionPostResponse {
  type: "transaction";
  transaction: string;
  message: string;
}
