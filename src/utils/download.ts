export function toMP4(stream: any, title: string, mimeType: string) {
  const file = window.URL.createObjectURL(new File([stream], `${title}.mp4`))
  const link = document.createElement('a')
  link.href = file
  link.setAttribute('download', `${title}.mp4`)
  document.body.appendChild(link)
  link.click()
}
