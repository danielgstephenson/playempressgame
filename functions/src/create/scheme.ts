import { Scheme } from "../types";
import { createId } from "./id";

export function createScheme(rank: number): Scheme {
  return { id: createId(), rank }
}