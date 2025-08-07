import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Clock, FileText, Home, User, Copy } from 'lucide-react';
import WriterApplicationStatus from '../components/WriterApplicationStatus';

interface ApplicationSubmissionData {
  applicationId: string;
  writerId: string;
  email: string;
  status: string;
  submittedAt: string;
  approvalCountdown: any;
}

const WriterApplicationSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [applicationData, setApplicationData] = useState<ApplicationSubmissionData | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Get application data from localStorage
    const submissionData = localStorage.getItem('applicationSubmissionData');
    if (submissionData) {
      try {
        const data = JSON.parse(submissionData);
        setApplicationData(data);
      } catch (error) {
        console.error('Error parsing application data:', error);
      }
    }
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for applying to become a writer with GradeHarvest. 
            Your application has been received and is now under review.
          </p>
        </div>

        {/* Application Details */}
        {applicationData && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
              <button
                onClick={() => setShowStatus(!showStatus)}
                className="text-navy hover:text-navy-light transition-colors text-sm font-medium"
              >
                {showStatus ? 'Hide Status' : 'View Status'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Application ID</p>
                <div className="flex items-center">
                  <p className="font-medium font-mono">{applicationData.applicationId}</p>
                  <button
                    onClick={() => copyToClipboard(applicationData.applicationId)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Writer ID</p>
                <div className="flex items-center">
                  <p className="font-medium font-mono">{applicationData.writerId}</p>
                  <button
                    onClick={() => copyToClipboard(applicationData.writerId)}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{applicationData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted</p>
                <p className="font-medium">
                  {new Date(applicationData.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <div>
                  <p className="text-blue-800 font-medium">Keep these details safe!</p>
                  <p className="text-blue-700 text-sm">
                    You can use your Writer ID ({applicationData.writerId}) to check your application status anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Application Status Component */}
        {showStatus && applicationData && (
          <div className="mb-8">
            <WriterApplicationStatus 
              identifier={applicationData.writerId} 
            />
          </div>
        )}

        {/* What Happens Next */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            What Happens Next?
          </h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Document Review (1-2 business days)
                </h3>
                <p className="text-gray-600">
                  Our team will review your CV, writing samples, and identity verification documents 
                  to ensure they meet our quality standards.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Identity Verification (1-2 business days)
                </h3>
                <p className="text-gray-600">
                  We'll verify your identity using the documents you provided to ensure 
                  platform security and compliance with regulations.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  Application Decision (2-3 business days)
                </h3>
                <p className="text-gray-600">
                  You'll receive an email with our decision. If approved, you'll get access 
                  to your writer dashboard and can start bidding on projects immediately.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-navy text-white rounded-lg p-8 mb-8">
          <div className="flex items-center mb-4">
            <Clock className="w-6 h-6 mr-3" />
            <h2 className="text-xl font-semibold">Expected Timeline</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">2-3</div>
              <div className="text-sm opacity-90">Business Days</div>
              <div className="text-xs opacity-75 mt-1">Total Review Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">24hrs</div>
              <div className="text-sm opacity-90">Email Response</div>
              <div className="text-xs opacity-75 mt-1">After Decision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">Same Day</div>
              <div className="text-sm opacity-90">Dashboard Access</div>
              <div className="text-xs opacity-75 mt-1">If Approved</div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-yellow-800 mb-3">
            Important Information
          </h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• Check your email regularly for updates on your application status</li>
            <li>• Make sure to check your spam/junk folder as well</li>
            <li>• If you don't hear from us within 5 business days, please contact support</li>
            <li>• You can update your application by contacting our support team</li>
            <li>• Keep your contact information up to date for smooth communication</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Need Help?
          </h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your application or need assistance, 
            don't hesitate to reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:writers@gradeharvest.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
            >
              <Mail className="w-4 h-4 mr-2" />
              writers@gradeharvest.com
            </a>
            <a
              href="mailto:support@gradeharvest.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              General Support
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors text-lg font-medium"
          >
            <Home className="w-5 h-5 mr-2" />
            Return to Homepage
          </button>
          
          <div className="text-sm text-gray-500">
            <p>
              Want to learn more about writing for GradeHarvest?{' '}
              <button
                onClick={() => navigate('/writer-landing')}
                className="text-navy hover:text-navy-light transition-colors"
              >
                Visit our Writer Information Page
              </button>
            </p>
          </div>
        </div>

        {/* Check Status Later */}
        <div className="mt-8 p-6 bg-navy text-white rounded-lg text-center">
          <h3 className="text-lg font-semibold mb-2">Check Your Application Status</h3>
          <p className="text-navy-light mb-4">
            You can check your application status anytime using your Writer ID or email address.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowStatus(true)}
              className="px-6 py-2 bg-white text-navy rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Check Status Now
            </button>
            <button
              onClick={() => navigate('/writer-application-status')}
              className="px-6 py-2 border border-white text-white rounded-lg hover:bg-navy-light transition-colors font-medium"
            >
              Status Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterApplicationSuccess;
