const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const uploadPath = path.join(__dirname, '../uploads', req.uploadType || 'documents');
      
      // Ensure directory exists
      await fs.mkdir(uploadPath, { recursive: true });
      
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${extension}`;
    
    cb(null, filename);
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Get allowed file types from environment or use defaults
  const allowedTypes = process.env.ALLOWED_FILE_TYPES 
    ? process.env.ALLOWED_FILE_TYPES.split(',')
    : ['pdf', 'doc', 'docx', 'txt', 'rtf', 'jpg', 'jpeg', 'png'];

  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (allowedTypes.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new AppError(`File type .${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}`, 400));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Middleware for different upload types
const uploadMiddleware = {
  // Single file upload
  single: (fieldName, uploadType = 'documents') => {
    return (req, res, next) => {
      req.uploadType = uploadType;
      upload.single(fieldName)(req, res, next);
    };
  },

  // Multiple files upload
  array: (fieldName, maxCount = 5, uploadType = 'documents') => {
    return (req, res, next) => {
      req.uploadType = uploadType;
      upload.array(fieldName, maxCount)(req, res, next);
    };
  },

  // Multiple fields upload
  fields: (fields, uploadType = 'documents') => {
    return (req, res, next) => {
      req.uploadType = uploadType;
      upload.fields(fields)(req, res, next);
    };
  }
};

// Upload file function (for programmatic uploads)
const uploadFile = async (file, uploadType = 'documents') => {
  try {
    const uploadDir = path.join(__dirname, '../uploads', uploadType);
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const extension = path.extname(file.originalname || file.name);
    const filename = `upload-${uniqueSuffix}${extension}`;
    const filePath = path.join(uploadDir, filename);
    
    // Write file
    if (file.buffer) {
      await fs.writeFile(filePath, file.buffer);
    } else if (file.path) {
      await fs.copyFile(file.path, filePath);
    } else {
      throw new Error('Invalid file object');
    }
    
    // Return relative path for database storage
    return path.join('uploads', uploadType, filename).replace(/\\/g, '/');
    
  } catch (error) {
    throw new AppError(`File upload failed: ${error.message}`, 500);
  }
};

// Delete file function
const deleteFile = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
};

// Get file info
const getFileInfo = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    const stats = await fs.stat(fullPath);
    
    return {
      exists: true,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      extension: path.extname(filePath).toLowerCase(),
      filename: path.basename(filePath)
    };
  } catch (error) {
    return {
      exists: false,
      error: error.message
    };
  }
};

// Validate file type
const validateFileType = (filename, allowedTypes = null) => {
  const defaultAllowed = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'jpg', 'jpeg', 'png'];
  const allowed = allowedTypes || 
    (process.env.ALLOWED_FILE_TYPES ? process.env.ALLOWED_FILE_TYPES.split(',') : defaultAllowed);
  
  const extension = path.extname(filename).toLowerCase().slice(1);
  return allowed.includes(extension);
};

// Validate file size
const validateFileSize = (size, maxSize = null) => {
  const maxAllowed = maxSize || parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;
  return size <= maxAllowed;
};

// Clean up old files (utility function for cron jobs)
const cleanupOldFiles = async (directory, maxAge = 30) => {
  try {
    const uploadDir = path.join(__dirname, '../uploads', directory);
    const files = await fs.readdir(uploadDir);
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    
    let deletedCount = 0;
    
    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stats = await fs.stat(filePath);
      
      if (stats.birthtime < cutoffDate) {
        await fs.unlink(filePath);
        deletedCount++;
      }
    }
    
    return { deletedCount, totalFiles: files.length };
  } catch (error) {
    console.error('Cleanup error:', error);
    return { error: error.message };
  }
};

// Get upload statistics
const getUploadStats = async () => {
  try {
    const uploadDir = path.join(__dirname, '../uploads');
    const directories = ['documents', 'profiles', 'samples'];
    const stats = {};
    
    for (const dir of directories) {
      const dirPath = path.join(uploadDir, dir);
      try {
        const files = await fs.readdir(dirPath);
        let totalSize = 0;
        
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const fileStats = await fs.stat(filePath);
          totalSize += fileStats.size;
        }
        
        stats[dir] = {
          fileCount: files.length,
          totalSize,
          totalSizeMB: Math.round(totalSize / (1024 * 1024) * 100) / 100
        };
      } catch (error) {
        stats[dir] = { error: error.message };
      }
    }
    
    return stats;
  } catch (error) {
    return { error: error.message };
  }
};

// Create secure download URL
const createDownloadUrl = (filePath, expiresIn = 3600) => {
  const crypto = require('crypto');
  const expires = Math.floor(Date.now() / 1000) + expiresIn;
  const signature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
    .update(`${filePath}:${expires}`)
    .digest('hex');
  
  return `/api/files/download?path=${encodeURIComponent(filePath)}&expires=${expires}&signature=${signature}`;
};

// Verify download URL
const verifyDownloadUrl = (filePath, expires, signature) => {
  const crypto = require('crypto');
  const now = Math.floor(Date.now() / 1000);
  
  // Check if URL has expired
  if (now > expires) {
    return { valid: false, reason: 'URL has expired' };
  }
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', process.env.JWT_SECRET || 'fallback-secret')
    .update(`${filePath}:${expires}`)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return { valid: false, reason: 'Invalid signature' };
  }
  
  return { valid: true };
};

// Scan file for viruses (placeholder - would integrate with antivirus service)
const scanFile = async (filePath) => {
  // This is a placeholder for virus scanning
  // In production, you would integrate with services like:
  // - ClamAV
  // - VirusTotal API
  // - AWS GuardDuty
  // - Microsoft Defender API
  
  try {
    // Simulate virus scan
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // For now, just check file size and type
    const fileInfo = await getFileInfo(filePath);
    
    if (!fileInfo.exists) {
      return { clean: false, reason: 'File not found' };
    }
    
    // Basic checks
    if (fileInfo.size > 50 * 1024 * 1024) { // 50MB
      return { clean: false, reason: 'File too large' };
    }
    
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.vbs', '.js'];
    if (suspiciousExtensions.includes(fileInfo.extension)) {
      return { clean: false, reason: 'Suspicious file type' };
    }
    
    return { clean: true, scannedAt: new Date() };
  } catch (error) {
    return { clean: false, reason: error.message };
  }
};

module.exports = {
  uploadMiddleware,
  uploadFile,
  deleteFile,
  getFileInfo,
  validateFileType,
  validateFileSize,
  cleanupOldFiles,
  getUploadStats,
  createDownloadUrl,
  verifyDownloadUrl,
  scanFile
};
