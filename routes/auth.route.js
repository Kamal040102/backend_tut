const { signup, login, logout, forgetPassword, resetPassword, changePassword } = require('../controllers/auth.controller')
const router = require('express').Router();
const { isLoggedIn } = require('../middlewares/auth.middleware')
 
router.post('/signup', signup)
router.post('/login', login)
router.get('/logout',isLoggedIn, logout)   
router.post('/forgetpassword', forgetPassword)
router.post('/resetpassword/:token', resetPassword)
router.put('/changepassword', isLoggedIn, changePassword)

module.exports = router;