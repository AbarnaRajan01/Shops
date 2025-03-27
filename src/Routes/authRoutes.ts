import { getLoggedInUsersCount, login, register, resendOTP } from "../Controllers/authController";
import { getCategoryCounts } from "../Controllers/shopController";


const express = require('express')
const router = express.Router();


router.post('/register',register);
router.post('/login',login)
router.post('/loggedCount',getLoggedInUsersCount)
router.post('/resendOtp',resendOTP)
router.get('/count',getCategoryCounts)


export default router;
