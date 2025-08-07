import React from 'react';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Heart, 
  GraduationCap, 
  ArrowUpRight,
  Check,
  Star,
  Award,
  Shield,
  Target,
  Lightbulb,
  Globe,
  TrendingUp,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const AboutUs: React.FC = () => {
  const stats = [
    { icon: Users, number: '200K+', label: 'Successfully Served', color: 'bg-blue-50 text-blue-600' },
    { icon: BookOpen, number: '50M+', label: 'Papers Completed', color: 'bg-purple-50 text-purple-600' },
    { icon: Heart, number: '99%', label: 'Satisfaction Rate', color: 'bg-green-50 text-green-600' },
    { icon: GraduationCap, number: '16+', label: 'Years Experience', color: 'bg-orange-50 text-orange-600' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Academic Integrity',
      description: 'We maintain the highest standards of academic honesty and provide original, plagiarism-free content for all our clients.',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Our commitment to excellence drives us to deliver top-quality academic writing services that exceed expectations.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: 'We understand the importance of deadlines and guarantee timely delivery of all academic assignments.',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: Users,
      title: 'Student Success',
      description: 'Your academic success is our primary goal. We provide personalized support to help you achieve your educational objectives.',
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Academic Officer',
      expertise: 'PhD in English Literature, 15+ years in academic writing',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80'
    },
    {
      name: 'Prof. Michael Chen',
      role: 'Director of Research',
      expertise: 'PhD in Computer Science, Research methodology expert',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Quality Assurance Manager',
      expertise: 'PhD in Psychology, Academic standards specialist',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&h=761&q=80'
    }
  ];

  const achievements = [
    '9/10 Average Satisfaction Rate',
    '96% Completion Rate',
    'Expert Writers & 24/7 Support',
    'Plagiarism-Free Guarantee',
    'Unlimited Revisions',
    'Money-Back Guarantee'
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="w-3 h-3 bg-navy-light rounded-full animate-pulse"></span>
                <h5 className="text-gray-300 font-medium">About GradeHarvest</h5>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Empowering <span className="text-purple-400">Academic</span><br />
                Excellence Since <span className="text-cyan-400">2008</span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                We are a leading academic writing service dedicated to helping students achieve their educational goals through expert assistance and unwavering support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/place-order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-navy hover:bg-navy-dark text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
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

            <div className="relative mt-8 lg:mt-0">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&h=980&q=80" 
                  alt="Students collaborating" 
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
                />
                
                {/* Floating Stats Card */}
                <div className="hidden sm:block absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                  <div className="text-navy font-bold text-lg">200k+</div>
                  <div className="text-gray-600 text-sm">Happy Students</div>
                  <div className="flex -space-x-2 mt-2">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white"></div>
                    ))}
                  </div>
                </div>

                <div className="hidden sm:block absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-bold text-green-600">16+ Years</div>
                      <div className="text-gray-600 text-sm">Experience</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-8 bg-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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

      {/* Our Story Section */}
      <section className="py-20 bg-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1484&h=989&q=80" 
                alt="Our Story"
                className="rounded-2xl shadow-lg w-full"
              />
              
              {/* Floating Achievement Card */}
              <div className="hidden sm:block absolute -bottom-8 -left-8 bg-white rounded-2xl p-6 shadow-lg z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Star className="w-8 h-8 text-white fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-lg">4.8/5</div>
                    <div className="text-gray-600 text-sm">Customer Rating</div>
                    <div className="flex mt-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <h5 className="text-blue-600 font-medium">Our Story</h5>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Founded on the Belief That Every Student Deserves Success
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  GradeHarvest was founded in 2008 with a simple yet powerful mission: to provide students with the academic support they need to succeed. What started as a small team of passionate educators has grown into a comprehensive academic writing service trusted by over 200,000 students worldwide.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Our journey began when our founders, experienced academics themselves, recognized the growing challenges students face in today's competitive educational landscape. They envisioned a platform where expert knowledge meets personalized support, creating opportunities for academic excellence.
                </p>
              </div>

              <div className="space-y-4">
                {achievements.slice(0, 3).map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Driven by purpose and guided by values, we're committed to transforming academic experiences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To empower students worldwide by providing exceptional academic writing services that foster learning, enhance understanding, and promote academic success. We strive to bridge the gap between academic challenges and student potential.
              </p>
              <ul className="space-y-3">
                {[
                  'Deliver high-quality, original academic content',
                  'Support student learning and development',
                  'Maintain academic integrity and ethical standards',
                  'Provide accessible and affordable services'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To be the world's most trusted academic partner, recognized for our commitment to excellence, innovation, and student success. We envision a future where every student has access to the support they need to achieve their academic dreams.
              </p>
              <ul className="space-y-3">
                {[
                  'Global leader in academic support services',
                  'Pioneer in educational technology and innovation',
                  'Champion of academic accessibility and inclusion',
                  'Catalyst for student success worldwide'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our commitment to student success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-blue-600 hover:text-white border border-gray-100">
                <div className={`w-20 h-20 ${value.color} rounded-full flex items-center justify-center mb-6 group-hover:bg-white group-hover:text-blue-600 transition-all duration-300`}>
                  <value.icon className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold mb-4 group-hover:text-white">
                  {value.title}
                </h4>
                <p className="text-gray-600 group-hover:text-blue-100">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Meet Our Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experienced academics and industry professionals dedicated to your success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center">
                <div className="relative mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h4>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <h5 className="text-blue-600 font-medium">Why Choose GradeHarvest</h5>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Your Success is Our Priority
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We combine academic expertise with cutting-edge technology to deliver exceptional results. Our commitment to quality, reliability, and student success sets us apart in the academic support industry.
                </p>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-600">{achievement}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <a
                  href="/place-order"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300"
                >
                  Get Started Today
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 -right-8 bg-yellow-100 rounded-2xl p-4 shadow-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">99%</div>
                    <div className="text-gray-600 text-sm">Success Rate</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-lg z-10">
                <div className="text-blue-600 font-bold text-lg">24/7</div>
                <div className="text-gray-600 text-sm mb-2">Support Available</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600 text-sm">(979) 406-4586</span>
                </div>
              </div>

              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&h=916&q=80" 
                  alt="Why Choose Us"
                  className="rounded-2xl shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Global Impact</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Serving students across continents and helping shape the future of education worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Global Presence</h3>
              <p className="text-gray-600">
                Operating across 50+ countries, we provide localized support while maintaining international standards of excellence.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Expert Network</h3>
              <p className="text-gray-600">
                Our team of 5,000+ qualified writers and researchers spans diverse academic disciplines and expertise areas.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Quality Assurance</h3>
              <p className="text-gray-600">
                Multi-tier quality control process ensures every piece of work meets the highest academic standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Academic Excellence?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join over 200,000 students who have trusted GradeHarvest with their academic success. 
              Let us help you achieve your educational goals with our expert writing services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/place-order"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                Place Your Order
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="/testimonials"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-full transition-all duration-300"
              >
                Read Success Stories
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our services? Our support team is available 24/7 to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Call Us</h4>
              <p className="text-gray-600 mb-2">24/7 Support Available</p>
              <a href="tel:(979)406-4586" className="text-blue-600 font-semibold hover:underline">
                (979) 406-4586
              </a>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Email Us</h4>
              <p className="text-gray-600 mb-2">Quick Response Guaranteed</p>
              <a href="mailto:support@gradeharvest.com" className="text-purple-600 font-semibold hover:underline">
                support@gradeharvest.com
              </a>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">Visit Us</h4>
              <p className="text-gray-600 mb-2">Global Headquarters</p>
              <p className="text-green-600 font-semibold">
                123 Academic St.<br />
                Education City, EC 12345
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
