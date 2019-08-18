export function isPromise (p) {
  return Object.prototype.toString.call(p) === '[object Promise]'
}