export const formatCount = (count: number): string =>{
    if(!count){
        return "0";
    }
    const BILLION = 1000000000;
    const MILLION = 1000000;
    const THOUSAND = 1000;

    if(count>BILLION){
        return (count/BILLION).toFixed(1) +"B"
    }else if(count>MILLION){
        return (count/MILLION).toFixed(1) +"M"
    }else if(count>THOUSAND){
        return (count/THOUSAND).toFixed(1) +"k"
    }else{
        return count+""
    }
};