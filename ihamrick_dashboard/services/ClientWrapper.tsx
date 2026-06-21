"use client"; // Mark as a client-side component

import { Provider } from "react-redux";
import store from "./store";
export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
