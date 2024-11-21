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
const router = express.Router();

router.post('/register', registerInstructor);
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
