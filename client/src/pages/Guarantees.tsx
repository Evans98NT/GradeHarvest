import React from 'react';
import { 
  Shield, 
  User, 
  Edit3, 
  Lock, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  Star, 
  Award, 
  Users, 
  ArrowUpRight,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

const Guarantees: React.FC = () => {
  const guarantees = [
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'We employ a number of measures to ensure top quality essays. The papers go through a system of quality control prior to delivery. We run plagiarism checks on each paper to ensure that they will be 100% plagiarism-free. So, only clean copies are sent to customers\' emails. We also never resell the papers completed by our writers. So, once it is checked using a plagiarism checker, the paper will be unique. Speaking of the academic writing standards, we will stick to the assignment brief given by the customer and assign the perfect writer. By saying "the perfect writer" we mean the one having an academic degree in the customer\'s study field and positive feedback from other customers.',
      color: 'bg-blue-50 text-blue-600',
      bgGradient: 'from-blue-50 to-blue-100'
    },
    {
      icon: User,
      title: 'No AI-Generated Content',
      description: 'A human expert works on your order. AI is taking over the world, and progressing daily. Our company goes hand-in-hand with the AI revolution, appreciating the latest technological advancements and incorporating them into free website tools, such as Title generators. However, using any supplementary technologies when working on a customer order is strictly prohibited. We do not allow our team to use AI generators for content creation and supervise this requirement internally by running advanced screenings and verification. Every order undergoes an AI check before delivery to confirm a human writer wrote the text without using AI technologies.',
      color: 'bg-purple-50 text-purple-600',
      bgGradient: 'from-purple-50 to-purple-100'
    },
    {
      icon: Edit3,
      title: 'Editing Policy',
      description: 'We keep the quality bar of all papers high. But in case you need some extra brilliance to the paper, here\'s what to do. First of all, you can choose a top writer. It means that we will assign an expert with a degree in your subject. And secondly, you can rely on our editing services. Our editors will revise your papers, checking whether or not they comply with high standards of academic writing. In addition, editing entails adjusting content if it\'s off the topic, adding more sources, refining the language and ensuring proper referencing.',
      color: 'bg-green-50 text-green-600',
      bgGradient: 'from-green-50 to-green-100'
    },
    {
      icon: Lock,
      title: '100% Confidentiality',
      description: 'We make sure that clients\' personal data remains confidential and is not exploited for any purposes beyond those related to our services. We only ask you to provide us with the information that is required to produce the paper according to your writing needs. Please note that the payment info is protected as well. Feel free to refer to the support team for more information about our payment methods. The fact that you used our service is kept secret due to the advanced security standards. So, you can be sure that no one will find out that you got a paper here.',
      color: 'bg-orange-50 text-orange-600',
      bgGradient: 'from-orange-50 to-orange-100'
    },
    {
      icon: RefreshCw,
      title: 'Money-Back Guarantee',
      description: 'If you believe the writer has not followed your requirements or the paper doesn\'t fit the topic, feel free to ask for a refund. Remember that you can also request a limitless number of revisions for free within two weeks after the order delivery. All refund requests undergo a confirmation procedure. Once the request is processed, we return the money to the client\'s card or Bonus Balance. A full refund also applies if you haven\'t uploaded your paper.',
      color: 'bg-red-50 text-red-600',
      bgGradient: 'from-red-50 to-red-100'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'We have a support team working 24/7 ready to give your issue concerning the order their immediate attention. If you have any questions about the ordering process, communication with the writer, payment options, feel free to join live chat. Be sure to get a fast response. They can also give you the exact price quote, taking into account the timing, desired academic level of the paper, and the number of pages.',
      color: 'bg-cyan-50 text-cyan-600',
      bgGradient: 'from-cyan-50 to-cyan-100'
    }
  ];

  const stats = [
    { icon: CheckCircle, number: '100%', label: 'Plagiarism-Free', color: 'bg-blue-50 text-blue-600' },
    { icon: Star, number: '4.8/5', label: 'Customer Rating', color: 'bg-purple-50 text-purple-600' },
    { icon: Award, number: '99%', label: 'Satisfaction Rate', color: 'bg-green-50 text-green-600' },
    { icon: Users, number: '200K+', label: 'Happy Students', color: 'bg-orange-50 text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-purple-900 text-white py-16 lg:py-24 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400 to-navy rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400 to-navy transform rotate-45 opacity-40 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-18 h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform -rotate-6 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="w-3 h-3 bg-navy-light rounded-full animate-pulse"></span>
              <h5 className="text-gray-300 font-medium">Our Guarantees</h5>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-8">
              What You'll Get at <span className="text-purple-400">GradeHarvest</span>?
            </h1>
            
            <p className="text-xl text-gray-200 leading-relaxed max-w-3xl mx-auto mb-10">
              We stand behind our commitment to academic excellence with comprehensive guarantees that ensure your success and peace of mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/place-order"
                className="inline-flex items-center justify-center px-8 py-4 bg-navy hover:bg-navy-dark text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Get Started Now
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/testimonials"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold rounded-full transition-all duration-300"
              >
                Read Reviews
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Guarantees Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Comprehensive Guarantees</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every aspect of our service is backed by solid guarantees to ensure your complete satisfaction and academic success.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {guarantees.map((guarantee, index) => (
              <div key={index} className={`group relative bg-gradient-to-r ${guarantee.bgGradient} rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full`}>
                {/* Icon and Title */}
                <div className="flex items-start gap-6 mb-6">
                  <div className={`w-16 h-16 ${guarantee.color} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <guarantee.icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">
                      {guarantee.title}
                    </h3>
                  </div>
                </div>
                
                {/* Description */}
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed">
                    {guarantee.description}
                  </p>
                </div>
                
                {/* Decorative Element */}
                <div className={`absolute top-4 right-4 w-10 h-10 ${guarantee.color} rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Students Trust GradeHarvest</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our guarantees are backed by years of experience and thousands of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Secure & Safe</h4>
              <p className="text-gray-600">
                Your personal information and payment details are protected with bank-level security encryption.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Quality Verified</h4>
              <p className="text-gray-600">
                Every paper goes through multiple quality checks including plagiarism detection and expert review.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">Expert Writers</h4>
              <p className="text-gray-600">
                Our writers hold advanced degrees in their fields and have proven track records of academic excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Experience Section */}
      <section className="py-20 bg-gradient-to-r from-navy to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to see how our guarantees work in deed?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Let us find you a perfect writer to match your request! Time to experience superior quality and plagiarism-free writing delivered by a qualified expert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/place-order"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-navy font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Go to Order Form
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/testimonials"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold rounded-full transition-all duration-300"
              >
                Read Success Stories
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Need Help? We're Here 24/7</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our guarantees? Our support team is ready to assist you anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Call Us</h4>
              <p className="text-gray-600 mb-2">24/7 Support Available</p>
              <a href="tel:1-845-999-3026" className="text-blue-600 font-semibold hover:underline">
                1-845-999-3026
              </a>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Live Chat</h4>
              <p className="text-gray-600 mb-2">Instant Response</p>
              <button className="text-purple-600 font-semibold hover:underline">
                Start Chat Now
              </button>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Email Us</h4>
              <p className="text-gray-600 mb-2">Quick Response Guaranteed</p>
              <a href="mailto:support@gradeharvest.com" className="text-green-600 font-semibold hover:underline">
                support@gradeharvest.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Guarantees;
