import express from "express"
import userControllers from "../controllers/UserControllers.js"
const userRouter = express.Router()

userRouter.get("/user/all", userControllers.getAllUsers)
userRouter.post("/user/signup", userControllers.signup)
userRouter.post("/user/login", userControllers.login)
userRouter.get("/user/:id", userControllers.getUserProfile)
userRouter.put("/user/update/:id", userControllers.updateUserProfile)
userRouter.delete("/user/delete/:id", userControllers.deleteUserProfile)

export default userRouter;