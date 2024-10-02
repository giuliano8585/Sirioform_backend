const Course = require('../models/Course');

// Funzione per creare un nuovo corso
const createCourse = async (req, res) => {
  console.log('req body: ', req.body);
  const { tipologia, città, via, numeroDiscenti, istruttori, direttoriCorso, giornate } = req.body;
  try {
    const newCourse = new Course({
      tipologia,
      città,
      via,
      numeroDiscenti,
      istruttore:istruttori,
      direttoreCorso:direttoriCorso,
      giornate,
      userId: req.user.id,
    });

    const createdCourse = await newCourse.save();
    res.status(201).json(createdCourse);
  } catch (error) {
    console.error('Errore durante la creazione del corso:', error);
    res.status(500).json({ message: 'Errore durante la creazione del corso' });
  }
};

// Funzione per ottenere tutti i corsi dell'utente
const getCoursesByUser = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id })?.populate('direttoreCorso istruttore');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei corsi' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei corsi' });
  }
};

module.exports = { createCourse, getCoursesByUser,getAllCourses };
