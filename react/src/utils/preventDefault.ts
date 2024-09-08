export function preventDefault(callback) {
    return (e)=>{
        console.log("call preventDefault", e);

        callback(e);
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
    }
}