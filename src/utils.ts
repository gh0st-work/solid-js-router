import {Dictionary} from "./types";

export const normalizeChildren = (children) => (Array.isArray(children) ? children : [children])
export const logMistake = (...text: Array<string>): void => console.error('solid-js-router -', ...text)
export const invariant = (
  value: any,
  error: string,
): any => {
  if ([null, undefined].indexOf(value) !== -1) {
    throw new Error(error)
  }
  return value
}
export const isDictsSame = (obj1: Dictionary<any>, obj2: Dictionary<any>): boolean => JSON.stringify(obj1) === JSON.stringify(obj2)
