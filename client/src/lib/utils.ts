import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fromSnakeCaseToCamelCase(value: any): any {
  if (typeof value !== "object" || value === null) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(fromSnakeCaseToCamelCase);
  }

  return Object.keys(value).reduce((acc: any, key: string) => {
    const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    acc[camelCaseKey] = fromSnakeCaseToCamelCase(value[key]);
    return acc;
  }, {});
}

export const getInitials = (name: string) => {
  if (!name) return "";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

export function maskEmail(email:string): string{
  return email.replace(/(.{3}).+(@.+)/, '$1***$2')
}