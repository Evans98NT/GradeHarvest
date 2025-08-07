import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign } from 'lucide-react';
import LiveChatBot from './LiveChatBot';

interface OrderFormData {
  title: string;
  subject: string;
  academicLevel: string;
  paperType: string;
  instructions: string;
  wordCount: number;
  deadline: string;
  urgency: string;
  citationStyle: string;
  sources: number;
  spacing: string;
  language: string;
  attachments: File[];
}

const OrderForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<OrderFormData>({
    title: '',
    subject: '',
    academicLevel: '',
    paperType: '',
    instructions: '',
    wordCount: 250,
    deadline: '',
    urgency: '',
    citationStyle: 'APA',
    sources: 0,
    spacing: 'double',
    language: 'English',
    attachments: [],
  });

  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subjects = [
    'English', 'History', 'Psychology', 'Business', 'Economics', 'Marketing',
    'Management', 'Finance', 'Accounting', 'Law', 'Political Science',
    'Sociology', 'Philosophy', 'Literature', 'Nursing', 'Medicine',
    'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Computer Science',
    'Engineering', 'Education', 'Art', 'Music', 'Other'
  ];

  const academicLevels = [
    { value: 'high-school', label: 'High School' },
    { value: 'undergraduate', label: 'Undergraduate' },
    { value: 'masters', label: 'Masters' },
    { value: 'phd', label: 'PhD' },
    { value: 'professional', label: 'Professional' }
  ];

  const paperTypes = [
    'Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Case Study',
    'Book Review', 'Lab Report', 'Presentation', 'Coursework', 'Assignment',
    'Term Paper', 'Article', 'Report', 'Other'
  ];

  const urgencyOptions = [
    { value: '24-hours', label: '24 Hours' },
    { value: '3-days', label: '3 Days' },
    { value: '7-days', label: '7 Days' },
    { value: '14-days', label: '14 Days' },
    { value: '30-days', label: '30+ Days' }
  ];

  const citationStyles = ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Vancouver', 'Other'];

  const calculatePrice = () => {
    // GradeMiners uses 275 words per page
    const pages = Math.ceil(formData.wordCount / 275);
    
    // Base prices per page for each academic level (30+ days deadline)
    const basePrices: Record<string, number> = {
      'high-school': 13,        // $13 per page
      'undergraduate': 18,      // $18 per page (College equivalent)
      'masters': 22,           // $22 per page
      'phd': 28,              // $28 per page
      'professional': 25       // $25 per page (between Masters and PhD)
    };

    // Deadline-based multipliers
    const deadlineMultipliers: Record<string, number> = {
      '24-hours': 2.2,    // Most expensive
      '3-days': 1.8,      // Very urgent
      '7-days': 1.4,      // Urgent
      '14-days': 1.1,     // Standard
      '30-days': 1.0      // Longest deadline (base price)
    };

    const basePrice = basePrices[formData.academicLevel] || 18;
    const deadlineMultiplier = deadlineMultipliers[formData.urgency] || 1.0;

    // Calculate total price: pages × base price × deadline urgency
    const totalPrice = pages * basePrice * deadlineMultiplier;
    setCalculatedPrice(Math.round(totalPrice * 100) / 100);
  };

  const handleInputChange = (field: keyof OrderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (['wordCount', 'academicLevel', 'urgency'].includes(field)) {
      setTimeout(() => calculatePrice(), 100);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...files]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Paper title is required';
    if (!formData.subject) newErrors.subject = 'Subject is required';
    if (!formData.academicLevel) newErrors.academicLevel = 'Academic level is required';
    if (!formData.paperType) newErrors.paperType = 'Paper type is required';
    if (!formData.instructions.trim()) newErrors.instructions = 'Instructions are required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    else {
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      if (deadlineDate.getTime() <= now.getTime()) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }
    if (!formData.urgency) newErrors.urgency = 'Urgency is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Store files in a global variable since they can't be serialized to JSON
      (window as any).pendingOrderFiles = formData.attachments;

      // Prepare order data for local storage and payment page (without files)
      const orderData = {
        id: `temp-${Date.now()}`, // Temporary ID until order is created after payment
        title: formData.title,
        subject: formData.subject,
        academicLevel: formData.academicLevel,
        paperType: formData.paperType,
        instructions: formData.instructions,
        wordCount: formData.wordCount,
        deadline: formData.deadline,
        urgency: formData.urgency,
        requirements: {
          citationStyle: formData.citationStyle,
          sources: formData.sources,
          spacing: formData.spacing,
          language: formData.language
        },
        totalPrice: calculatedPrice,
        status: 'pending_payment',
        createdAt: new Date().toISOString(),
        attachments: formData.attachments.map(file => ({ name: file.name, size: file.size })) // Store file metadata only
      };

      // Store order data in localStorage for persistence across page navigation
      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      // Navigate directly to payment page without API call
      navigate('/payment', {
        state: {
          orderData: orderData,
          requiresOrderCreation: true // Flag to indicate order needs to be created after payment
        }
      });
    } catch (error: any) {
      console.error('Order preparation error:', error);
      setErrors({ submit: 'Failed to prepare order. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChatBotFillForm = (chatData: any) => {
    console.log('Received chat data:', chatData); // Debug log
    
    // Map the chatbot data to form fields with proper transformations
    const mappedData: Partial<OrderFormData> = {};
    
    if (chatData.title) mappedData.title = chatData.title;
    if (chatData.instructions) mappedData.instructions = chatData.instructions;
    if (chatData.wordCount) mappedData.wordCount = chatData.wordCount;
    if (chatData.deadline) mappedData.deadline = chatData.deadline;
    if (chatData.urgency) mappedData.urgency = chatData.urgency;
    if (chatData.citationStyle) mappedData.citationStyle = chatData.citationStyle;
    if (chatData.sources !== undefined) mappedData.sources = chatData.sources;
    if (chatData.spacing) mappedData.spacing = chatData.spacing;
    if (chatData.language) mappedData.language = chatData.language;
    
    // Handle subject mapping - capitalize first letter to match form options
    if (chatData.subject) {
      const subjectMap: Record<string, string> = {
        'english': 'English',
        'history': 'History',
        'psychology': 'Psychology',
        'business': 'Business',
        'economics': 'Economics',
        'marketing': 'Marketing',
        'management': 'Management',
        'finance': 'Finance',
        'accounting': 'Accounting',
        'law': 'Law',
        'political science': 'Political Science',
        'sociology': 'Sociology',
        'philosophy': 'Philosophy',
        'literature': 'Literature',
        'nursing': 'Nursing',
        'medicine': 'Medicine',
        'biology': 'Biology',
        'chemistry': 'Chemistry',
        'physics': 'Physics',
        'mathematics': 'Mathematics',
        'computer science': 'Computer Science',
        'engineering': 'Engineering',
        'education': 'Education',
        'art': 'Art',
        'music': 'Music'
      };
      mappedData.subject = subjectMap[chatData.subject.toLowerCase()] || 
                          chatData.subject.charAt(0).toUpperCase() + chatData.subject.slice(1);
    }
    
    // Handle paperType mapping - fix to match actual form option values
    if (chatData.paperType) {
      const paperTypeMap: Record<string, string> = {
        'essay': 'essay',
        'research paper': 'research-paper',
        'thesis': 'thesis',
        'dissertation': 'dissertation',
        'case study': 'case-study',
        'book review': 'book-review',
        'lab report': 'lab-report',
        'presentation': 'presentation',
        'coursework': 'coursework',
        'assignment': 'assignment',
        'term paper': 'term-paper',
        'article': 'article',
        'report': 'report',
        'other': 'other'
      };
      
      // Get the mapped value or use the original if no mapping exists
      const mappedType = paperTypeMap[chatData.paperType.toLowerCase()];
      mappedData.paperType = mappedType || chatData.paperType.toLowerCase().replace(' ', '-');
    }

    console.log('Mapped data:', mappedData); // Debug log

    setFormData(prev => {
      const newData = { ...prev, ...mappedData };
      console.log('New form data:', newData); // Debug log
      return newData;
    });

    // Clear any existing errors for fields that were filled
    const fieldsToUpdate = Object.keys(mappedData);
    setErrors(prev => {
      const newErrors = { ...prev };
      fieldsToUpdate.forEach(field => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      return newErrors;
    });

    // Recalculate price after form is filled
    setTimeout(() => calculatePrice(), 100);
    
    // Show success message to user
    console.log('Form has been populated with chatbot data!');
  };

  useEffect(() => {
    calculatePrice();
  }, [formData.wordCount, formData.academicLevel, formData.urgency]);

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-navy mb-6">Place Your Order</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paper Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter your paper title"
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject *
            </label>
            <select
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.subject ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Academic Level *
            </label>
            <select
              value={formData.academicLevel}
              onChange={(e) => handleInputChange('academicLevel', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.academicLevel ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Level</option>
              {academicLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
            {errors.academicLevel && (
              <p className="mt-1 text-sm text-red-600">{errors.academicLevel}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Paper Type *
            </label>
            <select
              value={formData.paperType}
              onChange={(e) => handleInputChange('paperType', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.paperType ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Type</option>
              {paperTypes.map(type => (
                <option key={type} value={type.toLowerCase().replace(' ', '-')}>{type}</option>
              ))}
            </select>
            {errors.paperType && (
              <p className="mt-1 text-sm text-red-600">{errors.paperType}</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Instructions *
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => handleInputChange('instructions', e.target.value)}
            rows={6}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
              errors.instructions ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Provide detailed instructions for your paper..."
            required
          />
          {errors.instructions && (
            <p className="mt-1 text-sm text-red-600">{errors.instructions}</p>
          )}
        </div>

        {/* Word Count and Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Word Count *
            </label>
            <input
              type="number"
              value={formData.wordCount}
              onChange={(e) => handleInputChange('wordCount', parseInt(e.target.value) || 250)}
              min="250"
              max="50000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              required
            />
            {errors.wordCount && (
              <p className="mt-1 text-sm text-red-600">{errors.wordCount}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Pages: {Math.ceil(formData.wordCount / 275)} (275 words per page)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deadline *
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.deadline ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>
        </div>

        {/* Urgency and Citation Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Urgency *
            </label>
            <select
              value={formData.urgency}
              onChange={(e) => handleInputChange('urgency', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent ${
                errors.urgency ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            >
              <option value="">Select Urgency</option>
              {urgencyOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.urgency && (
              <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Citation Style
            </label>
            <select
              value={formData.citationStyle}
              onChange={(e) => handleInputChange('citationStyle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            >
              {citationStyles.map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Requirements */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sources Required
            </label>
            <input
              type="number"
              value={formData.sources}
              onChange={(e) => handleInputChange('sources', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            />
            {errors.sources && (
              <p className="mt-1 text-sm text-red-600">{errors.sources}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Spacing
            </label>
            <select
              value={formData.spacing}
              onChange={(e) => handleInputChange('spacing', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            >
              <option value="single">Single</option>
              <option value="1.5">1.5 Spacing</option>
              <option value="double">Double</option>
            </select>
            {errors.spacing && (
              <p className="mt-1 text-sm text-red-600">{errors.spacing}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) => handleInputChange('language', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Other">Other</option>
            </select>
            {errors.language && (
              <p className="mt-1 text-sm text-red-600">{errors.language}</p>
            )}
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Attachments
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            {errors.attachments && (
              <p className="mt-1 text-sm text-red-600">{errors.attachments}</p>
            )}
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-navy hover:text-navy-light font-semibold"
            >
              Click to upload files
            </label>
            <p className="text-sm text-gray-500 mt-2">
              PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB each)
            </p>
          </div>

          {formData.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Uploaded Files:</h4>
              <ul className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Total Price</h3>
              <p className="text-sm text-gray-600">
                {Math.ceil(formData.wordCount / 275)} pages × Academic level × Deadline urgency
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center text-3xl font-bold text-navy">
                <DollarSign className="h-8 w-8" />
                {calculatedPrice.toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">USD</p>
            </div>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting Order...</span>
              </>
            ) : (
              <>
                <span>Place Order</span>
                <DollarSign className="h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </form>
      </div>

      {/* Live Chat Bot */}
      <LiveChatBot onFillForm={handleChatBotFillForm} />
    </>
  );
};

export default OrderForm;
