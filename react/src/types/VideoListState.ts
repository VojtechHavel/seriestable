import {PageInformation, Video, VideoListType} from "./generatedTypes";
import State from "./State";

export interface VideoListState {
    videos: Video[],
    state: State,
    videoListType: VideoListType,
    id: string,
    information: PageInformation
}