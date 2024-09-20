const mongoose = require('mongoose');
const Instructor = require('../models/Instructor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/emailService');
const axios = require('axios');
const Sanitario = require('../models/Sanitario'); // Importa il modello del sanitario

exports.registerInstructor = async (req, res) => {
  const { firstName, lastName, fiscalCode, brevetNumber, qualifications, piva, address, city, region, email, phone, username, password, repeatPassword, recaptchaToken } = req.body;

  if (password !== repeatPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Verifica reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Inserisci la tua reCAPTCHA Secret Key qui o nel file .env
  const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`);

  if (!response.data.success) {
    return res.status(400).json({ error: 'reCAPTCHA validation failed' });
  }

  try {
    const existingInstructor = await Instructor.findOne({ username });
    if (existingInstructor) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newInstructor = new Instructor({
      firstName,
      lastName,
      fiscalCode,
      brevetNumber,
      qualifications,
      piva,
      address,
      city,
      region,
      email,
      phone,
      username,
      password: hashedPassword,
      isActive: false,
      sanitarios: [] // Inizializza l'array dei sanitari
    });

    await newInstructor.save();

    // Invia email di conferma
    sendEmail(email, 'Registrazione Istruttore', 'Grazie per esserti registrato! Il tuo account è in attesa di approvazione.');

    res.status(201).json(newInstructor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getUnapprovedInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({ isActive: false });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveInstructor = async (req, res) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });

    // Invia email di conferma
    sendEmail(instructor.email, 'Account Attivato', 'Il tuo account è stato approvato e attivato. Puoi ora accedere al sistema.');

    res.json(instructor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await Instructor.find({ isActive: true });
    res.json(instructors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInstructorById = async (req, res) => {
  try {
    const instructor = await Instructor.findById(req.params.id).populate('sanitarios');
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
    const instructor = await Instructor.findById(instructorId);
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
    const instructor = await Instructor.findById(req.params.id).populate('sanitarios');
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
    const instructor = await Instructor.findById(instructorId);
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
    const instructor = await Instructor.findById(instructorId).populate('sanitarios');
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }
    res.json(instructor.sanitarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

