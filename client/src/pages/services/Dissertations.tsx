import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Check, 
  ArrowUpRight,
  GraduationCap,
  Award,
  Shield,
  Zap,
  Heart,
  User,
  Calendar,
  MessageCircle,
  FileText,
  Database,
  BarChart,
  Target,
  TrendingUp
} from 'lucide-react';

const Dissertations: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'PhD-Level Writers',
      description: 'Expert dissertation writers with doctoral degrees in your field',
      color: 'bg-navy/10 text-navy'
    },
    {
      icon: Target,
      title: 'Original Research',
      description: 'Comprehensive original research with proper methodology and analysis',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Rigorous quality control and unlimited revisions until satisfaction',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const dissertationTypes = [
    'PhD Dissertation',
    'Master\'s Thesis',
    'Doctoral Thesis',
    'Research Proposal',
    'Literature Review',
    'Methodology Chapter',
    'Data Analysis Chapter',
    'Discussion Chapter',
    'Conclusion Chapter',
    'Abstract Writing',
    'Dissertation Defense',
    'Dissertation Editing'
  ];

  const subjects = [
    { name: 'Business Administration', completed: '450+' },
    { name: 'Psychology', completed: '380+' },
    { name: 'Education', completed: '320+' },
    { name: 'Nursing', completed: '290+' },
    { name: 'Engineering', completed: '250+' },
    { name: 'Social Work', completed: '220+' },
    { name: 'Computer Science', completed: '200+' },
    { name: 'Public Health', completed: '180+' }
  ];

  const testimonials = [
    {
      name: 'Dr. Jennifer Adams',
      role: 'PhD Graduate',
      rating: 5,
      text: 'The dissertation writing service was exceptional. My writer had deep expertise in my field and delivered a comprehensive, well-researched dissertation that exceeded my committee\'s expectations.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80'
    },
    {
      name: 'Robert Thompson',
      role: 'Doctoral Candidate',
      rating: 5,
      text: 'Outstanding support throughout my dissertation journey. The methodology chapter was particularly well-crafted, and the statistical analysis was thorough and accurate.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    }
  ];

  const pricingPlans = [
    {
      level: 'Master\'s Thesis',
      price: '$34.99',
      features: ['50-100 pages', '30+ sources', '14-day delivery', 'Methodology support', 'Free revisions']
    },
    {
      level: 'PhD Dissertation',
      price: '$39.99',
      features: ['100-300 pages', '50+ sources', '21-day delivery', 'Original research', 'Defense preparation']
    },
    {
      level: 'Dissertation Chapters',
      price: '$29.99',
      features: ['Individual chapters', '15+ sources', '7-day delivery', 'Expert analysis', 'Unlimited revisions']
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Consultation',
      description: 'Initial consultation to understand your research topic and requirements',
      icon: MessageCircle
    },
    {
      step: '02',
      title: 'Research Design',
      description: 'Develop comprehensive research methodology and framework',
      icon: Target
    },
    {
      step: '03',
      title: 'Writing Process',
      description: 'Systematic writing with regular updates and milestone reviews',
      icon: FileText
    },
    {
      step: '04',
      title: 'Quality Review',
      description: 'Thorough editing, formatting, and plagiarism verification',
      icon: Shield
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
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <h5 className="text-gray-300 font-medium">Professional Dissertation Writing Service</h5>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Expert <span className="text-purple-400">Dissertation</span><br />
                Writing by PhD <span className="text-cyan-400">Specialists</span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get comprehensive dissertation writing support from PhD-level experts. From proposal to defense, we provide original research, rigorous methodology, and exceptional academic writing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/place-order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Order Dissertation
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
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80" 
                alt="Dissertation Writing Service" 
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
              />
              
              {/* Floating Stats Cards */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">2,500+</div>
                    <div className="text-gray-600 text-sm">Dissertations</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-green-600">98%</div>
                    <div className="text-gray-600 text-sm">Success Rate</div>
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
              Why Choose Our Dissertation Writing Service?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive dissertation support with expert guidance, original research, and rigorous academic standards
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

      {/* Dissertation Types Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Dissertation Services We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive dissertation support from proposal to defense across all academic levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dissertationTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-purple-600" />
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
              Dissertations by Academic Field
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We have successfully completed dissertations across various academic disciplines
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{subject.name}</h4>
                <p className="text-purple-600 font-semibold">{subject.completed}</p>
                <p className="text-gray-600 text-sm mb-4">Completed</p>
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
              Dissertation Writing Prices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Competitive pricing for comprehensive dissertation writing services. All prices are per page (275 words)
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
              Our Dissertation Writing Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Structured approach to dissertation writing with expert guidance at every step
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: GraduationCap, number: '2,500+', label: 'Dissertations Completed', color: 'bg-blue-50 text-blue-600' },
              { icon: Users, number: '98%', label: 'Success Rate', color: 'bg-purple-50 text-purple-600' },
              { icon: Clock, number: '24/7', label: 'Expert Support', color: 'bg-green-50 text-green-600' },
              { icon: Award, number: '15+', label: 'Years Experience', color: 'bg-orange-50 text-orange-600' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className={`w-20 h-20 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <stat.icon className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say About Our Dissertation Service
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from PhD graduates who achieved success with our dissertation writing service
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
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Dissertation Journey?
          </h2>
          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join hundreds of PhD graduates who have successfully defended their dissertations with our expert writing service. 
            Get comprehensive support from proposal to defense with our PhD-level writers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/place-order"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Order Dissertation Now
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 font-semibold rounded-full transition-all duration-300"
            >
              Get Free Consultation
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dissertations;
