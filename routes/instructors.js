const express = require('express');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  registerInstructor,
  getUnapprovedInstructors,
  approveInstructor,
  getAllInstructors,
  getInstructorById,
  assignSanitario,
  getAssignedSanitarios,
  removeSanitario,
  getInstructorSanitarios,
  updateInstructor,
  deleteInstructor,
} = require('../controllers/instructorController');
const multer = require('multer');
const path = require('path');

// const uploadResume = require('../middleware/uploadResume');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/resume');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: file Only!');
    }
  },
});

router.post(
  '/register',
  upload.fields([{ name: 'resumeUrl', maxCount: 1 }]),
  registerInstructor
);
router.patch('/update/:id', auth, updateInstructor);
router.get('/unapproved', getUnapprovedInstructors);
router.put('/approve/:id', approveInstructor);
router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);
router.post('/assign-sanitario', assignSanitario);
router.get('/:id/sanitarios', getAssignedSanitarios);
router.post('/remove-sanitario', removeSanitario);
router.get('/:instructorId/sanitarios', auth, getInstructorSanitarios);
router.delete('/:id', auth, isAdmin, deleteInstructor);

module.exports = router;
