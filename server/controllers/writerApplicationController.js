const WriterApplication = require('../models/WriterApplication');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath;
    
    if (file.fieldname === 'profilePicture') {
      uploadPath = 'server/uploads/profiles/';
    } else if (file.fieldname === 'cv') {
      uploadPath = 'server/uploads/documents/';
    } else if (file.fieldname.startsWith('writingSample')) {
      uploadPath = 'server/uploads/samples/';
    } else if (file.fieldname === 'identityDocument') {
      uploadPath = 'server/uploads/identity/';
    } else {
      uploadPath = 'server/uploads/misc/';
    }
    
    // Create directory if it doesn't exist
    require('fs').mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // Define allowed file types for each field
  const allowedTypes = {
    profilePicture: ['image/jpeg', 'image/jpg', 'image/png'],
    cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    identityDocument: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  };

  let fieldType = file.fieldname;
  if (file.fieldname.startsWith('writingSample')) {
    fieldType = 'cv'; // Same allowed types as CV
  }

  if (allowedTypes[fieldType] && allowedTypes[fieldType].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${file.fieldname}. Allowed types: ${allowedTypes[fieldType]?.join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 10 // Maximum 10 files
  }
});

// @desc    Submit writer application
// @route   POST /api/writer-applications
// @access  Public
const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      country,
      highestDegree,
      institution,
      graduationYear,
      fieldOfStudy,
      subjects,
      academicLevels,
      writingTestCompleted,
      writingTestScore
    } = req.body;

    // Check if user can apply (not rejected within last year)
    const canApplyCheck = await WriterApplication.canUserApply(email);
    if (!canApplyCheck.canApply) {
      return res.status(400).json({
        success: false,
        message: `You cannot reapply yet. You were rejected on ${canApplyCheck.rejectionDate.toLocaleDateString()} and can reapply after ${canApplyCheck.canReapplyDate.toLocaleDateString()} (${canApplyCheck.daysRemaining} days remaining).`,
        canReapplyDate: canApplyCheck.canReapplyDate,
        daysRemaining: canApplyCheck.daysRemaining
      });
    }

    // Check if application with this email already exists (and not rejected)
    const existingApplication = await WriterApplication.findOne({ 
      email: email.toLowerCase(),
      status: { $ne: 'rejected' }
    });
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'An active application with this email already exists',
        applicationId: existingApplication.applicationId,
        writerId: existingApplication.writerId,
        status: existingApplication.status
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Parse subjects and academic levels if they're strings
    const parsedSubjects = typeof subjects === 'string' ? JSON.parse(subjects) : subjects;
    const parsedAcademicLevels = typeof academicLevels === 'string' ? JSON.parse(academicLevels) : academicLevels;

    // Create application data
    const applicationData = {
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      country,
      highestDegree,
      institution,
      graduationYear,
      fieldOfStudy,
      subjects: parsedSubjects,
      academicLevels: parsedAcademicLevels,
      writingTest: {
        completed: writingTestCompleted === 'true',
        score: writingTestScore ? parseInt(writingTestScore) : undefined
      },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Handle file uploads
    if (req.files) {
      // Profile picture
      if (req.files.profilePicture) {
        const file = req.files.profilePicture[0];
        applicationData.profilePicture = {
          filename: file.filename,
          path: file.path,
          uploadDate: new Date()
        };
      }

      // CV
      if (req.files.cv) {
        const file = req.files.cv[0];
        applicationData.cv = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          uploadDate: new Date()
        };
      }

      // Identity document
      if (req.files.identityDocument) {
        const file = req.files.identityDocument[0];
        applicationData.identityDocument = {
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimeType: file.mimetype,
          uploadDate: new Date()
        };
      }

      // Writing samples
      const writingSamples = [];
      Object.keys(req.files).forEach(key => {
        if (key.startsWith('writingSample_')) {
          const file = req.files[key][0];
          writingSamples.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            size: file.size,
            mimeType: file.mimetype,
            uploadDate: new Date()
          });
        }
      });
      applicationData.writingSamples = writingSamples;
    }

    // Create the application
    const application = new WriterApplication(applicationData);
    await application.save();

    // Send confirmation email
    try {
      await sendConfirmationEmail(application);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application submission if email fails
    }

    // Send notification to admin team
    try {
      await sendAdminNotification(application);
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: {
        applicationId: application.applicationId,
        writerId: application.writerId,
        email: application.email,
        status: application.status,
        submittedAt: application.submittedAt,
        approvalCountdown: application.approvalCountdown
      }
    });

  } catch (error) {
    console.error('Application submission error:', error);
    
    // Clean up uploaded files if application creation failed
    if (req.files) {
      Object.values(req.files).flat().forEach(async (file) => {
        try {
          await fs.unlink(file.path);
        } catch (unlinkError) {
          console.error('Failed to clean up file:', file.path, unlinkError);
        }
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all applications (admin only)
// @route   GET /api/writer-applications
// @access  Private (Admin)
const getApplications = async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 },
      populate: [
        { path: 'reviewStages.documentsReviewed.reviewedBy', select: 'firstName lastName' },
        { path: 'reviewStages.identityVerified.verifiedBy', select: 'firstName lastName' },
        { path: 'reviewStages.writingTestGraded.gradedBy', select: 'firstName lastName' },
        { path: 'reviewStages.finalReview.reviewedBy', select: 'firstName lastName' }
      ]
    };

    const applications = await WriterApplication.paginate(query, options);

    res.json({
      success: true,
      data: applications
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve applications',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single application
// @route   GET /api/writer-applications/:id
// @access  Private (Admin)
const getApplication = async (req, res) => {
  try {
    const application = await WriterApplication.findById(req.params.id)
      .populate('reviewStages.documentsReviewed.reviewedBy', 'firstName lastName')
      .populate('reviewStages.identityVerified.verifiedBy', 'firstName lastName')
      .populate('reviewStages.writingTestGraded.gradedBy', 'firstName lastName')
      .populate('reviewStages.finalReview.reviewedBy', 'firstName lastName')
      .populate('createdUser', 'firstName lastName email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update application review stage
// @route   PUT /api/writer-applications/:id/review/:stage
// @access  Private (Admin)
const updateReviewStage = async (req, res) => {
  try {
    const { id, stage } = req.params;
    const { status, notes } = req.body;
    const reviewerId = req.user.id;

    const application = await WriterApplication.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update the review stage
    await application.updateReviewStage(stage, status, reviewerId, notes);

    // If application is approved, create user account
    if (application.status === 'approved' && !application.createdUser) {
      const user = await createUserFromApplication(application);
      application.createdUser = user._id;
      await application.save();

      // Send approval email with login credentials
      await sendApprovalEmail(application, user);
    } else if (application.status === 'rejected') {
      // Send rejection email
      await sendRejectionEmail(application, notes);
    }

    res.json({
      success: true,
      message: 'Review stage updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Update review stage error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review stage',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Helper function to create user from approved application
const createUserFromApplication = async (application) => {
  const userData = {
    firstName: application.firstName,
    lastName: application.lastName,
    email: application.email,
    password: application.password, // Already hashed
    country: application.country,
    role: 'writer',
    status: 'active',
    isEmailVerified: true, // Since we verified through application process
    writerProfile: {
      education: [{
        degree: application.highestDegree,
        institution: application.institution,
        year: parseInt(application.graduationYear),
        field: application.fieldOfStudy
      }],
      subjects: application.subjects,
      academicLevels: application.academicLevels,
      cv: application.cv,
      samples: application.writingSamples,
      writingTest: application.writingTest,
      isVerified: true,
      verificationDate: new Date()
    }
  };

  // Copy profile picture if exists
  if (application.profilePicture) {
    userData.profileImage = application.profilePicture.path;
  }

  const user = new User(userData);
  await user.save();

  return user;
};

// Helper function to send confirmation email
const sendConfirmationEmail = async (application) => {
  const emailContent = `
    <h2>Application Received - GradeHarvest Writer Program</h2>
    <p>Dear ${application.firstName} ${application.lastName},</p>
    
    <p>Thank you for applying to become a writer with GradeHarvest! We have successfully received your application.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Application Details:</h3>
      <p><strong>Application ID:</strong> ${application.applicationId}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Submitted:</strong> ${application.submittedAt.toLocaleDateString()}</p>
      <p><strong>Status:</strong> Under Review</p>
    </div>
    
    <h3>What Happens Next?</h3>
    <ol>
      <li><strong>Document Review (1-2 business days):</strong> Our team will review your CV, writing samples, and qualifications.</li>
      <li><strong>Identity Verification (1-2 business days):</strong> We'll verify your identity using the documents you provided.</li>
      <li><strong>Writing Test Evaluation (1 business day):</strong> Our experts will evaluate your writing test submission.</li>
      <li><strong>Final Decision (1 business day):</strong> You'll receive our final decision via email.</li>
    </ol>
    
    <p><strong>Expected Timeline:</strong> 2-3 business days total</p>
    
    <p>We'll keep you updated throughout the process. If you have any questions, please don't hesitate to contact us at writers@gradeharvest.com.</p>
    
    <p>Best regards,<br>The GradeHarvest Team</p>
  `;

  await sendEmail({
    to: application.email,
    subject: 'Application Received - GradeHarvest Writer Program',
    html: emailContent
  });
};

// Helper function to send admin notification
const sendAdminNotification = async (application) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gradeharvest.com';
  
  const emailContent = `
    <h2>New Writer Application Received</h2>
    <p>A new writer application has been submitted and requires review.</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Applicant Details:</h3>
      <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Country:</strong> ${application.country}</p>
      <p><strong>Degree:</strong> ${application.highestDegree}</p>
      <p><strong>Institution:</strong> ${application.institution}</p>
      <p><strong>Subjects:</strong> ${application.subjects.join(', ')}</p>
      <p><strong>Application ID:</strong> ${application.applicationId}</p>
      <p><strong>Submitted:</strong> ${application.submittedAt.toLocaleString()}</p>
    </div>
    
    <p>Please review the application in the admin dashboard.</p>
  `;

  await sendEmail({
    to: adminEmail,
    subject: 'New Writer Application - Review Required',
    html: emailContent
  });
};

// Helper function to send approval email
const sendApprovalEmail = async (application, user) => {
  const emailContent = `
    <h2>Congratulations! Your Writer Application Has Been Approved</h2>
    <p>Dear ${application.firstName} ${application.lastName},</p>
    
    <p>We're excited to inform you that your application to become a writer with GradeHarvest has been <strong>approved</strong>!</p>
    
    <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
      <h3>Your Writer Account Details:</h3>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Writer ID:</strong> ${user._id}</p>
      <p><strong>Account Status:</strong> Active</p>
    </div>
    
    <h3>Next Steps:</h3>
    <ol>
      <li><strong>Login to your dashboard:</strong> Visit our writer portal and login with your email and the password you created during application.</li>
      <li><strong>Complete your profile:</strong> Add any additional information to enhance your profile.</li>
      <li><strong>Start bidding:</strong> Browse available projects and start bidding on orders that match your expertise.</li>
      <li><strong>Build your reputation:</strong> Deliver high-quality work to build your ratings and earn more projects.</li>
    </ol>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${process.env.CLIENT_URL}/writer-login" style="background-color: #001F3F; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Writer Dashboard</a>
    </div>
    
    <p>Welcome to the GradeHarvest writer community! We look forward to working with you.</p>
    
    <p>Best regards,<br>The GradeHarvest Team</p>
  `;

  await sendEmail({
    to: application.email,
    subject: 'Welcome to GradeHarvest - Writer Application Approved!',
    html: emailContent
  });
};

// Helper function to send rejection email
const sendRejectionEmail = async (application, notes) => {
  const oneYearFromNow = new Date();
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
  
  const emailContent = `
    <h2>Writer Application Update</h2>
    <p>Dear ${application.firstName} ${application.lastName},</p>
    
    <p>Thank you for your interest in becoming a writer with GradeHarvest. After careful review of your application, we regret to inform you that we cannot approve your application at this time.</p>
    
    ${notes ? `
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3>Feedback:</h3>
      <p>${notes}</p>
    </div>
    ` : ''}
    
    <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #856404; margin-top: 0;">Reapplication Policy</h3>
      <p style="color: #856404; margin-bottom: 0;">
        <strong>Please note:</strong> You may reapply for a writer position after <strong>one year</strong> from the date of this rejection (${oneYearFromNow.toLocaleDateString()}). 
        This waiting period allows you time to address the feedback provided and improve your qualifications.
      </p>
    </div>
    
    <p>We encourage you to use this time to enhance your skills and qualifications. Our standards are high to ensure the best quality service for our clients.</p>
    
    <p>Thank you for your understanding, and we wish you the best in your academic writing career.</p>
    
    <p>Best regards,<br>The GradeHarvest Team</p>
  `;

  await sendEmail({
    to: application.email,
    subject: 'Writer Application Update - GradeHarvest',
    html: emailContent
  });
};

// @desc    Get application status by email or writerId
// @route   GET /api/writer-applications/status/:identifier
// @access  Public
const getApplicationStatus = async (req, res) => {
  try {
    const { identifier } = req.params;

    const application = await WriterApplication.findByEmailOrWriterId(identifier);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Return application status with countdown and reapplication info
    const statusData = {
      applicationId: application.applicationId,
      writerId: application.writerId,
      email: application.email,
      firstName: application.firstName,
      lastName: application.lastName,
      status: application.status,
      submittedAt: application.submittedAt,
      reviewProgress: application.reviewProgress,
      approvalCountdown: application.approvalCountdown,
      canReapply: application.canReapply,
      daysUntilReapply: application.daysUntilReapply,
      rejectionDate: application.rejectionDate,
      rejectionReason: application.rejectionReason
    };

    res.json({
      success: true,
      data: statusData
    });

  } catch (error) {
    console.error('Get application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve application status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  submitApplication: [
    upload.fields([
      { name: 'profilePicture', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
      { name: 'identityDocument', maxCount: 1 },
      { name: 'writingSample_0', maxCount: 1 },
      { name: 'writingSample_1', maxCount: 1 },
      { name: 'writingSample_2', maxCount: 1 }
    ]),
    submitApplication
  ],
  getApplications,
  getApplication,
  getApplicationStatus,
  updateReviewStage
};
