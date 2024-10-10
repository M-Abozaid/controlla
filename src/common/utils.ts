export const sleep = (ms: number): Promise<void> => {
  return new Promise(r => {
    setTimeout(r, ms)
  })
}

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export const ytVideoOrShortsRegex = /youtube\.com\/(?:shorts\/|watch\?v=)(.{11})/

export const getVideoIdFromURL = (url: string): string => {
  if (url.startsWith('/watch') || url.startsWith('/shorts')) {
    url = 'https://www.youtube.com' + url
  }
  const match = ytVideoOrShortsRegex.exec(url)
  if (match) {
    return match[1]
  }
  return null
}
;(window as any).getVideoIdFromURL = getVideoIdFromURL
