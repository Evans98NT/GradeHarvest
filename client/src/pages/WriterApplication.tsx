import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { writerApplicationsAPI } from '../services/api';
import { 
  User, 
  GraduationCap, 
  BookOpen, 
  Upload, 
  PenTool,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Save,
  Home
} from 'lucide-react';
import ProgressIndicator from '../components/WriterApplication/ProgressIndicator';
import PersonalInfoStep from '../components/WriterApplication/PersonalInfoStep';
import AcademicBackgroundStep from '../components/WriterApplication/AcademicBackgroundStep';
import SubjectExpertiseStep from '../components/WriterApplication/SubjectExpertiseStep';
import DocumentUploadStep from '../components/WriterApplication/DocumentUploadStep';
import WritingTestStep from '../components/WriterApplication/WritingTestStep';

interface ApplicationData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  profilePicture?: File;

  // Academic Background
  highestDegree: string;
  institution: string;
  graduationYear: string;
  fieldOfStudy: string;

  // Subject Expertise
  subjects: string[];
  academicLevels: string[];

  // Documents
  cv?: File;
  writingSamples: File[];
  identityDocument?: File;

  // Writing Test
  writingTestCompleted: boolean;
  writingTestScore?: number;
}

const WriterApplication: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    highestDegree: '',
    institution: '',
    graduationYear: '',
    fieldOfStudy: '',
    subjects: [],
    academicLevels: [],
    writingSamples: [],
    writingTestCompleted: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedProgress, setSavedProgress] = useState(false);

  const steps = [
    {
      number: 1,
      title: 'Personal Information',
      icon: User,
      description: 'Basic details and account setup'
    },
    {
      number: 2,
      title: 'Academic Background',
      icon: GraduationCap,
      description: 'Education and qualifications'
    },
    {
      number: 3,
      title: 'Subject Expertise',
      icon: BookOpen,
      description: 'Areas of specialization'
    },
    {
      number: 4,
      title: 'Documents & Identity',
      icon: Upload,
      description: 'CV, samples, and verification'
    },
    {
      number: 5,
      title: 'Writing Test',
      icon: PenTool,
      description: 'Skills assessment'
    }
  ];

  // Load saved progress on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('writerApplicationData');
    const savedStep = localStorage.getItem('writerApplicationStep');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);
        setSavedProgress(true);
      } catch (error) {
        console.error('Error loading saved application data:', error);
      }
    }
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem('writerApplicationData', JSON.stringify(applicationData));
    localStorage.setItem('writerApplicationStep', currentStep.toString());
    setSavedProgress(true);
    
    // Show success message briefly
    setTimeout(() => setSavedProgress(false), 2000);
  };

  // Update application data
  const updateApplicationData = (stepData: Partial<ApplicationData>) => {
    setApplicationData(prev => ({ ...prev, ...stepData }));
    setErrors({});
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1:
        if (!applicationData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!applicationData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!applicationData.email.trim()) newErrors.email = 'Email is required';
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(applicationData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (!applicationData.password) newErrors.password = 'Password is required';
        if (applicationData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (applicationData.password !== applicationData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!applicationData.country) newErrors.country = 'Country is required';
        break;

      case 2:
        if (!applicationData.highestDegree) newErrors.highestDegree = 'Highest degree is required';
        if (!applicationData.institution.trim()) newErrors.institution = 'Institution is required';
        if (!applicationData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
        if (!applicationData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
        break;

      case 3:
        if (applicationData.subjects.length === 0) newErrors.subjects = 'Please select at least one subject';
        if (applicationData.academicLevels.length === 0) newErrors.academicLevels = 'Please select at least one academic level';
        break;

      case 4:
        if (!applicationData.cv) newErrors.cv = 'CV upload is required';
        if (applicationData.writingSamples.length === 0) newErrors.writingSamples = 'At least one writing sample is required';
        if (!applicationData.identityDocument) newErrors.identityDocument = 'Identity verification document is required';
        break;

      case 5:
        if (!applicationData.writingTestCompleted) newErrors.writingTest = 'Writing test must be completed';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigate to next step
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    }
  };

  // Navigate to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit application
  const submitApplication = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add text fields
      Object.entries(applicationData).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'boolean') {
          formData.append(key, value.toString());
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
          formData.append(key, JSON.stringify(value));
        }
      });

      // Add files
      if (applicationData.profilePicture) {
        formData.append('profilePicture', applicationData.profilePicture);
      }
      if (applicationData.cv) {
        formData.append('cv', applicationData.cv);
      }
      if (applicationData.identityDocument) {
        formData.append('identityDocument', applicationData.identityDocument);
      }
      applicationData.writingSamples.forEach((sample, index) => {
        formData.append(`writingSample_${index}`, sample);
      });

      // Submit to API
      const response = await writerApplicationsAPI.submitApplication(formData);
      const responseData = response.data as any;

      if (responseData.success) {
        // Clear saved progress
        localStorage.removeItem('writerApplicationData');
        localStorage.removeItem('writerApplicationStep');
        
        // Store application details for success page
        localStorage.setItem('applicationSubmissionData', JSON.stringify(responseData.data));
        
        // Redirect to success page
        navigate('/writer-application-success');
      } else {
        setErrors({ submit: responseData.message || 'Application submission failed' });
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render current step component
  const renderCurrentStep = () => {
    const stepProps = {
      data: applicationData,
      updateData: updateApplicationData,
      errors
    };

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <AcademicBackgroundStep {...stepProps} />;
      case 3:
        return <SubjectExpertiseStep {...stepProps} />;
      case 4:
        return <DocumentUploadStep {...stepProps} />;
      case 5:
        return <WritingTestStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-navy hover:text-navy-light mb-4 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Writer Application
          </h1>
          <p className="text-gray-600">
            Join our community of professional academic writers
          </p>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator 
          steps={steps} 
          currentStep={currentStep} 
          className="mb-8"
        />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Step Header */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              {React.createElement(steps[currentStep - 1].icon, {
                className: "w-6 h-6 text-navy mr-3"
              })}
              <h2 className="text-2xl font-semibold text-gray-800">
                {steps[currentStep - 1].title}
              </h2>
            </div>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Error Messages */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
              
              <button
                onClick={saveProgress}
                className="inline-flex items-center px-4 py-2 text-navy hover:text-navy-light transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {savedProgress ? 'Saved!' : 'Save Progress'}
              </button>
            </div>

            <div>
              {currentStep < steps.length ? (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center px-6 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={submitApplication}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Need help with your application?
          </p>
          <a
            href="mailto:support@gradeharvest.com"
            className="text-navy hover:text-navy-light transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default WriterApplication;
