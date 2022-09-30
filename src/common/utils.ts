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
  const match = ytVideoOrShortsRegex.exec(url)
  if (match) {
    return match[1]
  }
  return null
}
;(window as any).getVideoIdFromURL = getVideoIdFromURL
