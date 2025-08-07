import React from 'react';
import { GraduationCap, Plus, X } from 'lucide-react';

interface AcademicBackgroundStepProps {
  data: {
    highestDegree: string;
    institution: string;
    graduationYear: string;
    fieldOfStudy: string;
  };
  updateData: (data: any) => void;
  errors: Record<string, string>;
}

const AcademicBackgroundStep: React.FC<AcademicBackgroundStepProps> = ({
  data,
  updateData,
  errors
}) => {
  const degrees = [
    { value: 'high-school', label: 'High School Diploma' },
    { value: 'associate', label: 'Associate Degree' },
    { value: 'bachelor', label: "Bachelor's Degree" },
    { value: 'master', label: "Master's Degree" },
    { value: 'phd', label: 'PhD/Doctorate' },
    { value: 'professional', label: 'Professional Degree (JD, MD, etc.)' },
    { value: 'other', label: 'Other' }
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const fieldsOfStudy = [
    'Accounting', 'Anthropology', 'Architecture', 'Art & Design', 'Biology',
    'Business Administration', 'Chemistry', 'Communications', 'Computer Science',
    'Criminal Justice', 'Economics', 'Education', 'Engineering', 'English Literature',
    'Environmental Science', 'Finance', 'Geography', 'History', 'International Relations',
    'Journalism', 'Law', 'Linguistics', 'Management', 'Marketing', 'Mathematics',
    'Medicine', 'Music', 'Nursing', 'Philosophy', 'Physics', 'Political Science',
    'Psychology', 'Public Administration', 'Social Work', 'Sociology', 'Statistics',
    'Theater Arts', 'Theology', 'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navy-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8 text-navy" />
        </div>
        <p className="text-gray-600">
          Tell us about your educational background. This helps us understand your qualifications and expertise.
        </p>
      </div>

      {/* Highest Degree */}
      <div>
        <label htmlFor="highestDegree" className="block text-sm font-medium text-gray-700 mb-2">
          Highest Degree Obtained *
        </label>
        <select
          id="highestDegree"
          value={data.highestDegree}
          onChange={(e) => handleInputChange('highestDegree', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
            errors.highestDegree ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your highest degree</option>
          {degrees.map((degree) => (
            <option key={degree.value} value={degree.value}>
              {degree.label}
            </option>
          ))}
        </select>
        {errors.highestDegree && (
          <p className="mt-1 text-sm text-red-600">{errors.highestDegree}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Institution */}
        <div>
          <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
            Institution/University *
          </label>
          <input
            type="text"
            id="institution"
            value={data.institution}
            onChange={(e) => handleInputChange('institution', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
              errors.institution ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Harvard University, Oxford University"
          />
          {errors.institution && (
            <p className="mt-1 text-sm text-red-600">{errors.institution}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
            Graduation Year *
          </label>
          <select
            id="graduationYear"
            value={data.graduationYear}
            onChange={(e) => handleInputChange('graduationYear', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
              errors.graduationYear ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select graduation year</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
          {errors.graduationYear && (
            <p className="mt-1 text-sm text-red-600">{errors.graduationYear}</p>
          )}
        </div>
      </div>

      {/* Field of Study */}
      <div>
        <label htmlFor="fieldOfStudy" className="block text-sm font-medium text-gray-700 mb-2">
          Field of Study/Major *
        </label>
        <select
          id="fieldOfStudy"
          value={data.fieldOfStudy}
          onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors ${
            errors.fieldOfStudy ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select your field of study</option>
          {fieldsOfStudy.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
        {errors.fieldOfStudy && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldOfStudy}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Choose the field that best matches your primary area of study.
        </p>
      </div>

      {/* Academic Achievements Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Academic Achievements (Optional)
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPA/Grade (if applicable)
            </label>
            <input
              type="text"
              placeholder="e.g., 3.8/4.0, First Class Honours, Magna Cum Laude"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Honors/Awards
            </label>
            <textarea
              rows={3}
              placeholder="List any academic honors, awards, scholarships, or distinctions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Relevant Coursework
            </label>
            <textarea
              rows={3}
              placeholder="List relevant courses that demonstrate your expertise in your chosen subjects..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Requirements Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Academic Requirements</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Minimum Bachelor's degree required (Master's preferred)</li>
          <li>• Strong academic record (GPA 3.5+ preferred)</li>
          <li>• Degree from an accredited institution</li>
          <li>• Relevant field of study for your chosen subjects</li>
          <li>• You may be asked to provide official transcripts during verification</li>
        </ul>
      </div>

      {/* Additional Education Section */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Additional Education (Optional)
        </h3>
        <p className="text-gray-600 mb-4">
          Do you have additional degrees, certifications, or professional qualifications?
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Degree/Certification
              </label>
              <input
                type="text"
                placeholder="e.g., MBA, PhD, Certificate"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Institution
              </label>
              <input
                type="text"
                placeholder="Institution name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors">
                <option value="">Select year</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Qualification
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcademicBackgroundStep;
