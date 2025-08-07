import React, { useState } from 'react';
import { Upload, FileText, Shield, CheckCircle, X, AlertCircle, Eye } from 'lucide-react';

interface DocumentUploadStepProps {
  data: {
    cv?: File;
    writingSamples: File[];
    identityDocument?: File;
  };
  updateData: (data: any) => void;
  errors: Record<string, string>;
}

const DocumentUploadStep: React.FC<DocumentUploadStepProps> = ({
  data,
  updateData,
  errors
}) => {
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [previews, setPreviews] = useState<{[key: string]: string}>({});

  const handleFileUpload = (file: File, type: 'cv' | 'writingSample' | 'identity') => {
    // Validate file type
    const allowedTypes = {
      cv: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      writingSample: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      identity: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    };

    if (!allowedTypes[type].includes(file.type)) {
      const typeNames = {
        cv: 'PDF or Word document',
        writingSample: 'PDF or Word document',
        identity: 'PDF, JPG, JPEG, or PNG file'
      };
      alert(`Please upload a valid ${typeNames[type]}`);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    if (type === 'cv') {
      updateData({ cv: file });
    } else if (type === 'identity') {
      updateData({ identityDocument: file });
    } else if (type === 'writingSample') {
      const newSamples = [...data.writingSamples, file];
      if (newSamples.length > 3) {
        alert('Maximum 3 writing samples allowed');
        return;
      }
      updateData({ writingSamples: newSamples });
    }

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => ({
          ...prev,
          [file.name]: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent, type: 'cv' | 'writingSample' | 'identity') => {
    e.preventDefault();
    setDragOver(null);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const handleDragOver = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(type);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const removeFile = (type: 'cv' | 'identity' | 'writingSample', index?: number) => {
    if (type === 'cv') {
      updateData({ cv: undefined });
    } else if (type === 'identity') {
      updateData({ identityDocument: undefined });
    } else if (type === 'writingSample' && index !== undefined) {
      const newSamples = data.writingSamples.filter((_, i) => i !== index);
      updateData({ writingSamples: newSamples });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileUploadArea: React.FC<{
    type: 'cv' | 'writingSample' | 'identity';
    title: string;
    description: string;
    acceptedFormats: string;
    file?: File;
    required?: boolean;
  }> = ({ type, title, description, acceptedFormats, file, required = false }) => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
      <div
        className={`text-center ${dragOver === type ? 'bg-blue-50' : ''}`}
        onDrop={(e) => handleDrop(e, type)}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-800">{file.name}</p>
                <p className="text-sm text-green-600">{formatFileSize(file.size)}</p>
              </div>
            </div>
            <button
              onClick={() => removeFile(type)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {title} {required && <span className="text-red-500">*</span>}
            </h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <p className="text-sm text-gray-500 mb-4">
              Accepted formats: {acceptedFormats}
            </p>
            <label className="inline-block bg-navy text-white px-6 py-2 rounded-lg hover:bg-navy-light transition-colors cursor-pointer">
              Choose File
              <input
                type="file"
                accept={type === 'identity' ? '.pdf,.jpg,.jpeg,.png' : '.pdf,.doc,.docx'}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file, type);
                }}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-400 mt-2">or drag and drop</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navy-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-navy" />
        </div>
        <p className="text-gray-600">
          Upload your CV, writing samples, and identity verification documents. 
          All documents will be securely stored and reviewed by our team.
        </p>
      </div>

      {/* CV Upload */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Curriculum Vitae (CV)
        </h3>
        {errors.cv && (
          <p className="mb-4 text-sm text-red-600">{errors.cv}</p>
        )}
        <FileUploadArea
          type="cv"
          title="Upload Your CV"
          description="Your complete academic and professional CV/resume"
          acceptedFormats="PDF, DOC, DOCX (Max 10MB)"
          file={data.cv}
          required
        />
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">CV Requirements</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Include your educational background and degrees</li>
            <li>• List relevant work experience and publications</li>
            <li>• Highlight academic achievements and awards</li>
            <li>• Include contact information and references</li>
            <li>• Ensure the document is professionally formatted</li>
          </ul>
        </div>
      </div>

      {/* Writing Samples */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Writing Samples
          </h3>
          <span className="text-sm text-gray-500">
            {data.writingSamples.length}/3 uploaded
          </span>
        </div>
        {errors.writingSamples && (
          <p className="mb-4 text-sm text-red-600">{errors.writingSamples}</p>
        )}
        
        {/* Uploaded Samples */}
        {data.writingSamples.length > 0 && (
          <div className="mb-4 space-y-2">
            {data.writingSamples.map((sample, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-800">{sample.name}</p>
                    <p className="text-sm text-green-600">{formatFileSize(sample.size)}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile('writingSample', index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Area */}
        {data.writingSamples.length < 3 && (
          <FileUploadArea
            type="writingSample"
            title="Upload Writing Sample"
            description="Academic papers, essays, or research work that demonstrates your writing ability"
            acceptedFormats="PDF, DOC, DOCX (Max 10MB each)"
            required={data.writingSamples.length === 0}
          />
        )}

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Writing Sample Guidelines</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Upload 1-3 of your best academic writing samples</li>
            <li>• Choose samples that represent your expertise in selected subjects</li>
            <li>• Include research papers, essays, or published articles</li>
            <li>• Ensure samples demonstrate proper citation and formatting</li>
            <li>• Remove any personal information of previous clients if applicable</li>
          </ul>
        </div>
      </div>

      {/* Identity Verification */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-navy mr-3" />
          <h3 className="text-lg font-semibold text-gray-800">
            Identity Verification
          </h3>
        </div>
        {errors.identityDocument && (
          <p className="mb-4 text-sm text-red-600">{errors.identityDocument}</p>
        )}

        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-800 mb-2">Identity Verification Required</h4>
              <p className="text-sm text-yellow-700 mb-3">
                To ensure platform security and comply with regulations, we require identity verification 
                from all writers. Your document will be securely encrypted and used only for verification purposes.
              </p>
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-1">Acceptable Documents:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>National ID Card (front and back)</li>
                  <li>Passport (photo page)</li>
                  <li>Driver's License (front and back)</li>
                  <li>Government-issued photo ID</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <FileUploadArea
          type="identity"
          title="Upload Identity Document"
          description="Government-issued photo identification for verification"
          acceptedFormats="PDF, JPG, JPEG, PNG (Max 10MB)"
          file={data.identityDocument}
          required
        />

        {/* Preview for identity document */}
        {data.identityDocument && data.identityDocument.type.startsWith('image/') && previews[data.identityDocument.name] && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">Document Preview</h4>
              <button className="flex items-center text-navy hover:text-navy-light transition-colors">
                <Eye className="w-4 h-4 mr-1" />
                View Full Size
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <img
                src={previews[data.identityDocument.name]}
                alt="Identity document preview"
                className="max-w-full h-auto max-h-64 mx-auto rounded"
              />
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Security & Privacy</h4>
          <ul className="text-sm text-red-700 space-y-1">
            <li>• Your identity document is encrypted during transmission and storage</li>
            <li>• Only authorized verification staff can access your documents</li>
            <li>• Documents are used solely for identity verification purposes</li>
            <li>• We comply with data protection regulations (GDPR, CCPA)</li>
            <li>• Your document will be securely deleted after verification (unless required by law)</li>
          </ul>
        </div>
      </div>

      {/* Document Checklist */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Document Checklist
        </h3>
        <div className="space-y-3">
          <div className="flex items-center">
            {data.cv ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3" />
            )}
            <span className={data.cv ? 'text-green-800' : 'text-gray-600'}>
              CV/Resume uploaded
            </span>
          </div>
          <div className="flex items-center">
            {data.writingSamples.length > 0 ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3" />
            )}
            <span className={data.writingSamples.length > 0 ? 'text-green-800' : 'text-gray-600'}>
              Writing samples uploaded ({data.writingSamples.length}/3)
            </span>
          </div>
          <div className="flex items-center">
            {data.identityDocument ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3" />
            )}
            <span className={data.identityDocument ? 'text-green-800' : 'text-gray-600'}>
              Identity document uploaded
            </span>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps</h4>
        <p className="text-sm text-blue-700">
          After submitting your application, our team will review your documents within 2-3 business days. 
          You'll receive an email notification once the review is complete. If additional information is needed, 
          we'll contact you directly.
        </p>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
