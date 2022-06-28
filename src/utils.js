export const normalizeChildren = (children) => (Array.isArray(children) ? children : [children])
export const isRoute = (el, simple = false) => (
  el
  && typeof el === 'object'
  && el._isRoute
  && (simple ? true : el.path)
)
export const logMistake = (...text) => console.error('solid-js-router -', ...text)
export const invariant = (value, error) => {
  if ([null, undefined].indexOf(value) !== -1) {
    throw new Error(error)
  } else {
    return value
  }
}