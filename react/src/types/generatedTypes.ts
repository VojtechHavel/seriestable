/* tslint:disable */
// Generated using typescript-generator version 2.6.433 on 2023-01-30 22:04:58.

export interface Tag extends PageInformation {
    name: string;
    key: string;
    icon: string;
    color: string;
}

export interface Category {
    name: string;
    key: string;
    channels: Channel[];
}

export interface ChannelVideosLoad {
    videoCount: number;
    loadFinished: boolean;
}

export interface Filter {
    notStarted: boolean;
    started: boolean;
    finished: boolean;
    searchByTitle: boolean;
    searchByNote: boolean;
    searchByDescription: boolean;
    sortBy: SortByOption;
    title: string;
    includeTags: string[];
    excludeTags: string[];
}

export interface VideoListPageResponse {
    videos: Video[];
    filter: Filter | null;
    information: PageInformation;
}

export interface PageInformation {
}

export interface Channel extends PageInformation {
    youtubeId: string;
    title: string;
    image: string;
    allCategories: string[];
    presentCategories: string[];
    totalVideos: number;
    loaded: boolean;
}

export interface CategoriesPageResponse {
    recommendedChannels: Channel[];
    categories: Category[];
}

export interface User {
    name: string | null;
    email: string | null;
    apiToken: string | null;
    role: string | null;
    hasPassword: boolean | null;
    pageSize: number;
    rememberFilters: boolean;
}

export interface UserSettings {
    user: User;
    tags: Tag[];
}

export interface Video {
    youtubeId: string;
    thumbnailUrl: string;
    title: string;
    description: string;
    note: string;
    publishedAt: number;
    duration: number;
    timeWatched: number;
    tags: string[];
    channelTitle: string;
    channelYoutubeId: string;
    lastWatchedAt: number;
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    commentCount: number;
    added: number;
    watchedAt: number | null;
    bookmarks: Bookmark[];
    finishedAt: number | null;
}

export interface Bookmark {
    timeInSeconds: number;
    name: string;
}

export enum VideoListType {
    INITIAL = "INITIAL",
    CHANNEL = "CHANNEL",
    TAG = "TAG",
    CATEGORY = "CATEGORY",
    CONTINUE_WATCHING = "CONTINUE_WATCHING",
    NOTES = "NOTES",
    NEW = "NEW",
    RECOMMENDED = "RECOMMENDED",
}

export enum SortByOption {
    NEWEST = "NEWEST",
    OLDEST = "OLDEST",
    SHORTEST = "SHORTEST",
    LONGEST = "LONGEST",
    SHORTEST_REMAINING = "SHORTEST_REMAINING",
    LONGEST_REMAINING = "LONGEST_REMAINING",
    ADDED_FIRST = "ADDED_FIRST",
    ADDED_LAST = "ADDED_LAST",
    WATCHED_FIRST = "WATCHED_FIRST",
    WATCHED_LAST = "WATCHED_LAST",
    MOST_VIEWS = "MOST_VIEWS",
    LEAST_VIEWS = "LEAST_VIEWS",
    MOST_LIKES = "MOST_LIKES",
    MOST_DISLIKES = "MOST_DISLIKES",
    MOST_COMMENTS = "MOST_COMMENTS",
    HIGHEST_LIKES_TO_DISLIKES_RATIO = "HIGHEST_LIKES_TO_DISLIKES_RATIO",
    HIGHEST_COMMENTS_TO_VIEWS_RATIO = "HIGHEST_COMMENTS_TO_VIEWS_RATIO",
    HIGHEST_LIKES_TO_VIEWS_RATIO = "HIGHEST_LIKES_TO_VIEWS_RATIO",
    HIGHEST_DISLIKE_TO_VIEWS_RATIO = "HIGHEST_DISLIKE_TO_VIEWS_RATIO",
}

export enum VideoState {
    NOT_STARTED = "NOT_STARTED",
    STARTED = "STARTED",
    FINISHED = "FINISHED",
}

export enum VideoSearchBy {
    TITLE = "TITLE",
    NOTE = "NOTE",
    DESCRIPTION = "DESCRIPTION",
}

export enum InclusionType {
    INCLUDE = "INCLUDE",
    EXCLUDE = "EXCLUDE",
}
