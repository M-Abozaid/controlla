const getYTVideos = async (
  ids: string[]
): Promise<gapi.client.youtube.VideoListResponse> => {
  const response = await fetch(
    `http://localhost:36168/videos?ids=${(ids as unknown) as string}`
  )
  const videosResp = await response.json()
  return videosResp as gapi.client.youtube.VideoListResponse
}

export default getYTVideos
