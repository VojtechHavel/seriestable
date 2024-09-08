function getPath(pathname){
    const path = pathname==="/"?"/panels":pathname.replace(/\/$/, "");
    return path;
}


export default getPath;