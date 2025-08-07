import React from 'react';
import { BookOpen, Check } from 'lucide-react';

interface SubjectExpertiseStepProps {
  data: {
    subjects: string[];
    academicLevels: string[];
  };
  updateData: (data: any) => void;
  errors: Record<string, string>;
}

const SubjectExpertiseStep: React.FC<SubjectExpertiseStepProps> = ({
  data,
  updateData,
  errors
}) => {
  const subjects = [
    { id: 'business', name: 'Business & Management', description: 'MBA, Finance, Marketing, Operations' },
    { id: 'psychology', name: 'Psychology', description: 'Clinical, Social, Cognitive Psychology' },
    { id: 'nursing', name: 'Nursing & Healthcare', description: 'Medical, Health Sciences, Public Health' },
    { id: 'computer-science', name: 'Computer Science', description: 'Programming, Software Engineering, IT' },
    { id: 'literature', name: 'Literature & English', description: 'Creative Writing, Literary Analysis' },
    { id: 'history', name: 'History', description: 'World History, American History, European History' },
    { id: 'economics', name: 'Economics', description: 'Macro/Microeconomics, Econometrics' },
    { id: 'marketing', name: 'Marketing', description: 'Digital Marketing, Brand Management' },
    { id: 'education', name: 'Education', description: 'Pedagogy, Curriculum Development' },
    { id: 'sociology', name: 'Sociology', description: 'Social Theory, Research Methods' },
    { id: 'political-science', name: 'Political Science', description: 'Government, International Relations' },
    { id: 'philosophy', name: 'Philosophy', description: 'Ethics, Logic, Metaphysics' },
    { id: 'mathematics', name: 'Mathematics', description: 'Calculus, Statistics, Algebra' },
    { id: 'physics', name: 'Physics', description: 'Classical, Quantum, Applied Physics' },
    { id: 'chemistry', name: 'Chemistry', description: 'Organic, Inorganic, Biochemistry' },
    { id: 'biology', name: 'Biology', description: 'Molecular, Cell Biology, Genetics' },
    { id: 'engineering', name: 'Engineering', description: 'Civil, Mechanical, Electrical' },
    { id: 'law', name: 'Law', description: 'Constitutional, Criminal, Corporate Law' },
    { id: 'medicine', name: 'Medicine', description: 'Clinical Medicine, Medical Research' },
    { id: 'environmental', name: 'Environmental Science', description: 'Ecology, Climate Studies' },
    { id: 'anthropology', name: 'Anthropology', description: 'Cultural, Physical Anthropology' },
    { id: 'geography', name: 'Geography', description: 'Human, Physical Geography' },
    { id: 'art', name: 'Art & Design', description: 'Fine Arts, Graphic Design, Art History' },
    { id: 'music', name: 'Music', description: 'Music Theory, Composition, Performance' },
    { id: 'theology', name: 'Theology & Religious Studies', description: 'Comparative Religion, Biblical Studies' },
    { id: 'communications', name: 'Communications', description: 'Media Studies, Journalism' },
    { id: 'criminal-justice', name: 'Criminal Justice', description: 'Criminology, Law Enforcement' },
    { id: 'social-work', name: 'Social Work', description: 'Community Work, Case Management' },
    { id: 'architecture', name: 'Architecture', description: 'Design, Urban Planning' },
    { id: 'other', name: 'Other', description: 'Specify in additional information' }
  ];

  const academicLevels = [
    { id: 'high-school', name: 'High School', description: 'Grade 9-12 level assignments' },
    { id: 'undergraduate', name: 'Undergraduate', description: 'Bachelor\'s degree level work' },
    { id: 'masters', name: 'Master\'s Level', description: 'Graduate level assignments' },
    { id: 'phd', name: 'PhD/Doctoral', description: 'Doctoral dissertations and research' },
    { id: 'professional', name: 'Professional', description: 'Professional certifications and training' }
  ];

  const handleSubjectToggle = (subjectId: string) => {
    const updatedSubjects = data.subjects.includes(subjectId)
      ? data.subjects.filter(id => id !== subjectId)
      : [...data.subjects, subjectId];
    
    updateData({ subjects: updatedSubjects });
  };

  const handleAcademicLevelToggle = (levelId: string) => {
    const updatedLevels = data.academicLevels.includes(levelId)
      ? data.academicLevels.filter(id => id !== levelId)
      : [...data.academicLevels, levelId];
    
    updateData({ academicLevels: updatedLevels });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navy-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-navy" />
        </div>
        <p className="text-gray-600">
          Select your areas of expertise and the academic levels you're comfortable writing for. 
          Choose subjects where you have strong knowledge and experience.
        </p>
      </div>

      {/* Subject Areas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Subject Areas *
          </h3>
          <span className="text-sm text-gray-500">
            {data.subjects.length} selected
          </span>
        </div>
        
        {errors.subjects && (
          <p className="mb-4 text-sm text-red-600">{errors.subjects}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => {
            const isSelected = data.subjects.includes(subject.id);
            return (
              <div
                key={subject.id}
                onClick={() => handleSubjectToggle(subject.id)}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                  ${isSelected 
                    ? 'border-navy bg-navy bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${isSelected ? 'text-navy' : 'text-gray-800'}`}>
                      {subject.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {subject.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="ml-2 w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Subject Selection Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Select subjects where you have formal education or extensive experience</li>
            <li>• Choose areas where you can demonstrate expertise through your CV and samples</li>
            <li>• Consider subjects you've taught, researched, or worked in professionally</li>
            <li>• You can always add more subjects later after proving your expertise</li>
          </ul>
        </div>
      </div>

      {/* Academic Levels */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Academic Levels *
          </h3>
          <span className="text-sm text-gray-500">
            {data.academicLevels.length} selected
          </span>
        </div>
        
        {errors.academicLevels && (
          <p className="mb-4 text-sm text-red-600">{errors.academicLevels}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {academicLevels.map((level) => {
            const isSelected = data.academicLevels.includes(level.id);
            return (
              <div
                key={level.id}
                onClick={() => handleAcademicLevelToggle(level.id)}
                className={`
                  relative p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                  ${isSelected 
                    ? 'border-navy bg-navy bg-opacity-5' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`font-medium ${isSelected ? 'text-navy' : 'text-gray-800'}`}>
                      {level.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {level.description}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="ml-2 w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Academic Level Guidelines</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• <strong>High School:</strong> Basic concepts, introductory assignments</li>
            <li>• <strong>Undergraduate:</strong> In-depth analysis, research papers, case studies</li>
            <li>• <strong>Master's:</strong> Advanced research, critical analysis, literature reviews</li>
            <li>• <strong>PhD/Doctoral:</strong> Original research, dissertations, academic publications</li>
            <li>• <strong>Professional:</strong> Industry-specific content, certifications, training materials</li>
          </ul>
        </div>
      </div>

      {/* Writing Experience */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Writing Experience (Optional)
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Years of Academic Writing Experience
            </label>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors">
              <option value="">Select experience level</option>
              <option value="0-1">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="2-5">2-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">More than 10 years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Previous Writing Experience
            </label>
            <textarea
              rows={4}
              placeholder="Describe your academic writing experience, publications, teaching experience, or other relevant background..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specializations or Unique Skills
            </label>
            <textarea
              rows={3}
              placeholder="Any specific methodologies, software, or specialized knowledge that sets you apart..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Citation Styles */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Citation Styles Proficiency
        </h3>
        <p className="text-gray-600 mb-4">
          Which citation styles are you proficient in? (Select all that apply)
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Vancouver', 'OSCOLA', 'Other'].map((style) => (
            <label key={style} className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-navy border-gray-300 rounded focus:ring-navy focus:ring-2"
              />
              <span className="ml-2 text-sm text-gray-700">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Requirements Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">Important Notes</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• You must demonstrate expertise in your selected subjects through your CV and writing samples</li>
          <li>• Our quality team will verify your qualifications before approval</li>
          <li>• You can request to add more subjects later by providing additional evidence of expertise</li>
          <li>• Higher academic levels typically offer better compensation rates</li>
        </ul>
      </div>
    </div>
  );
};

export default SubjectExpertiseStep;
