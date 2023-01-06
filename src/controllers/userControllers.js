import User from "../models/User";
import bcrypt from "bcrypt";

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
    const user = await User.findOne({username});
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
export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out");
export const see = (req, res) => res.send("See");