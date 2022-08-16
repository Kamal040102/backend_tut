const { getUserByID, updateUserByID, deleteUserByID, getAllUser } = require('../controllers/user.controller')
const { isAdmin, isLoggedIn } = require('../middlewares/auth.middleware')
const router = require('express').Router()

router.get('/:id',isLoggedIn, getUserByID).put('/:id',isLoggedIn, updateUserByID).delete('/:id',isLoggedIn, deleteUserByID)
router.get('/',isAdmin, getAllUser)

module.exports = router;