const router = require('express').Router();
const ctrl = require('../controllers/datasetController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', auth, upload.single('file'), ctrl.uploadDataset);
router.get('/', auth, ctrl.getDatasets);
router.get('/:id', auth, ctrl.getDataset);
router.get('/:id/preview', auth, ctrl.getDatasetPreview);
router.delete('/:id', auth, ctrl.deleteDataset);

module.exports = router;
