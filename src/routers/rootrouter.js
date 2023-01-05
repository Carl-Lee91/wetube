import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userControllers";
import { home, search } from "../controllers/videoControllers";

const rootrouter = express.Router();

rootrouter.get("/", home);
rootrouter.route("/join").get(getJoin).post(postJoin);
rootrouter.route("/login").get(getLogin).post(postLogin);
rootrouter.get("/search", search);

export default rootrouter;