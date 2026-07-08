import { useContext } from "react";
import { getDay } from "../common/date";
import { UserContext } from "../App";
import toast from "react-hot-toast";
import CommentsField from "./CommentsField";
import { useState } from "react";
import { BlogContext } from "../pages/BlogPage";
import axios from "axios";

const CommentCard = ({index, leftVal, commentData}) => {

    let {commented_by : {personal_Info : {profile_img, fullname, username : commented_by_username}}, commentedAt, comment, _id, children} = commentData;

    let {blog, blog : {Comments, Comments : {results : commentsArr}, author_id : {personal_Info : {username : blog_author}}, activity, activity : {total_comment ,total_parent_comments}}, setBlog, setTotalParentComments} = useContext(BlogContext);

    const [isReplying, setIsReplying] = useState(false);

    const getParentIndex = () => {
        let startingPoint = index - 1;

        try{
            while(commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel){
                startingPoint--;
            }
        }catch{
            startingPoint = undefined;
        }

        return startingPoint;
    }

    let { userAuth : {token, username} } = useContext(UserContext);

    const handleReplyClick = () => {
        if(!token){
            return toast.error("login first to leave a reply");
        }

        setIsReplying(preval => !preval);
    }

    const removeCommentsCards = (startingPoint, isDelete = false) => {

        if(commentsArr[startingPoint]){

            while(commentsArr[startingPoint].childrenLevel > commentData.childrenLevel){
                commentsArr.splice(startingPoint, 1);

                if(!commentsArr[startingPoint]){
                    break;
                }
            }
            
        }

        if(isDelete){
            let parentIndex = getParentIndex();

            if(parentIndex != undefined){
                commentsArr[parentIndex].children = commentsArr[parentIndex].children.filter(child => child != _id)
                if(!commentsArr[parentIndex].children.length){
                    commentsArr[parentIndex].isReplyLoaded = false;
                }
            }

            commentsArr.splice(index, 1);
        }

        if(commentData.childrenLevel == 0 && isDelete){
            setTotalParentComments(preVal => preVal - 1);
        }

        setBlog({...blog, comments : {results : commentsArr}, activity : {...activity, total_comment : total_comment - 1, total_parent_comments : total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1 : 0)}});
    }

    const hideReplies = () => {
        commentData.isReplyLoaded = false;
        removeCommentsCards(index+1);
    }

    const LoadedReplies = ({skip = 0, currentIndex = index}) => {

        if(commentsArr[currentIndex].children.length){

            hideReplies();

            axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/comment/get-replies", {_id : commentsArr[currentIndex]._id, skip}).then(({data : {replies}}) => {
                commentsArr[currentIndex].isReplyLoaded = true;

                for(let i = 0; i<replies.length; i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;

                    commentsArr.splice(currentIndex + i + skip +1, 0, replies[i]);
                }

                setBlog({...blog, Comments : {...Comments, results : commentsArr}})

            }).catch(err => {
                console.log(err);
            })
        }
    }

    const handleDelete = (e) => {
        e.target.setAttribute("disabled", true);

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/comment/delete-comment", {_id}, {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        }).then(() => {
            e.target.removeAttribute("disabled");
            removeCommentsCards(index+1, true);
        })


    }

    const LoadMoreReplies  = () => {
        let parentIndex = getParentIndex();

        let button = <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={()=>LoadedReplies({skip : index - parentIndex, currentIndex : parentIndex})}>Load More Replies</button>;

        if(commentsArr[index+1]){
            if(commentsArr[index+1].childrenLevel > commentsArr[index].childrenLevel){
                if((index - parentIndex) < commentsArr[index].children.length){
                    return button;
                }
                
            }
        }else{
            if(parentIndex){
                if((index-parentIndex) < commentsArr[parentIndex].children.length){
                    return button;
                }
            }
        }
    }

    return (
        <div className="w-full" style={{paddingLeft : `${leftVal * 10}px`}}>
            <div className="my-5 p-6 rounded-md border border-grey">
                <div className="flex gap-3 items-center mb-8">
                    <img src={profile_img} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">{fullname} @{commented_by_username}</p>
                    <p className="min-w-fit">{getDay(commentedAt)}</p>
                </div>

                <p className="font-gelasio text-xl ml-3">{comment}</p>

                <div className="flex gap-5 items-center mt-5">

                    {
                        commentData.isReplyLoaded ? 
                        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}><i className="fi fi-rs-comment-dots"></i>Hide Reply</button> : <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={LoadedReplies}><i className="fi fi-rs-comment-dots"></i>{children.length} Reply</button>
                    }

                    <button className="underline" onClick={handleReplyClick}>Reply</button>

                    {
                        username == commented_by_username || username == blog_author ? 
                        <button className="p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center" onClick={handleDelete}><i className="fi fi-rr-trash pointer-events-none"></i></button> : ""
                    }
                </div>

                {
                    isReplying ? 
                    <div className="mt-8">
                        <CommentsField action="reply" index={index} replyingTo={_id} setIsReplying={setIsReplying}/>
                    </div> : ""
                }
            </div>

                <LoadMoreReplies/>

        </div>
    )
}

export default CommentCard;