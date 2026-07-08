import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import defaultBanner from "../images/defaultBanner.png";
// import uploadImage from "../common/aws"

const uploadImageByURL = (url) =>{
    return new Promise((resolve, reject) => {
        if (url) {
            resolve({
                success: 1,
                file: {
                    url: url // Make sure 'url' is valid and passed correctly
                }
            });
        } else {
            reject({
                success: 0,
                message: "Image URL not provided or invalid."
            });
        }
    });
}

const uploadImgByFile = (file) => {
    return defaultBanner(file).then(url => {
        if(url){
            return {
                success : 1,
                file : {url}
            }
        }
    })
}

export const tools = {
    embed : Embed,
    list : {
        class : List,
        inlineToolbar : true
    },
    image : {
        class : Image,
        config : {
            uploader : {
                uploadByUrl  : uploadImageByURL,
                uploadByFile : uploadImgByFile
            }
        }
    },
    header : {
        class : Header,
        config : {
            placeholder : "Type Heading.....",
            levels : [2,3],
            defaultLevel : 2
        }
    },
    quote : {
        class : Quote,
        inlineToolbar : true
    },
    marker : Marker,
    inlineCode : InlineCode
}
