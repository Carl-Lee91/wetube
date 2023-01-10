import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import { application } from "express";

export const getJoin = (req, res) => res.render("join", {pageTitle:"Join"});
export const postJoin = async(req, res) => {
    const {name, email, username, password, password2, location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("Join", {pageTitle, errorMessage:"Password confirmation does not match."}); 
    }
    const exists = await User.exists({$or:[{username}, {email}]});
    if(exists){
        return res.status(400).render("Join", {pageTitle, errorMessage:"This username or email is already taken."});
    }
    try {
        await User.create({
        name,
        email,
        username, 
        password, 
        password2,
        location,
    });
    return res.redirect("/login")
    } catch (error) {
        return res.status(400).render("join", {pageTitle, errorMessage:error._message,})
    } 
}
export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});
export const postLogin = async(req, res) => {
    const { username, password } = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username, socialOnly:false});
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage: "An account with this username does not exists."})
    } 
    const fine = await bcrypt.compare(password, user.password);
    if(!fine){
        return res.status(400).render("login", {pageTitle, errorMessage: "Wrong password"})
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = `https://github.com/login/oauth/authorize`
    const config = {
        client_id:process.env.GH_CLIENT,
        allow_signup:false,
        scope:"read:user user:email"
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl)
}

export const finishGithubLogin = async(req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id:process.env.GH_CLIENT,
        client_secret:process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString()
    const finalUrl = `${baseUrl}?${params}`
    const tokenRequest = await (await fetch(finalUrl, {
        method:"POST",
        headers:{
            Accept: "application/json"
        }
    })).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();
        const emailData = await (await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json()
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true)
        if (!emailObj){
            return res.redirect("/login")
        }
        let user = await User.findOne({email: emailObj.email})
        if(!user){
            const user = await User.create({
                avatarUrl:userData.avatar_url,
                name:userData.name ? userData.name : userData.login,
                email:emailObj.email,
                username:userData.login, 
                password:"", 
                socialOnly:true,
                location:userData.location,
        })
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/")    
    }else {
        return res.redirect("/login")
    }
}

///카카오 로그인 만들기
export const startKakaoLogin = (req, res) => {
    const baseUrl = `https://kauth.kakao.com/oauth/authorize`
    const config = {
        
    }
}

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    res.render("edit-profile", {pageTitle:"Edit Profile"})
}

export const postEdit = async (req, res) => {
    const { session: {user:{_id}}, body :{name, email, username, location} } = req
    const updatedUser = await User.findByIdAndUpdate(_id, {
        name,
        email,
        username,
        location,
    }, {new:true})
    ////중복된 자료들 안된다고 하는거 exist함수(join) 연계하여 하기(form의 정보가 session의 user정보와 같은지 확인 => body와 비교하면 됨 세션하고 ㅇㅇ)
    req.session.user = updatedUser;
    res.render("edit-profile")
}

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly === true) {
        return res.redirect("/")
    }
    return res.render("users/change-password", {pageTitle:"Change Password"})
}

export const postChangePassword = async (req, res) => {
    const { session: {user:{_id}}, body :{oldPassword, newPassword, newPasswordConfirmation} } = req
    const user = await User.findById(_id)
    const fine = await bcrypt.compare(oldPassword, user.password)
    if(!fine){
        return res.status(400).render("users/change-password", {pageTitle:"Change Password", errorMessage: "The current password is incorrect"})
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password", {pageTitle:"Change Password", errorMessage: "The password does not match the confirmation"})
    }
    user.password = newPassword
    await user.save()
    return res.redirect("/users/logout")
}

export const see = (req, res) => res.send("See");