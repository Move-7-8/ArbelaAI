import { atom } from "jotai";

export const assistantAtom = atom(null);
export const fileAtom = atom(null);
export const assistantFileAtom = atom(null);
export const threadAtom = atom(null);
export const runAtom = atom(null);
export const messagesAtom = atom([]);

export const runStateAtom = atom("N/A");

export const isValidRunState = (value) => {
  const validStates = [
    "queued",
    "in_progress",
    "requires_action",
    "cancelling",
    "cancelled",
    "failed",
    "completed",
    "expired",
    "N/A",
  ];

  return validStates.includes(value);
};
