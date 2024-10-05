const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/emailService');
const axios = require('axios');
const User = require('../models/User');
const { createNotification } = require('../utils/notificationService');

exports.registerInstructor = async (req, res) => {
  const { 
    firstName, lastName, fiscalCode, brevetNumber, qualifications, // qualifications should be an array of objects
    piva, address, city, region, email, phone, username, password, repeatPassword, recaptchaToken 
  } = req.body;

  if (password !== repeatPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Verifica reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);

  if (!response.data.success) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed' });
  }

  try {
    const existingInstructor = await User.findOne({ username });
    if (existingInstructor) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const formattedQualifications = qualifications.map(q => ({
      name: q.name,
      expirationDate: new Date(q.expirationDate)
    }));

    const newInstructor = new User({
      firstName,
      lastName,
      fiscalCode,
      brevetNumber,
      qualifications: formattedQualifications,
      piva,
      address,
      city,
      region,
      email,
      phone,
      username,
      password: hashedPassword,
      isActive: false,
      role: 'instructor',
      sanitarios: []
    });

    await newInstructor.save();

    // Invia email di conferma
    sendEmail(email, 'Registrazione Istruttore', 'Grazie per esserti registrato! Il tuo account è in attesa di approvazione.');

    await createNotification({
      message: `New Instructor Registered`,
      senderId: null,
      category:'instructorAccount',
      isAdmin: true,
    });

    res.status(201).json(newInstructor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getUnapprovedInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ isActive: false });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateInstructor = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const instructor = await User.findById(id);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    // Prevent updates to name, surname, fiscal code, and brevet number
    delete updateData.firstName;
    delete updateData.lastName;
    delete updateData.fiscalCode;
    delete updateData.brevetNumber;

    const updatedInstructor = await User.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json(updatedInstructor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during update' });
  }
};

exports.approveInstructor = async (req, res) => {
  try {
    const instructor = await User.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });

    // Invia email di conferma
    sendEmail(instructor.email, 'Account Attivato', 'Il tuo account è stato approvato e attivato. Puoi ora accedere al sistema.');

    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ isActive: true,role:'instructor' });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id).populate('sanitarios');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Assegna un sanitario a un istruttore
exports.assignSanitario = async (req, res) => {
  const { instructorId, sanitarioId } = req.body;
  try {
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    if (instructor.sanitarios.includes(sanitarioId)) {
      return res.status(400).json({ error: 'Sanitario already assigned to this instructor' });
    }

    instructor.sanitarios.push(sanitarioId);
    await instructor.save();
    res.status(200).json(instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Ottiene i sanitari assegnati a un istruttore
exports.getAssignedSanitarios = async (req, res) => {
  try {
    const instructor = await User.findById(req.params.id).populate('sanitarios');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.status(200).json(instructor.sanitarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Rimuove un sanitario da un istruttore
exports.removeSanitario = async (req, res) => {
  const { instructorId, sanitarioId } = req.body;
  try {
    const instructor = await User.findById(instructorId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    instructor.sanitarios.pull(sanitarioId);
    await instructor.save();
    res.status(200).json(instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstructorSanitarios = async (req, res) => {
  try {
    const instructorId = req.params.id;
    const instructor = await User.findById(instructorId).populate('sanitarios');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor.sanitarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

