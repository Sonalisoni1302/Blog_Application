import { useContext, useRef } from "react";
import AnimationWrapper from "../common/pageAnimation";
import InputBox from "./InputBox";
import {toast, Toaster} from "react-hot-toast";
import { UserContext } from "../App";
import axios from "axios";

const ChangePassword = (e) => {

    let changePassword = useRef();

    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    let { userAuth : { token }} = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();

        let form = new FormData(changePassword.current);
        let formData = { };

        for(let [key, value] of form.entries()){
            formData[key] = value;
        }

        let {currentPassword, newPassword} = formData;

        if(!currentPassword.length || !newPassword.length){
            return toast.error("fill all the inputs");
        }

        if(!passwordRegex.test(currentPassword) || !passwordRegex.test(newPassword)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters.")
        }

        e.target.setAttribute("disable", true);
        let loadingToast = toast.loading("Updating...");

        axios.post(process.env.REACT_APP_SERVER_DOMAIN + "/user/change-password", formData, {
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        }).then(() => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disable");
            return toast.success("Password Updated");
        }).catch(( {response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disable");
            return toast.error(response.data.error);
        })
    }

    return(
        <>
            <AnimationWrapper>
                <Toaster/>
                <form ref={changePassword}>
                    <h1 className="max-md:hidden">Change Password</h1>

                    <div className="py-10 w-full md:max-w-[400px]">
                        <InputBox name="currentPassword" type="password" className="profile-edit-input"  placeholder="Current Password" icon="fi-rr-unlock"/>
                        <InputBox name="newPassword" type="password" placeholder="New Password" className="profile-edit-input" icon="fi-rr-unlock"/>

                        <button className="btn-dark px-10" type="submit" onClick={handleSubmit}>Change Password</button>
                     </div>
                </form>
            </AnimationWrapper>
        </>
    )
}

export default ChangePassword;