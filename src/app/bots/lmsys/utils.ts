export function generateSessionHash() {
  // https://stackoverflow.com/a/12502559/325241
  return Math.random().toString(36).substring(2)
}
