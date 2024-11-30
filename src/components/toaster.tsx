import { createContext, ReactNode, useContext, useState } from "react";

interface ToasterContext {
  value: string | undefined;
  setValue: ((arg0: string) => void) | undefined;
}

export const ToasterContext = createContext<ToasterContext>({
  value: undefined,
  setValue: undefined,
});

export default function Toaster({ children }: { children: ReactNode }) {
  const [value, setValue] = useState("");

  return (
    <ToasterContext.Provider
      value={{
        value,
        setValue,
      }}
    >
      {children}
      {value && <div className="toast">{value}</div>}
    </ToasterContext.Provider>
  );
}

export function useToast() {
  const { setValue } = useContext(ToasterContext);

  return (message: string) => {
    if (setValue) setValue(message);

    // Optional: Clear the toast after 2 seconds
    setTimeout(() => setValue && setValue(""), 2000);
  };
}
