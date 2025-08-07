const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  uploadProfileImage,
  getWriterApplications,
  approveWriter,
  rejectWriter,
  getWriterPerformance,
  updateWriterLevel,
  suspendUser,
  reactivateUser
} = require('../controllers/userController');

const {
  authenticate,
  authorize,
  authorizePermission,
  requireVerifiedWriter
} = require('../middleware/auth');

const {
  validateObjectId,
  validatePagination,
  validateFileUpload,
  validateAdminUserCreation
} = require('../middleware/validation');

const { uploadMiddleware } = require('../utils/fileUpload');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users (Admin only)
router.get('/', 
  authorize('manager', 'support', 'tech'),
  validatePagination,
  getUsers
);

// Get user statistics (Admin only)
router.get('/stats',
  authorize('manager', 'tech'),
  getUserStats
);

// Writer application routes (Admin only)
router.get('/writers/applications',
  authorize('manager', 'support'),
  validatePagination,
  getWriterApplications
);

// Approve writer application (Admin only)
router.put('/writers/:id/approve',
  authorize('manager'),
  validateObjectId('id'),
  approveWriter
);

// Reject writer application (Admin only)
router.put('/writers/:id/reject',
  authorize('manager'),
  validateObjectId('id'),
  rejectWriter
);

// Get writer performance (Admin or own profile)
router.get('/writers/:id/performance',
  validateObjectId('id'),
  getWriterPerformance
);

// Update writer level (Admin only)
router.put('/writers/:id/level',
  authorize('manager'),
  validateObjectId('id'),
  updateWriterLevel
);

// Upload profile image
router.post('/:id/profile-image',
  validateObjectId('id'),
  uploadMiddleware.single('profileImage', 'profiles'),
  validateFileUpload(['jpg', 'jpeg', 'png'], 5 * 1024 * 1024), // 5MB limit for images
  uploadProfileImage
);

// Suspend user (Admin only)
router.put('/:id/suspend',
  authorize('manager'),
  validateObjectId('id'),
  suspendUser
);

// Reactivate user (Admin only)
router.put('/:id/reactivate',
  authorize('manager'),
  validateObjectId('id'),
  reactivateUser
);

// Get single user (Admin or own profile)
router.get('/:id',
  validateObjectId('id'),
  getUser
);

// Update user (Admin or own profile)
router.put('/:id',
  validateObjectId('id'),
  updateUser
);

// Delete user (Admin only)
router.delete('/:id',
  authorize('manager'),
  validateObjectId('id'),
  deleteUser
);

module.exports = router;
