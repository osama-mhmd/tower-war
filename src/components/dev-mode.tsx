import { ReactNode } from "react";

export default function DevMode({ children }: { children: ReactNode }) {
  if (!import.meta.env.DEV) return null;
  else return children;
}
