import { useState } from "react";
import { createContext } from "react";

export function getCookie(name: string) {
  let documentCookie = document.cookie;
  let cookies = documentCookie.replaceAll(" ", "").split(";");
  let prefix = name + "=";
  let cookie = cookies.find((c) => c.includes(prefix));
  if (cookie) {
    let equelIndex = cookie.indexOf("=");
    return cookie.substring(equelIndex + 1);
  }
  return null;
}

export function clearCookies() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

export function useForceUpdate() {
  const [value, setValue] = useState<number>(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

export const UpdateContext = createContext<any>(null);
