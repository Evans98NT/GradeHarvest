import React, { useState } from 'react';
import { 
  Briefcase, 
  Brain, 
  Heart, 
  Monitor, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Megaphone, 
  GraduationCap, 
  Users, 
  Scale, 
  Lightbulb,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  DollarSign,
  CreditCard,
  Calendar,
  Zap
} from 'lucide-react';

const WriterLandingPage: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const subjects = [
    { name: 'Business & Management', icon: Briefcase, color: 'text-blue-600' },
    { name: 'Psychology', icon: Brain, color: 'text-purple-600' },
    { name: 'Nursing & Healthcare', icon: Heart, color: 'text-red-600' },
    { name: 'Computer Science', icon: Monitor, color: 'text-green-600' },
    { name: 'Literature & English', icon: BookOpen, color: 'text-indigo-600' },
    { name: 'History', icon: Clock, color: 'text-amber-600' },
    { name: 'Economics', icon: TrendingUp, color: 'text-emerald-600' },
    { name: 'Marketing', icon: Megaphone, color: 'text-pink-600' },
    { name: 'Education', icon: GraduationCap, color: 'text-blue-500' },
    { name: 'Sociology', icon: Users, color: 'text-orange-600' },
    { name: 'Political Science', icon: Scale, color: 'text-gray-600' },
    { name: 'Philosophy', icon: Lightbulb, color: 'text-yellow-600' },
    { name: 'Others', icon: MoreHorizontal, color: 'text-slate-600' }
  ];

  const faqs = [
    {
      id: 1,
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
      question: 'How much can I earn as a writer?',
      answer: 'Top performers earn upto $9,000+ monthly with consistent work and excellent ratings.'
    },
    {
      id: 2,
      icon: CreditCard,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      question: 'How do I get paid?',
      answer: 'Payments are processed every two weeks through various transfer methods. You can track your earnings in real-time through your dashboard and set up automatic withdrawals.'
    },
    {
      id: 3,
      icon: Calendar,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      question: 'What is the application process timeline?',
      answer: 'The application review process typically takes 3-5 business days. Once approved, you can start bidding on projects immediately and begin earning within your first week.'
    },
    {
      id: 4,
      icon: Zap,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
      question: 'Do I need to work specific hours?',
      answer: 'No, you have complete flexibility. Choose projects that fit your schedule and work when it\'s convenient for you. Many writers work part-time while maintaining other commitments.'
    }
  ];

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-navy text-white py-20 px-6 rounded-lg shadow-lg">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Join GradeHarvest as a Writer</h1>
          <p className="text-lg mb-8">
            Turn your academic expertise into income. Join our community of professional writers and help students achieve their academic goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/writer-register"
              className="inline-block bg-white text-navy font-semibold px-8 py-3 rounded hover:bg-gray-200 transition"
            >
              Apply Now
            </a>
            <a
              href="/login"
              className="inline-block border-2 border-white text-white font-semibold px-8 py-3 rounded hover:bg-white hover:text-navy transition"
            >
              Writer Login
            </a>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="container mx-auto max-w-5xl px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Why Join GradeHarvest?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Competitive Pay</h3>
            <p>Earn $15-$50 per page based on complexity and deadline. Top writers earn over $3,000 monthly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Schedule</h3>
            <p>Work when you want, from anywhere. Choose projects that fit your schedule and expertise.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
            <p>Protected payments, dispute resolution, and 24/7 support to ensure a smooth working experience.</p>
          </div>
        </div>
      </section>

      {/* How to Become a Writer Section */}
      <section className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-12 text-center">How to Become a Writer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              1
            </div>
            <h3 className="text-xl font-bold mb-3">Submit Application</h3>
            <p className="text-gray-600">Fill out our comprehensive application form with your academic background and writing experience.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              2
            </div>
            <h3 className="text-xl font-bold mb-3">Skills Assessment</h3>
            <p className="text-gray-600">Complete our writing test and demonstrate your expertise in your chosen subject areas.</p>
          </div>
          {/* <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Interview Process</h3>
            <p className="text-gray-600">Participate in a brief interview to discuss your qualifications and writing approach.</p>
          </div> */}
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="w-12 h-12 bg-navy text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
              3
            </div>
            <h3 className="text-xl font-bold mb-3">Start Writing</h3>
            <p className="text-gray-600">Once approved, access our platform and start bidding on projects that match your expertise.</p>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="bg-gray-50 py-16 px-6 rounded-lg shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold mb-8 text-center">Writer Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-navy">Academic Qualifications</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Bachelor's degree minimum (Master's preferred)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Strong academic record (GPA 3.5+)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Expertise in specific subject areas
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Native or near-native English proficiency
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-navy">Professional Skills</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Excellent research and writing skills
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Knowledge of citation styles (APA, MLA, Chicago)
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Ability to meet tight deadlines
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Strong communication skills
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Areas Section */}
      <section className="container mx-auto max-w-6xl px-6">
        <h2 className="text-3xl font-semibold mb-8 text-center">Popular Subject Areas</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subjects.map((subject, index) => {
            const IconComponent = subject.icon;
            return (
              <div key={index} className="bg-white p-4 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="flex flex-col items-center">
                  <IconComponent className={`w-6 h-6 ${subject.color} mb-2`} />
                  <span className="font-medium text-gray-700">{subject.name}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Writer Testimonials Section */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold mb-4 text-center">What Our Writers Say</h2>
          <p className="text-gray-600 text-center mb-12">Hear from successful writers in our community</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <blockquote className="italic text-gray-700 mb-4">
                "GradeHarvest has given me the flexibility to work around my schedule while earning great income. The platform is user-friendly and support is excellent."
              </blockquote>
              <cite className="block font-semibold text-navy">- Dr. Amanda K., English Literature</cite>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <blockquote className="italic text-gray-700 mb-4">
                "I've been writing for GradeHarvest for 2 years. The consistent work flow and fair payment system make it my preferred platform."
              </blockquote>
              <cite className="block font-semibold text-navy">- Prof. James R., Business Management</cite>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <blockquote className="italic text-gray-700 mb-4">
                "The quality of clients and projects on GradeHarvest is outstanding. I can focus on what I do best - writing quality academic content."
              </blockquote>
              <cite className="block font-semibold text-navy">- Dr. Maria S., Psychology</cite>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 rounded-lg shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Get answers to common questions about joining our writer community</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq) => {
              const IconComponent = faq.icon;
              const isOpen = openFAQ === faq.id;
              
              return (
                <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-navy focus:ring-opacity-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${faq.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className={`w-6 h-6 ${faq.iconColor}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 pr-4">{faq.question}</h3>
                    </div>
                    <div className="flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 transition-transform duration-200" />
                      )}
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="px-6 pb-5">
                      <div className="ml-16 pr-10">
                        <div className="h-px bg-gray-200 mb-4"></div>
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-12 text-center">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-4">Our support team is here to help you get started</p>
              <a
                href="mailto:support@gradeharvest.com"
                className="inline-flex items-center px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-navy text-white py-16 px-6 rounded-lg shadow-lg">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Writing Career?</h2>
          <p className="text-lg mb-8">
            Join thousands of successful writers who have built their careers with GradeHarvest.
          </p>
          <a
            href="/writer-register"
            className="inline-block bg-white text-navy font-semibold px-8 py-3 rounded hover:bg-gray-200 transition text-lg"
          >
            Apply to Become a Writer
          </a>
        </div>
      </section>
    </div>
  );
};

export default WriterLandingPage;
