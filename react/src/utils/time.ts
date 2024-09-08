export const formatTime = (seconds: number) : string=>{
    seconds = Math.floor(seconds);
    if(seconds<60){
        return seconds+"";
    }

    let minutes = Math.floor(seconds/60);
    seconds = seconds%60;
    let secondsString:string = seconds+"";
    if(seconds<10){
        secondsString="0"+seconds;
    }

    if(minutes<60){
        return minutes+":"+secondsString;
    }

    const hours = Math.floor(minutes/60);
    minutes = minutes%60;
    let minutesString:string = minutes+"";
    if(minutes<10){
        minutesString="0"+minutes;
    }

    return hours+":"+minutesString+":"+secondsString;
};

export const MINUTE:number = 60;
export const HOUR:number = MINUTE*60;
export const DAY:number = HOUR*24;
export const WEEK:number = DAY*7;
export const MONTH:number = DAY*60;
export const YEAR:number = DAY*365;

export const getTimeAgo = (seconds: number): string=>{
    const today = new Date();
    const todaySeconds = today.getTime()/1000;
    const difference = Math.floor(todaySeconds-seconds);
    if(difference<0){
        return "just now";
    }
    if(difference<60){
        if(difference<2){
            return "1 second ago";
        }
        return difference + "seconds ago"
    }else if(difference<60*60){
        if(difference<2*MINUTE){
            return "1 minute ago";
        }
        return Math.floor(difference/MINUTE) + " minutes ago";
    }else if(difference<60*60*24){
        if(difference<2*HOUR){
            return "1 hour ago";
        }
        return Math.floor(difference/HOUR) + " hours ago";
    }else if(difference<60*60*24*7){
        if(difference<2*DAY){
            return "1 day ago";
        }
        return Math.floor(difference/DAY) + " days ago";
    }else if(difference<60*60*24*30){
        if(difference<2*WEEK){
            return "1 week ago";
        }
        return Math.floor(difference/WEEK) + " weeks ago";
    }else if(difference<YEAR){
        if(difference<2*MONTH){
            return "1 month ago";
        }
        return Math.floor(difference/MONTH) + " months ago";
    }else{
        if(difference<2*YEAR){
            return "1 year ago";
        }
        return Math.floor(difference/YEAR) + " years ago";
    }
};