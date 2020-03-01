const getYTVideos = async (ids): Promise<gapi.client.youtube.VideoListResponse> => {

    const response = await fetch(`http://localhost:36168/videos?ids=${ids}`);
    const videosResp = await response.json();
    return <gapi.client.youtube.VideoListResponse>videosResp;

}


export default getYTVideos