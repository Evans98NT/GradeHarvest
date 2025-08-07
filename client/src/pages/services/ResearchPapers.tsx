import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Check, 
  ArrowUpRight,
  Search,
  Award,
  Shield,
  Zap,
  Heart,
  User,
  Calendar,
  MessageCircle,
  FileText,
  Database,
  BarChart
} from 'lucide-react';

const ResearchPapers: React.FC = () => {
  const features = [
    {
      icon: Search,
      title: 'In-Depth Research',
      description: 'Comprehensive research using credible academic sources and databases',
      color: 'bg-navy/10 text-navy'
    },
    {
      icon: Database,
      title: 'Academic Sources',
      description: 'Access to premium academic databases and peer-reviewed journals',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: BarChart,
      title: 'Data Analysis',
      description: 'Expert statistical analysis and interpretation of research data',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const researchTypes = [
    'Literature Review',
    'Empirical Research',
    'Case Study Research',
    'Comparative Analysis',
    'Systematic Review',
    'Meta-Analysis',
    'Qualitative Research',
    'Quantitative Research',
    'Mixed Methods Research',
    'Historical Research',
    'Experimental Research',
    'Survey Research'
  ];

  const subjects = [
    { name: 'Psychology', papers: '2,500+' },
    { name: 'Business', papers: '3,200+' },
    { name: 'Medicine', papers: '1,800+' },
    { name: 'Engineering', papers: '2,100+' },
    { name: 'Education', papers: '1,900+' },
    { name: 'Social Sciences', papers: '2,800+' },
    { name: 'Literature', papers: '1,600+' },
    { name: 'History', papers: '1,400+' }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'PhD Student',
      rating: 5,
      text: 'The research paper was exceptionally well-written with comprehensive analysis and proper citations. The methodology section was particularly impressive.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80'
    },
    {
      name: 'Michael Rodriguez',
      role: 'Graduate Student',
      rating: 5,
      text: 'Outstanding research quality with current sources and thorough analysis. The paper exceeded my expectations and helped me achieve an A+ grade.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    }
  ];

  const pricingPlans = [
    {
      level: 'Undergraduate',
      price: '$19.99',
      features: ['5-10 pages', '10+ sources', '7-day delivery', 'Basic analysis', 'Free revisions']
    },
    {
      level: 'Graduate',
      price: '$24.99',
      features: ['10-20 pages', '20+ sources', '5-day delivery', 'Advanced analysis', 'Methodology section']
    },
    {
      level: 'PhD Level',
      price: '$29.99',
      features: ['20+ pages', '30+ sources', '3-day delivery', 'Expert analysis', 'Statistical analysis']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-purple-900 text-white py-16 lg:py-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-cyan-400 to-navy rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-green-400 to-navy transform rotate-45 opacity-40 animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <Search className="w-6 h-6 text-purple-400" />
                <h5 className="text-gray-300 font-medium">Professional Research Paper Writing</h5>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Expert <span className="text-purple-400">Research Papers</span><br />
                Written by Academic <span className="text-cyan-400">Specialists</span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get comprehensive research papers with thorough analysis, credible sources, and proper methodology. Our PhD-level writers deliver original research that meets the highest academic standards.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/place-order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Order Research Paper
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
                <a
                  href="#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold rounded-full transition-all duration-300"
                >
                  View Pricing
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80" 
                alt="Research Paper Writing Service" 
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
              />
              
              {/* Floating Stats Card */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-600">15,000+</div>
                    <div className="text-gray-600 text-sm">Research Papers</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-green-600">PhD Writers</div>
                    <div className="text-gray-600 text-sm">Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our Research Paper Writing Service?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive research paper assistance with expert analysis, credible sources, and rigorous methodology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white border border-gray-100">
                <div className={`w-20 h-20 ${feature.color} rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300`}>
                  <feature.icon className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-white">
                  {feature.title}
                </h4>
                <p className="text-gray-600 group-hover:text-blue-100 mb-6">
                  {feature.description}
                </p>
                <a href="/place-order" className="inline-flex items-center text-blue-600 group-hover:text-white font-semibold hover:underline">
                  Learn More
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Types Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Types of Research Papers We Write
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our expert researchers can handle any type of research paper across all academic disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {researchTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{type}</h4>
                    <a href="/place-order" className="text-blue-600 text-sm hover:underline">
                      Order Now →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subject Areas Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Research Papers by Subject Area
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have completed thousands of research papers across various academic disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{subject.name}</h4>
                <p className="text-blue-600 font-semibold">{subject.papers}</p>
                <p className="text-gray-600 text-sm mb-4">Papers Completed</p>
                <a href="/place-order" className="text-blue-600 hover:underline font-medium">
                  Order Now →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Research Paper Writing Prices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparent pricing based on academic level and complexity. All prices are per page (275 words)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${index === 1 ? 'border-blue-600 transform scale-105' : 'border-gray-200'}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.level}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600">per page</p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <a
                  href="/place-order"
                  className={`w-full inline-flex items-center justify-center px-6 py-3 font-semibold rounded-full transition-all duration-300 ${index === 1 ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Order Now
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Research Paper Writing Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Systematic approach to delivering high-quality research papers with thorough analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Topic Analysis', description: 'We analyze your research topic and requirements thoroughly', icon: Search },
              { step: '02', title: 'Literature Review', description: 'Comprehensive review of existing literature and sources', icon: BookOpen },
              { step: '03', title: 'Research & Writing', description: 'In-depth research and systematic writing process', icon: FileText },
              { step: '04', title: 'Quality Assurance', description: 'Rigorous editing, proofreading, and plagiarism check', icon: Shield }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say About Our Research Papers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from satisfied students and researchers who achieved success with our services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-2 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Get Your Research Paper Written by Experts?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of students and researchers who have achieved academic success with our professional research paper writing service. 
            Get comprehensive, well-researched papers that meet the highest academic standards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/place-order"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Order Research Paper Now
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-full transition-all duration-300"
            >
              Get Free Quote
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchPapers;
