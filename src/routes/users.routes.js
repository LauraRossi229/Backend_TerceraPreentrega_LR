import { Router } from "express";
import { userModel } from "../models/users.models.js";
import { deleteUser, getUser, getUserById, putUserById} from "../controller/users.controller.js";

const userRouter = Router()

userRouter.get('/', getUser)
userRouter.get('/:id', getUserById)

userRouter.put('/:id', putUserById)

userRouter.delete('/:id', deleteUser)

export default userRouter