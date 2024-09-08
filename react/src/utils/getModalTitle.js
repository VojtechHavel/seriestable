import PANEL_TYPES_DEFINITIONS from "../config/PanelTypesDefinitions";

export default function getModalTitle(title, type, suffix){
    let typeName = PANEL_TYPES_DEFINITIONS.get(type).title;
    // console.log("type name", typeName);
    if(title){
       typeName = typeName.toLowerCase();
        return title +" " + typeName.toLowerCase() + " " +suffix
    }else{
        return typeName +" "+ suffix;
    }
}