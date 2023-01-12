export function urlify(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, (url) => {
    return `<a href="${  url  }">${  url  }</a>`
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
