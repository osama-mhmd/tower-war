export default function $(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}
