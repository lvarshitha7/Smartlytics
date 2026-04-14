const router = require('express').Router();
const ctrl = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.createDashboard);
router.get('/', auth, ctrl.getDashboards);
router.get('/:id', auth, ctrl.getDashboard);
router.put('/:id', auth, ctrl.updateDashboard);
router.delete('/:id', auth, ctrl.deleteDashboard);
router.post('/:id/compute', auth, ctrl.computeWidgets);

module.exports = router;
