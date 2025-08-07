import React, { useState } from 'react';
import { Eye, EyeOff, Upload, X } from 'lucide-react';

interface PersonalInfoStepProps {
  data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    country: string;
    profilePicture?: File;
  };
  updateData: (data: any) => void;
  errors: Record<string, string>;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  data,
  updateData,
  errors
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
    'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Switzerland', 'Austria', 'Belgium', 'Ireland', 'New Zealand',
    'South Africa', 'Kenya', 'Nigeria', 'Ghana', 'Uganda', 'Tanzania',
    'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Philippines',
    'Malaysia', 'Singapore', 'Thailand', 'Indonesia', 'Vietnam',
    'Brazil', 'Argentina', 'Chile', 'Colombia', 'Mexico', 'Peru',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      updateData({ profilePicture: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfilePicture = () => {
    updateData({ profilePicture: undefined });
    setProfilePreview(null);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {profilePreview ? (
            <div className="relative">
              <img
                src={profilePreview}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={removeProfilePicture}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <label className="mt-3 cursor-pointer">
          <span className="text-sm text-navy hover:text-navy-light transition-colors">
            {profilePreview ? 'Change Profile Picture' : 'Upload Profile Picture (Optional)'}
          </span>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleProfilePictureChange}
            className="hidden"
          />
        </label>
        <p className="text-xs text-gray-500 mt-1">
          JPG, JPEG, or PNG. Max 5MB.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            value={data.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            id="lastName"
            value={data.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          value={data.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          This will be your login email and where we'll send important updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={data.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Minimum 8 characters with letters and numbers.
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password *
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={data.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      {/* Country */}
      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
          Country *
        </label>
        <select
          id="country"
          value={data.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
            errors.country ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          This helps us verify your identity and comply with local regulations.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Important Information</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Your email will be used for login and important communications</li>
          <li>• Choose a strong password to protect your account</li>
          <li>• Country information is required for identity verification</li>
          <li>• All information must be accurate and truthful</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
