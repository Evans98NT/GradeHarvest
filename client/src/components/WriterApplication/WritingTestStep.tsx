import React, { useState, useEffect } from 'react';
import { PenTool, Clock, AlertCircle, CheckCircle, Play, Pause, RotateCcw } from 'lucide-react';

interface WritingTestStepProps {
  data: {
    writingTestCompleted: boolean;
    writingTestScore?: number;
  };
  updateData: (data: any) => void;
  errors: Record<string, string>;
}

const WritingTestStep: React.FC<WritingTestStepProps> = ({
  data,
  updateData,
  errors
}) => {
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(data.writingTestCompleted);
  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isPaused, setIsPaused] = useState(false);
  const [essay, setEssay] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const topics = [
    {
      id: 'education',
      title: 'The Role of Technology in Modern Education',
      description: 'Discuss how technology has transformed education in the 21st century. Analyze both the benefits and challenges of integrating technology into learning environments. Provide specific examples and consider the implications for different educational levels.'
    },
    {
      id: 'environment',
      title: 'Climate Change and Individual Responsibility',
      description: 'Examine the relationship between individual actions and climate change. To what extent can personal choices make a difference in addressing environmental challenges? Discuss the balance between individual responsibility and systemic change.'
    },
    {
      id: 'globalization',
      title: 'The Impact of Globalization on Local Cultures',
      description: 'Analyze how globalization affects local cultures and traditions. Consider both the positive and negative impacts. How can societies maintain their cultural identity while participating in the global economy?'
    },
    {
      id: 'healthcare',
      title: 'Mental Health Awareness in Academic Settings',
      description: 'Discuss the importance of mental health awareness in universities and schools. What are the main challenges students face, and how can educational institutions better support student mental health? Provide evidence-based recommendations.'
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (testStarted && !isPaused && !testCompleted && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [testStarted, isPaused, testCompleted, timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    if (!selectedTopic) {
      alert('Please select a topic before starting the test.');
      return;
    }
    setTestStarted(true);
    setShowInstructions(false);
  };

  const pauseTest = () => {
    setIsPaused(!isPaused);
  };

  const resetTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setTimeRemaining(45 * 60);
    setIsPaused(false);
    setEssay('');
    setSelectedTopic('');
    setShowInstructions(true);
    updateData({ writingTestCompleted: false, writingTestScore: undefined });
  };

  const handleTestSubmit = () => {
    if (essay.trim().length < 300) {
      alert('Your essay must be at least 300 words long.');
      return;
    }

    setTestCompleted(true);
    setTestStarted(false);
    
    // Simulate scoring (in real implementation, this would be done on the backend)
    const wordCount = essay.trim().split(/\s+/).length;
    let score = 0;
    
    // Basic scoring algorithm (this would be more sophisticated in reality)
    if (wordCount >= 500) score += 20;
    else if (wordCount >= 400) score += 15;
    else if (wordCount >= 300) score += 10;
    
    // Check for basic structure
    const paragraphs = essay.split('\n\n').filter(p => p.trim().length > 0);
    if (paragraphs.length >= 4) score += 20;
    else if (paragraphs.length >= 3) score += 15;
    else score += 10;
    
    // Check for complexity (basic check for sentence variety)
    const sentences = essay.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = essay.length / sentences.length;
    if (avgSentenceLength > 15 && avgSentenceLength < 25) score += 15;
    else score += 10;
    
    // Random component for other factors (grammar, coherence, etc.)
    score += Math.floor(Math.random() * 25) + 20;
    
    // Ensure score is between 0-100
    score = Math.min(100, Math.max(0, score));
    
    updateData({ 
      writingTestCompleted: true, 
      writingTestScore: score 
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  if (testCompleted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Writing Test Completed!
          </h2>
          <p className="text-gray-600">
            Congratulations! You have successfully completed the writing assessment.
          </p>
        </div>

        {data.writingTestScore && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center mb-6">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(data.writingTestScore)}`}>
                {data.writingTestScore}/100
              </div>
              <div className={`text-lg font-medium ${getScoreColor(data.writingTestScore)}`}>
                {getScoreLabel(data.writingTestScore)}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {essay.trim().split(/\s+/).length}
                </div>
                <div className="text-sm text-gray-600">Words Written</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {formatTime(45 * 60 - timeRemaining)}
                </div>
                <div className="text-sm text-gray-600">Time Used</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">
                  {topics.find(t => t.id === selectedTopic)?.title.split(' ').slice(0, 2).join(' ')}...
                </div>
                <div className="text-sm text-gray-600">Topic</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your writing test will be reviewed by our quality team</li>
                <li>• The score is one factor in our comprehensive evaluation</li>
                <li>• You'll receive feedback along with your application decision</li>
                <li>• High-scoring writers may be fast-tracked for approval</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            onClick={resetTest}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Test
          </button>
        </div>
      </div>
    );
  }

  if (testStarted) {
    return (
      <div className="space-y-6">
        {/* Test Header */}
        <div className="flex items-center justify-between p-4 bg-navy text-white rounded-lg">
          <div className="flex items-center">
            <PenTool className="w-6 h-6 mr-3" />
            <div>
              <h3 className="font-semibold">Writing Test in Progress</h3>
              <p className="text-sm opacity-90">
                Topic: {topics.find(t => t.id === selectedTopic)?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span className={`font-mono text-lg ${timeRemaining < 300 ? 'text-red-300' : ''}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={pauseTest}
              className="flex items-center px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Pause Overlay */}
        {isPaused && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <h4 className="font-medium text-yellow-800">Test Paused</h4>
                <p className="text-sm text-yellow-700">
                  Click the play button to resume your test. Your progress has been saved.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Writing Area */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              {topics.find(t => t.id === selectedTopic)?.title}
            </h4>
            <p className="text-gray-600 text-sm">
              {topics.find(t => t.id === selectedTopic)?.description}
            </p>
          </div>

          <textarea
            value={essay}
            onChange={(e) => setEssay(e.target.value)}
            disabled={isPaused}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent transition-colors resize-none"
            placeholder="Begin writing your essay here..."
          />

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Words: {essay.trim().split(/\s+/).filter(word => word.length > 0).length} 
              (Minimum: 300)
            </div>
            <button
              onClick={handleTestSubmit}
              disabled={essay.trim().length < 300}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Submit Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-navy-light bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenTool className="w-8 h-8 text-navy" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Writing Skills Assessment
        </h2>
        <p className="text-gray-600">
          Complete this timed writing test to demonstrate your academic writing abilities.
        </p>
      </div>

      {errors.writingTest && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{errors.writingTest}</p>
        </div>
      )}

      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-800 mb-4">Test Instructions</h3>
          <div className="space-y-3 text-sm text-blue-700">
            <div className="flex items-start">
              <Clock className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Time Limit:</strong> 45 minutes to complete your essay
              </div>
            </div>
            <div className="flex items-start">
              <PenTool className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Word Count:</strong> Minimum 300 words, recommended 500-700 words
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Requirements:</strong> Clear thesis, supporting arguments, proper structure, and conclusion
              </div>
            </div>
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Evaluation:</strong> Grammar, coherence, argument quality, and academic writing style
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Topic Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Choose Your Essay Topic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedTopic === topic.id
                  ? 'border-navy bg-navy bg-opacity-5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium mb-2 ${
                    selectedTopic === topic.id ? 'text-navy' : 'text-gray-800'
                  }`}>
                    {topic.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {topic.description}
                  </p>
                </div>
                {selectedTopic === topic.id && (
                  <div className="ml-2 w-6 h-6 bg-navy rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 mb-4">Writing Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
          <div>
            <h4 className="font-medium mb-2">Structure</h4>
            <ul className="space-y-1">
              <li>• Start with a clear introduction and thesis</li>
              <li>• Use topic sentences for each paragraph</li>
              <li>• Provide evidence and examples</li>
              <li>• End with a strong conclusion</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Style</h4>
            <ul className="space-y-1">
              <li>• Use formal academic language</li>
              <li>• Vary your sentence structure</li>
              <li>• Be clear and concise</li>
              <li>• Proofread for grammar and spelling</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Start Test Button */}
      <div className="text-center">
        <button
          onClick={startTest}
          disabled={!selectedTopic}
          className="inline-flex items-center px-8 py-3 bg-navy text-white rounded-lg hover:bg-navy-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
        >
          <Play className="w-5 h-5 mr-2" />
          Start Writing Test
        </button>
        {!selectedTopic && (
          <p className="text-sm text-red-600 mt-2">
            Please select a topic before starting the test.
          </p>
        )}
      </div>
    </div>
  );
};

export default WritingTestStep;
