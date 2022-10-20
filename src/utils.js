export const normalizeChildren = (children) => (Array.isArray(children) ? children : [children])
export const logMistake = (...text) => console.error('solid-js-router -', ...text)
export const invariant = (value, error) => {
  if ([null, undefined].indexOf(value) !== -1) {
    throw new Error(error)
  } else {
    return value
  }
}
export const isObjectsSame = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2)
