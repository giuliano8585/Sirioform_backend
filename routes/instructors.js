const express = require('express');
const auth = require('../middleware/auth');
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
  updateInstructor
} = require('../controllers/instructorController');
const router = express.Router();

router.post('/register', registerInstructor);
router.patch('/update/:id', updateInstructor);
router.get('/unapproved', getUnapprovedInstructors);
router.put('/approve/:id', approveInstructor);
router.get('/', getAllInstructors);
router.get('/:id', getInstructorById);
router.post('/assign-sanitario', assignSanitario);
router.get('/:id/sanitarios', getAssignedSanitarios);
router.post('/remove-sanitario', removeSanitario);
router.get('/:instructorId/sanitarios', auth, getInstructorSanitarios);

module.exports = router;
