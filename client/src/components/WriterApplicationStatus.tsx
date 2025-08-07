import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  User, 
  Calendar,
  RefreshCw
} from 'lucide-react';
import { writerApplicationsAPI } from '../services/api';

interface ApplicationStatus {
  applicationId: string;
  writerId: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  submittedAt: string;
  reviewProgress: {
    completed: number;
    total: number;
    percentage: number;
  };
  approvalCountdown: {
    expired: boolean;
    days: number;
    hours: number;
    minutes: number;
    totalHours: number;
    expectedDate: string;
    message?: string;
  } | null;
  canReapply: boolean;
  daysUntilReapply: number;
  rejectionDate: string | null;
  rejectionReason: string | null;
}

interface WriterApplicationStatusProps {
  identifier: string; // email or writerId
  onStatusChange?: (status: ApplicationStatus) => void;
}

const WriterApplicationStatus: React.FC<WriterApplicationStatusProps> = ({ 
  identifier, 
  onStatusChange 
}) => {
  const [status, setStatus] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  // Fetch application status
  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await writerApplicationsAPI.getApplicationStatus(identifier);
      const applicationStatus = (response.data as any).data as ApplicationStatus;
      setStatus(applicationStatus);
      
      if (onStatusChange) {
        onStatusChange(applicationStatus);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch application status');
    } finally {
      setLoading(false);
    }
  };

  // Update countdown timer
  useEffect(() => {
    if (!status?.approvalCountdown || status.approvalCountdown.expired) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const expectedDate = new Date(status.approvalCountdown!.expectedDate).getTime();
      const difference = expectedDate - now;

      if (difference <= 0) {
        setCountdown(null);
        fetchStatus(); // Refresh status when countdown expires
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [identifier]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [identifier]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'under-review':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (statusValue: string) => {
    switch (statusValue) {
      case 'approved':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <XCircle className="w-5 h-5" />;
      case 'under-review':
        return <RefreshCw className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center text-red-600 mb-4">
          <XCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Error Loading Status</span>
        </div>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchStatus}
          className="bg-navy text-white px-4 py-2 rounded-lg hover:bg-navy-light transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>No application found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="w-6 h-6 text-navy mr-3" />
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Writer Application Status
            </h2>
            <p className="text-gray-600">
              {status.firstName} {status.lastName}
            </p>
          </div>
        </div>
        <button
          onClick={fetchStatus}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          title="Refresh Status"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Application Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Application ID</p>
          <p className="font-medium">{status.applicationId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Writer ID</p>
          <p className="font-medium">{status.writerId}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium">{status.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Submitted</p>
          <p className="font-medium">
            {new Date(status.submittedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-lg border ${getStatusColor(status.status)}`}>
          {getStatusIcon(status.status)}
          <span className="ml-2 font-medium capitalize">
            {status.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Conditional Content Based on Status */}
      {status.status === 'pending' || status.status === 'under-review' ? (
        <div>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Review Progress</span>
              <span>{status.reviewProgress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-navy h-2 rounded-full transition-all duration-300"
                style={{ width: `${status.reviewProgress.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {status.reviewProgress.completed} of {status.reviewProgress.total} stages completed
            </p>
          </div>

          {/* Countdown Timer */}
          {countdown && status.approvalCountdown && !status.approvalCountdown.expired && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-3">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">Expected Decision</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{countdown.days}</div>
                  <div className="text-sm text-blue-600">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{countdown.hours}</div>
                  <div className="text-sm text-blue-600">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{countdown.minutes}</div>
                  <div className="text-sm text-blue-600">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{countdown.seconds}</div>
                  <div className="text-sm text-blue-600">Seconds</div>
                </div>
              </div>
              
              <p className="text-sm text-blue-700">
                Expected decision by: {new Date(status.approvalCountdown.expectedDate).toLocaleDateString()}
              </p>
            </div>
          )}

          {status.approvalCountdown?.expired && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-yellow-800">{status.approvalCountdown.message}</p>
              </div>
            </div>
          )}
        </div>
      ) : status.status === 'approved' ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <h3 className="font-medium text-green-800">Congratulations!</h3>
          </div>
          <p className="text-green-700 mb-3">
            Your writer application has been approved. You can now log in to your writer dashboard and start applying for orders.
          </p>
          <a
            href="/login"
            className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Access Writer Dashboard
          </a>
        </div>
      ) : status.status === 'rejected' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <XCircle className="w-5 h-5 text-red-600 mr-2" />
            <h3 className="font-medium text-red-800">Application Rejected</h3>
          </div>
          
          {status.rejectionReason && (
            <div className="mb-4">
              <p className="text-sm text-red-600 mb-1">Reason:</p>
              <p className="text-red-700">{status.rejectionReason}</p>
            </div>
          )}

          {status.canReapply ? (
            <div>
              <p className="text-red-700 mb-3">
                You can submit a new application addressing the feedback provided.
              </p>
              <a
                href="/writer-application"
                className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Apply Again
              </a>
            </div>
          ) : (
            <div>
              <p className="text-red-700 mb-2">
                You can reapply in {status.daysUntilReapply} days.
              </p>
              <div className="flex items-center text-sm text-red-600">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  Rejected on: {status.rejectionDate ? new Date(status.rejectionDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default WriterApplicationStatus;
