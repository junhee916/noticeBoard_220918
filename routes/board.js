const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');
const boardCtrl = require('../controllers/boardController')
// get boards
router.get('/', checkAuth, boardCtrl.getAll)
// get board
router.get('/:boardId', checkAuth, boardCtrl.get)
// save board
router.post('/save', checkAuth, boardCtrl.save)
// update board
router.post('/update/:boardId', checkAuth, boardCtrl.update)
// delete boards
router.post('/delete', checkAuth, boardCtrl.deleteAll)
// delete board
router.post("/delete/:boardId", checkAuth, boardCtrl.delete)
module.exports = router;
