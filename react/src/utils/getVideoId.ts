export const getVideoId = (videoIdOrUrl: string): string | null=> {

    console.log("videoIdOrUrl", videoIdOrUrl);
    const YOUTUBE_PREFIX = "https://youtu.be/";

    if(!videoIdOrUrl.includes(".") && !videoIdOrUrl.includes("localhost")){
        return  videoIdOrUrl;
    }

    if (videoIdOrUrl.startsWith(YOUTUBE_PREFIX)) {
        return videoIdOrUrl.replace(YOUTUBE_PREFIX, "");
    }
    console.log("here");

    if(videoIdOrUrl.includes("?") && videoIdOrUrl.includes("v=")){
        console.log("v here");

        const urlParams = new URLSearchParams(videoIdOrUrl.split("?")[1]);
        return urlParams.get('v');
    }else if(videoIdOrUrl.includes("localhost") || videoIdOrUrl.includes("videomark.app")){
        return videoIdOrUrl.substring(videoIdOrUrl.lastIndexOf("/")+1);
    }

    return null;
};