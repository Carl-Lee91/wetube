import express from "express";
import { getJoin, postJoin, getLogin, postLogin } from "../controllers/userControllers";
import { home, search } from "../controllers/videoControllers";
import { publicOnlyMiddleware } from "../middlewares";

const rootrouter = express.Router();

rootrouter.get("/", home);
rootrouter.route("/join").all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootrouter.route("/login").all(publicOnlyMiddleware).get(getLogin).post(postLogin);
rootrouter.get("/search", search);

export default rootrouter;