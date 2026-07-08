import { useContext, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { UserContext } from "../App";
import { BlogContext } from "../pages/BlogPage";
import axios from 'axios';


const CommentsField = ({action, index = undefined, replyingTo = undefined, setIsReplying}) =>{
    let {blog, blog : {_id, author_id : {_id : blog_author}, activity, activity : {total_comment, total_parent_comments}, Comments, Comments : {results : commentArr}}, setBlog, setTotalParentComments} = useContext(BlogContext);

    let {userAuth  : {token, username, fullname, profile_img}} = useContext(UserContext);

    const [comment, setComment] = useState("");

    const handleComment = () => {
        if(!token){
            return toast.error("login first to leave a comment");
        }

        if(!comment.length){
            return toast.error("write something to leave a comment...");
        }

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/comment/add-comment", {
            _id, comment, blog_author, replying_to : replyingTo
        }, {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        }).then(({data}) => {

            setComment("");

            data.commented_by = {personal_Info: {username, profile_img, fullname}};

            let newCommentArr;


            if(replyingTo){

                commentArr[index].children.push(data._id);
                data.childrenLevel = commentArr[index].childrenLevel + 1;

                data.parentIndex = index;
                commentArr[index].isReplyLoaded = true;

                commentArr.splice(index + 1, 0, data);

                newCommentArr = commentArr;

                setIsReplying(false);

            }else{

                data.childrenLevel = 0;
                newCommentArr = [data, ...commentArr];
            }

            let parentCommentIncrementVal = replyingTo ? 0 : 1;

            setBlog({...blog, Comments : {...Comments, results : newCommentArr}, activity : {...activity, total_comment : total_comment + 1, total_parent_comments : total_parent_comments + parentCommentIncrementVal}});

            setTotalParentComments(preVal => preVal + parentCommentIncrementVal);

        }).catch(err => {
            console.log(err);
            toast.error("error while leaving a comment");

        });
    }

    return (
        <>
            <Toaster/>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment..." className="input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto"></textarea>
            <button className="btn-dark mt-5 px-10" onClick={handleComment}>{action}</button>
        </>
    )
}

export default CommentsField;