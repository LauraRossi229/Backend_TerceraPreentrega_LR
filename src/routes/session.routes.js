import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messagesError.js";

import { renderLoginView, postLogin, postRegister, logout, getTestJWT, getCurrent, getGithubCallback, getGithub} from "../controller/session.controller.js";

const sessionRouter = Router()

sessionRouter.get('/login', renderLoginView);

sessionRouter.post('/login', passport.authenticate('login'), postLogin)


sessionRouter.post('/register', passport.authenticate('register'), postRegister)

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), getGithub)

sessionRouter.get('/githubCallback', passport.authenticate('github'), getGithubCallback)
sessionRouter.get('/logout', logout)

//Verifica que el token enviado sea valido (misma contraseña de encriptacion)
sessionRouter.get('/testJWT', passport.authenticate('jwt', { session: false }, getTestJWT))

sessionRouter.get('/current', passportError('jwt'), authorization('user'), getCurrent )

export default sessionRouter