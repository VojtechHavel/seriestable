import {Item, Menu, Separator, Submenu} from "react-contexify";
import * as React from "react";
import {Tag, Video, VideoListType} from "../../types/generatedTypes";
import {MenuItemEventHandler} from "react-contexify/lib/types";
import {TagIconAndName} from "../util/TagIconAndName";

export interface VideoTileMenuProps {
    markAsNotStarted: (videoId: string) => any;
    stopRecommending: (videoId: string) => any;
    markAsFinished: (videoId: string) => any;
    addNewTag: () => any;
    addTagToVideo: (video: string, tag: string) => any;
    removeTagFromVideo: (video: string, tag: string) => any;
    video: Video,
    videoListType: VideoListType,
    tags: Tag[]
}

export const VideoTileMenu = (props: VideoTileMenuProps) => {
    const address = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
    return (
    <Menu id={"menu_id"+props.video.youtubeId}>
        <Item className={"new-tab-link"}><a target="_blank" href={address+"/youtube/videos/"+props.video.youtubeId}>Open in new tab</a></Item>
        <Separator />
        {markAsFinishedItem(props)}
        {markAsNotStarted(props)}
        {props.videoListType===VideoListType.RECOMMENDED?stopRecommending(props):null}
        {copyVideoUrlItem(props)}
        <Separator />
        <AddTagSubmenu {...props}/>
        <RemoveTagSubmenu {...props}/>
    </Menu>
)};

const markAsFinishedItem = (props: VideoTileMenuProps) => {
        return (<Item
            onClick={()=>props.markAsFinished(props.video.youtubeId)}
            disabled={props.video.finishedAt!==null}
        >Mark as Finished</Item>)
};

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const copyVideoUrlItem = (props: VideoTileMenuProps) => {
        return (<Item
            onClick={()=>copyToClipboard("https://www.youtube.com/watch?v="+props.video.youtubeId)}
        >Copy video URL</Item>)
};

const markAsNotStarted = (props: VideoTileMenuProps) => {
        return (<Item
            onClick={()=>props.markAsNotStarted(props.video.youtubeId)}
            disabled={(!props.video.timeWatched && props.video.finishedAt===null)}
        >Mark as Not Started</Item>)
};

const stopRecommending = (props: VideoTileMenuProps) => {
        return (<Item
            onClick={()=>props.stopRecommending(props.video.youtubeId)}
        >Stop recommending</Item>)
};

const AddTagSubmenu = (props: VideoTileMenuProps) => (
    <Submenu label="Add tag">
        {props.tags.map((tag: Tag)=>{
            return <Item
                key={"submenu-tag-"+tag.name}
                onClick={(e: MenuItemEventHandler)=>{props.addTagToVideo(props.video.youtubeId, tag.name)}}
                disabled={props.video.tags.some(existingTag =>{
                    return existingTag === tag.name
                })}
            ><TagIconAndName tag={tag}/></Item>
        })}
        <Item onClick={props.addNewTag}>Add new tag</Item>
    </Submenu>
);



const RemoveTagSubmenu = (props: VideoTileMenuProps) => (
        <Submenu label="Remove tag" disabled={props.video.tags.length===0}>
            {props.tags.map((tag: Tag)=>{
                return <Item
                    key={"submenu-tag-"+tag.name}
                    onClick={(e: MenuItemEventHandler)=>{props.removeTagFromVideo(props.video.youtubeId, tag.name)}}
                    disabled={!props.video.tags.some(existingTag =>{
                        return existingTag === tag.name
                    })}
                ><TagIconAndName tag={tag}/></Item>
            })}
        </Submenu>
);