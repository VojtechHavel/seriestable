/**
 * @author Vojtech Havel
 * @since April, 2018
 */

const addProtocol = (url)=>{
    if(url) {
        if (!url.startsWith("http") && !url.startsWith("//")) {
            url = "//" + url
        }
    }else{
        url = ""
    }
    return url;
};

export default addProtocol