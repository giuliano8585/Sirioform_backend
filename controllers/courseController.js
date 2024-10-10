const Order = require('../models/Order');
const Kit = require('../models/Kit');
const Course = require('../models/Course');
const { createNotification } = require('../utils/notificationService');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');

// Funzione per creare un nuovo corso
const createCourse = async (req, res) => {
  const {
    tipologia,
    città,
    via,
    numeroDiscenti,
    istruttori,
    direttoriCorso,
    giornate,
    isRefreshCourse,
  } = req.body;

  try {
    // Find the user's orders that contain the kit matching the course's tipologia
    const userOrders = await Order.find({
      userId: req.user.id,
      'orderItems.productId': tipologia,
    }).populate('userId');
    console.log('userOrders: ', userOrders);
    if (!userOrders.length) {
      return res.status(400).json({ message: 'No kits found for the user' });
    }
    let totalAvailableQuantity = 0;
    let selectedOrderItem = null;

    userOrders.forEach((order) => {
      order.orderItems.forEach((item) => {
        if (item.productId.toString() === tipologia) {
          totalAvailableQuantity += item.quantity;
          selectedOrderItem = item;
        }
      });
    });

    // Check if the available quantity is enough
    if (numeroDiscenti > totalAvailableQuantity) {
      return res
        .status(400)
        .json({ message: 'Not enough kits available to create the course' });
    }

    // Create the course
    const newCourse = new Course({
      tipologia,
      città,
      via,
      numeroDiscenti,
      istruttore: istruttori,
      direttoreCorso: direttoriCorso,
      giornate,
      userId: req.user.id,
      isRefreshCourse,
    });

    const createdCourse = await newCourse.save();

    await createNotification({
      message: `${
        req.user.role == 'center'
          ? userOrders[0]?.userId?.name
          : userOrders[0]?.userId?.firstName +
            ' ' +
            userOrders[0]?.userId?.lastName
      } has created a new course.`,
      senderId: req.user.id,
      category: 'general',
      isAdmin: true,
    });

    // Update the order kit quantity
    let remainingQuantity = numeroDiscenti;

    for (const order of userOrders) {
      for (const item of order.orderItems) {
        if (item.productId.toString() === tipologia && remainingQuantity > 0) {
          const usedQuantity = Math.min(item.quantity, remainingQuantity);

          if (item.totalQuantity == null) {
            item.totalQuantity = item.quantity;
          }
          item.quantity -= usedQuantity;
          remainingQuantity -= usedQuantity;

          // Save the updated order with reduced quantity
          await order.save();
        }
      }
    }

    res.status(201).json(createdCourse);
  } catch (error) {
    console.error('Errore durante la creazione del corso:', error);
    res.status(500).json({ message: 'Errore durante la creazione del corso' });
  }
};

// Funzione per ottenere tutti i corsi dell'utente
const getCoursesByUser = async (req, res) => {
  try {
    const courses = await Course.find({ userId: req.user.id })
      .populate('direttoreCorso')
      .populate('istruttore')
      .populate('tipologia')
      .populate('discente');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei corsi' });
  }
};

const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const courses = await Course.findOne({ _id: id })
      .populate('direttoreCorso')
      .populate('istruttore')
      .populate('tipologia')
      .populate('discente');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei corsi' });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('direttoreCorso')
      .populate('tipologia')
      .populate('userId')
      .populate('istruttore');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei corsi' });
  }
};

const updateCourseStatus = async (req, res) => {
  const { courseId } = req.params;
  const { status } = req.body;
  try {
    if (!['active', 'unactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { status },
      { new: true }
    ).populate('tipologia');
    console.log('updatedCourse: ', updatedCourse);
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await createNotification({
      message: `The status of your course ${updatedCourse?.tipologia?.type} has changed.`,
      senderId: req.user.id,
      category: 'general',
      receiverId: updatedCourse?.userId,
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error('Error updating course status:', error);
    res.status(500).json({ message: 'Error updating course status' });
  }
};

const assignDescente = async (req, res) => {
  try {
    const { courseId, discenteId } = req.body;
    if (!courseId || !discenteId) {
      return res
        .status(400)
        .json({ error: 'Course ID and Discente ID are required' });
    }
    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(discenteId)
    ) {
      return res.status(400).json({ error: 'Invalid courseId or discenteId' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    if (course.discente.includes(discenteId)) {
      return res
        .status(400)
        .json({ error: 'Discente is already assigned to this course' });
    }
    course.discente.push(discenteId);
    await course.save();
    res.status(200).json({ message: 'Discente successfully assigned', course });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createCourse,
  getCoursesByUser,
  getAllCourses,
  updateCourseStatus,
  assignDescente,
  getCourseById,
};
