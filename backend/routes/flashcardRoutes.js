const express = require('express');
const { createSet, editCard, deleteCard, favoriteCard } = require('../controllers/flashcardController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth, createSet);
router.put('/edit', auth, editCard);
router.delete('/delete/:setId/:cardId', auth, deleteCard);
router.put('/favorite/:setId/:cardId', auth, favoriteCard);

module.exports = router;