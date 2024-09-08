import {createSelector} from 'reselect'
import {AppState} from "./rootReducer";
import {Filter, SortByOption, Video, VideoListType} from "../types/generatedTypes";

const getFilter = (state: AppState) => state.filterState;
const getVideos = (state: AppState) => state.videoListState.videos;
const getVideoListType = (state: AppState) => state.videoListState.videoListType;

export const getVisibleVideos = createSelector(
    [getFilter, getVideos, getVideoListType],
    (filter: Filter, videos: Video[], videoListType: VideoListType) => {
        let visibleVideos: Video[] = [];
        if (filter.started && filter.notStarted && filter.finished) {
            visibleVideos = videos;
        } else {
            visibleVideos = videos.filter(video => {
                if (video.finishedAt !== null && filter.finished) {
                    return true;
                } else if (filter.started && video.timeWatched > 0 && !(video.finishedAt !== null)) {
                    return true;
                } else if ((!(video.timeWatched > 0)) && !(video.finishedAt !== null) && filter.notStarted) {
                    return true;
                }
                return false
            });
        }

        if (filter.includeTags.length > 0) {
            visibleVideos = visibleVideos.filter(video => {
                return video.tags.some(tag => filter.includeTags.includes(tag))
            })
        }

        if (filter.excludeTags.length > 0) {
            visibleVideos = visibleVideos.filter(video => {
                return !video.tags.some(tag => filter.excludeTags.includes(tag))
            })
        }

        if (videoListType !== VideoListType.RECOMMENDED) {
            const compareFn = sortBy(filter.sortBy);

            visibleVideos = visibleVideos.sort(compareFn);
        }

        if (filter.title !== "" && (filter.searchByTitle || filter.searchByNote || filter.searchByDescription)) {
            visibleVideos = visibleVideos.filter(video => {
                if (filter.searchByTitle && video.title.toLowerCase().includes(filter.title.toLowerCase())) {
                    return true
                }
                if (filter.searchByNote && video.note && video.note.toLowerCase().includes(filter.title.toLowerCase())) {
                    return true
                }
                if (filter.searchByDescription && video.description && video.description.toLowerCase().includes(filter.title.toLowerCase())) {
                    return true
                }
                return false;
            })
        }

        console.log("visibleVideos", visibleVideos);
        return {videos: visibleVideos};
    }
);

function sortBy(sortByOption: SortByOption) {
    return (a: Video, b: Video): number => {
        if (sortByOption === SortByOption.OLDEST) {
            return a.publishedAt - b.publishedAt;
        }
        if (sortByOption === SortByOption.NEWEST) {
            return b.publishedAt - a.publishedAt;
        }
        if (sortByOption === SortByOption.SHORTEST) {
            return a.duration - b.duration;
        }
        if (sortByOption === SortByOption.LONGEST) {
            return b.duration - a.duration;
        }
        if (sortByOption === SortByOption.SHORTEST_REMAINING) {
            return (a.duration - a.timeWatched) - (b.duration - b.timeWatched);
        }
        if (sortByOption === SortByOption.LONGEST_REMAINING) {
            return (b.duration - b.timeWatched) - (a.duration - a.timeWatched)
        }
        if (sortByOption === SortByOption.ADDED_FIRST) {
            return b.added - a.added;
        }
        if (sortByOption === SortByOption.ADDED_LAST) {
            return a.added - b.added;
        }
        if (sortByOption === SortByOption.MOST_VIEWS) {
            return b.viewCount - a.viewCount;
        }
        if (sortByOption === SortByOption.LEAST_VIEWS) {
            return a.viewCount - b.viewCount;
        }
        if (sortByOption === SortByOption.WATCHED_FIRST) {
            return b.lastWatchedAt - a.lastWatchedAt;
        }
        if (sortByOption === SortByOption.WATCHED_LAST) {
            return a.lastWatchedAt - b.lastWatchedAt;
        }
        if (sortByOption === SortByOption.MOST_LIKES) {
            return b.likeCount - a.likeCount;
        }
        if (sortByOption === SortByOption.MOST_DISLIKES) {
            return b.dislikeCount - a.dislikeCount;
        }
        if (sortByOption === SortByOption.MOST_COMMENTS) {
            return b.commentCount - a.commentCount;
        }
        if (sortByOption === SortByOption.HIGHEST_LIKES_TO_DISLIKES_RATIO) {
            if (!a.dislikeCount) {
                return 1;
            }
            if (!b.dislikeCount) {
                return -1;
            }
            return b.likeCount / b.dislikeCount - a.likeCount / a.dislikeCount;
        }
        if (sortByOption === SortByOption.HIGHEST_COMMENTS_TO_VIEWS_RATIO) {
            if (!a.viewCount) {
                return 1;
            }
            if (!b.viewCount) {
                return -1;
            }
            return b.commentCount / b.viewCount - a.commentCount / a.viewCount;
        }
        if (sortByOption === SortByOption.HIGHEST_LIKES_TO_VIEWS_RATIO) {
            if (!a.viewCount) {
                return 1;
            }
            if (!b.viewCount) {
                return -1;
            }
            return b.likeCount / b.viewCount - a.likeCount / a.viewCount;
        }
        if (sortByOption === SortByOption.HIGHEST_DISLIKE_TO_VIEWS_RATIO) {
            if (!a.viewCount) {
                return 1;
            }
            if (!b.viewCount) {
                return -1;
            }
            return b.dislikeCount / b.viewCount - a.dislikeCount / a.viewCount;
        }
        return 0;
    };
}