import i18n from "../../i18n";

export const getLanguage = () => {
    return i18n.language;
    }

export const seperator = () => {
    if(getLanguage() === "ar" || getLanguage() === "en"){
        return ".";
    }
    else{
        return ",";
    }
}
