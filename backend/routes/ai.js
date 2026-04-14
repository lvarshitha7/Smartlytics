const router = require('express').Router();
const ctrl = require('../controllers/aiController');
const auth = require('../middleware/auth');

router.post('/generate-dashboard', auth, ctrl.generateDashboard);
router.post('/suggestions', auth, ctrl.generateSuggestions);
router.post('/ask', auth, ctrl.askQuestion);
router.get('/models', auth, ctrl.listModels);

module.exports = router;
