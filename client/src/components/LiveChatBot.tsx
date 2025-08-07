import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  suggestions?: string[];
}

interface CollectedData {
  paperType?: string;
  subject?: string;
  academicLevel?: string;
  title?: string;
  wordCount?: number;
  urgency?: string;
  deadline?: string;
  instructions?: string;
  citationStyle?: string;
  sources?: number;
  spacing?: string;
  language?: string;
}

interface ChatBotProps {
  onFillForm: (data: CollectedData) => void;
}

const LiveChatBot: React.FC<ChatBotProps> = ({ onFillForm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState('greeting');
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "Hi! I'm your academic writing assistant. I can help you fill out your order form quickly. What type of paper do you need help with?",
        ['Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Other']
      );
    }
  }, [isOpen]);

  const addBotMessage = (text: string, suggestions?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'bot',
        timestamp: new Date(),
        suggestions
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handlePaperType = (input: string) => {
    const paperTypes = ['essay', 'research paper', 'thesis', 'dissertation', 'case study', 'book review', 'lab report', 'presentation', 'coursework', 'assignment', 'term paper', 'article', 'report', 'other'];
    const matchedType = paperTypes.find(type => input.toLowerCase().includes(type));
    
    if (matchedType) {
      setCollectedData(prev => ({ ...prev, paperType: matchedType }));
      setCurrentStep('paperType');
      addBotMessage(
        `Great! A ${matchedType} it is. What subject is this for?`,
        ['English', 'History', 'Psychology', 'Business', 'Economics', 'Marketing', 'Computer Science', 'Other']
      );
    } else {
      addBotMessage(
        "I didn't catch that. Could you please specify what type of paper you need?",
        ['Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Other']
      );
    }
  };

  const handleSubject = (input: string) => {
    const subjects = ['english', 'history', 'psychology', 'business', 'economics', 'marketing', 'management', 'finance', 'accounting', 'law', 'political science', 'sociology', 'philosophy', 'literature', 'nursing', 'medicine', 'biology', 'chemistry', 'physics', 'mathematics', 'computer science', 'engineering', 'education', 'art', 'music'];
    const matchedSubject = subjects.find(subject => input.toLowerCase().includes(subject));
    
    if (matchedSubject) {
      setCollectedData(prev => ({ ...prev, subject: matchedSubject }));
      setCurrentStep('subject');
      addBotMessage(
        `Perfect! ${matchedSubject} is a great subject. What's your academic level?`,
        ['High School', 'Undergraduate', 'Masters', 'PhD', 'Professional']
      );
    } else {
      setCollectedData(prev => ({ ...prev, subject: input }));
      setCurrentStep('subject');
      addBotMessage(
        `Got it! What's your academic level?`,
        ['High School', 'Undergraduate', 'Masters', 'PhD', 'Professional']
      );
    }
  };

  const handleAcademicLevel = (input: string) => {
    const levels = {
      'high school': 'high-school',
      'undergraduate': 'undergraduate',
      'bachelor': 'undergraduate',
      'masters': 'masters',
      'master': 'masters',
      'phd': 'phd',
      'doctorate': 'phd',
      'professional': 'professional'
    };
    
    const matchedLevel = Object.keys(levels).find(level => input.toLowerCase().includes(level));
    
    if (matchedLevel) {
      setCollectedData(prev => ({ ...prev, academicLevel: levels[matchedLevel as keyof typeof levels] }));
      setCurrentStep('academicLevel');
      addBotMessage("Excellent! Now, what's the title of your paper?");
    } else {
      addBotMessage(
        "I need to know your academic level to calculate pricing correctly. Please choose one:",
        ['High School', 'Undergraduate', 'Masters', 'PhD', 'Professional']
      );
    }
  };

  const handleTitle = (input: string) => {
    setCollectedData(prev => ({ ...prev, title: input }));
    setCurrentStep('title');
    addBotMessage("Great title! How many words do you need? (e.g., 500, 1000, 2500)");
  };

  const handleWordCount = (input: string) => {
    const wordCount = parseInt(input.replace(/[^\d]/g, ''));
    
    if (wordCount && wordCount >= 250) {
      setCollectedData(prev => ({ ...prev, wordCount }));
      setCurrentStep('wordCount');
      addBotMessage(
        `${wordCount} words, that's about ${Math.ceil(wordCount / 250)} pages. When do you need this completed?`,
        ['24 hours', '3 days', '1 week', '2 weeks', 'More than 2 weeks']
      );
    } else {
      addBotMessage("Please provide a valid word count (minimum 250 words). For example: '1000 words' or just '1000'");
    }
  };

  const handleDeadline = (input: string) => {
    let urgency = '';
    let deadlineDate = '';
    
    if (input.toLowerCase().includes('24') || input.toLowerCase().includes('tomorrow')) {
      urgency = '24-hours';
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      deadlineDate = tomorrow.toISOString().slice(0, 16);
    } else if (input.toLowerCase().includes('3 day')) {
      urgency = '3-days';
      const threeDays = new Date();
      threeDays.setDate(threeDays.getDate() + 3);
      deadlineDate = threeDays.toISOString().slice(0, 16);
    } else if (input.toLowerCase().includes('week') || input.toLowerCase().includes('7 day')) {
      urgency = '7-days';
      const oneWeek = new Date();
      oneWeek.setDate(oneWeek.getDate() + 7);
      deadlineDate = oneWeek.toISOString().slice(0, 16);
    } else if (input.toLowerCase().includes('2 week') || input.toLowerCase().includes('14 day')) {
      urgency = '14-days';
      const twoWeeks = new Date();
      twoWeeks.setDate(twoWeeks.getDate() + 14);
      deadlineDate = twoWeeks.toISOString().slice(0, 16);
    } else {
      urgency = '30-days';
      const oneMonth = new Date();
      oneMonth.setDate(oneMonth.getDate() + 30);
      deadlineDate = oneMonth.toISOString().slice(0, 16);
    }
    
    setCollectedData(prev => ({ ...prev, urgency, deadline: deadlineDate }));
    setCurrentStep('deadline');
    addBotMessage("Perfect! Finally, could you provide any specific instructions or requirements for your paper?");
  };

  const handleInstructions = (input: string) => {
    setCollectedData(prev => ({ ...prev, instructions: input }));
    setCurrentStep('instructions');
    addBotMessage(
      "Great! Now, what citation style do you need? (This helps with proper referencing)",
      ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Other']
    );
  };

  const handleCitationStyle = (input: string) => {
    const citationStyles = ['apa', 'mla', 'chicago', 'harvard', 'ieee', 'vancouver', 'other'];
    const matchedStyle = citationStyles.find(style => input.toLowerCase().includes(style));
    
    const citationStyle = matchedStyle ? matchedStyle.toUpperCase() : 'APA';
    setCollectedData(prev => ({ ...prev, citationStyle }));
    setCurrentStep('citationStyle');
    addBotMessage("How many sources do you need for your paper? (Enter 0 if none required)");
  };

  const handleSources = (input: string) => {
    const sources = parseInt(input.replace(/[^\d]/g, '')) || 0;
    setCollectedData(prev => ({ ...prev, sources }));
    setCurrentStep('sources');
    addBotMessage(
      "What spacing do you prefer for your document?",
      ['Single spacing', 'Double spacing', '1.5 spacing']
    );
  };

  const handleSpacing = (input: string) => {
    let spacing = 'double';
    if (input.toLowerCase().includes('single')) {
      spacing = 'single';
    } else if (input.toLowerCase().includes('1.5')) {
      spacing = '1.5';
    } else if (input.toLowerCase().includes('double')) {
      spacing = 'double';
    }
    
    setCollectedData(prev => ({ ...prev, spacing, language: 'English' }));
    setCurrentStep('spacing');
    
    const finalData = {
      ...collectedData,
      spacing,
      language: 'English'
    };
    
    addBotMessage(
      `Perfect! I've gathered all the information needed. Here's what I have:

📝 Paper Type: ${finalData.paperType}
📚 Subject: ${finalData.subject}
🎓 Academic Level: ${finalData.academicLevel}
📄 Title: ${finalData.title}
📊 Word Count: ${finalData.wordCount} words
⏰ Urgency: ${finalData.urgency}
📋 Instructions: ${finalData.instructions}
📖 Citation Style: ${finalData.citationStyle}
📚 Sources: ${finalData.sources}
📄 Spacing: ${finalData.spacing}

Would you like me to fill out the form with this information?`,
      ['Yes, fill the form', 'Let me review first', 'Start over']
    );
    setCurrentStep('completion');
  };

  const handleCompletion = (input: string) => {
    if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('fill')) {
      // Create the complete data object with all collected information
      const completeData = {
        title: collectedData.title || '',
        subject: collectedData.subject || '',
        academicLevel: collectedData.academicLevel || '',
        paperType: collectedData.paperType || '',
        instructions: collectedData.instructions || '',
        wordCount: collectedData.wordCount || 250,
        deadline: collectedData.deadline || '',
        urgency: collectedData.urgency || '',
        citationStyle: collectedData.citationStyle || 'APA',
        sources: collectedData.sources || 0,
        spacing: collectedData.spacing || 'double',
        language: collectedData.language || 'English'
      };
      
      console.log('Filling form with data:', completeData); // Debug log
      onFillForm(completeData);
      addBotMessage("Excellent! I've filled out the form with your information. You can review and modify any details before submitting. The form should now be populated with all your requirements!");
      setIsOpen(false);
    } else if (input.toLowerCase().includes('review')) {
      addBotMessage("No problem! The form is ready for you to review. You can always chat with me again if you need help.");
      setIsOpen(false);
    } else if (input.toLowerCase().includes('start over')) {
      setCollectedData({});
      setCurrentStep('greeting');
      setMessages([]);
      addBotMessage(
        "Sure! Let's start fresh. What type of paper do you need help with?",
        ['Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Other']
      );
    }
  };

  const processUserInput = (input: string) => {
    addUserMessage(input);
    
    // Handle "fill the form" request at any time
    if (input.toLowerCase().includes('fill') && input.toLowerCase().includes('form')) {
      setCurrentStep('greeting');
      setCollectedData({});
      setMessages([]);
      addBotMessage(
        "Hi! I'm your academic writing assistant. I can help you fill out your order form quickly. What type of paper do you need help with?",
        ['Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Other']
      );
      return;
    }
    
    switch (currentStep) {
      case 'greeting':
        handlePaperType(input);
        break;
      case 'paperType':
        handleSubject(input);
        break;
      case 'subject':
        handleAcademicLevel(input);
        break;
      case 'academicLevel':
        handleTitle(input);
        break;
      case 'title':
        handleWordCount(input);
        break;
      case 'wordCount':
        handleDeadline(input);
        break;
      case 'deadline':
        handleInstructions(input);
        break;
      case 'instructions':
        handleCitationStyle(input);
        break;
      case 'citationStyle':
        handleSources(input);
        break;
      case 'sources':
        handleSpacing(input);
        break;
      case 'spacing':
        handleCompletion(input);
        break;
      case 'completion':
        handleCompletion(input);
        break;
      default:
        // Reset to greeting if we're in an unknown state
        setCurrentStep('greeting');
        setCollectedData({});
        setMessages([]);
        addBotMessage(
          "Hi! I'm your academic writing assistant. I can help you fill out your order form quickly. What type of paper do you need help with?",
          ['Essay', 'Research Paper', 'Thesis', 'Dissertation', 'Other']
        );
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    processUserInput(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      processUserInput(inputValue);
      setInputValue('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-50 animate-pulse"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Academic Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="block w-full text-left text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-50 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default LiveChatBot;
