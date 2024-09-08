import {Video} from "../types/generatedTypes";
import { saveAs } from 'file-saver';

export const exportAsFile = (videos) =>{
    let exportText = "";
    videos.forEach((video: Video)=>{
        if(exportText!==""){
            exportText = exportText + "\n\n";
        }
        exportText = exportText +
            video.title + "\n" +
            "https://www.youtube.com/watch?v=" + video.youtubeId + "\n" +
            (video.note || "")
    });
    const blob = new Blob([exportText], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "videomark-export.txt");
};