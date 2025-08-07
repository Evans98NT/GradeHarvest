import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Check, 
  ArrowUpRight,
  PenTool,
  Award,
  Shield,
  Zap,
  Heart,
  User,
  Calendar,
  MessageCircle,
  FileText,
  Calculator,
  Lightbulb,
  Target,
  TrendingUp,
  Brain,
  BarChart
} from 'lucide-react';

const HomeworkHelp: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Round-the-clock homework assistance for urgent assignments',
      color: 'bg-navy/10 text-navy'
    },
    {
      icon: Users,
      title: 'Subject Experts',
      description: 'Qualified tutors and experts in all academic subjects',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Target,
      title: 'Step-by-Step Solutions',
      description: 'Detailed explanations to help you understand the concepts',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const subjects = [
    { name: 'Mathematics', icon: Calculator, assignments: '5,200+' },
    { name: 'Science', icon: Lightbulb, assignments: '4,800+' },
    { name: 'English', icon: PenTool, assignments: '4,500+' },
    { name: 'History', icon: BookOpen, assignments: '3,900+' },
    { name: 'Psychology', icon: Brain, assignments: '3,600+' },
    { name: 'Business', icon: TrendingUp, assignments: '3,400+' },
    { name: 'Computer Science', icon: FileText, assignments: '3,200+' },
    { name: 'Economics', icon: BarChart, assignments: '2,800+' }
  ];

  const homeworkTypes = [
    'Math Problems',
    'Science Experiments',
    'Essay Assignments',
    'Research Projects',
    'Case Studies',
    'Lab Reports',
    'Book Reports',
    'Presentations',
    'Problem Sets',
    'Discussion Posts',
    'Worksheets',
    'Online Quizzes'
  ];

  const testimonials = [
    {
      name: 'Lisa Chen',
      role: 'High School Student',
      rating: 5,
      text: 'The homework help service saved my grades! The explanations were clear and helped me understand complex math concepts. I went from failing to getting A\'s.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    },
    {
      name: 'James Wilson',
      role: 'College Student',
      rating: 5,
      text: 'Excellent service with quick turnaround times. The tutors are knowledgeable and patient. They helped me with chemistry homework that I was completely stuck on.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    }
  ];

  const pricingPlans = [
    {
      level: 'Elementary',
      price: '$8.99',
      features: ['Basic homework help', 'Simple explanations', '24-hour delivery', 'Email support', 'Free revisions']
    },
    {
      level: 'High School',
      price: '$12.99',
      features: ['Advanced problem solving', 'Detailed explanations', '12-hour delivery', 'Live chat support', 'Study guides']
    },
    {
      level: 'College',
      price: '$16.99',
      features: ['Expert-level assistance', 'Complex problem solving', '6-hour delivery', 'Priority support', 'Tutoring sessions']
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: 'Fast Turnaround',
      description: 'Get your homework completed quickly without compromising quality'
    },
    {
      icon: Brain,
      title: 'Learn While You Go',
      description: 'Understand concepts through detailed explanations and examples'
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'Accurate solutions with step-by-step working and explanations'
    },
    {
      icon: Users,
      title: 'Expert Tutors',
      description: 'Work with qualified tutors who specialize in your subject area'
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
                <PenTool className="w-6 h-6 text-purple-400" />
                <h5 className="text-gray-300 font-medium">Professional Homework Help Service</h5>
              </div>
              
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Expert <span className="text-purple-400">Homework Help</span><br />
                for Academic <span className="text-cyan-400">Success</span>
              </h1>
              
              <p className="text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Get instant homework assistance from qualified tutors. Whether it's math problems, science experiments, or essay assignments, we provide step-by-step solutions that help you learn.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/place-order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Get Homework Help
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
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&h=980&q=80" 
                alt="Homework Help Service" 
                className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
              />
              
              {/* Floating Stats Cards */}
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-green-600">30,000+</div>
                    <div className="text-gray-600 text-sm">Assignments</div>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-blue-600">24/7</div>
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
              Why Choose Our Homework Help Service?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive homework assistance with expert tutors, fast delivery, and detailed explanations
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

      {/* Subjects Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Subjects We Cover
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get homework help across all academic subjects from elementary to college level
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <subject.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{subject.name}</h4>
                <p className="text-blue-600 font-semibold">{subject.assignments}</p>
                <p className="text-gray-600 text-sm mb-4">Assignments Completed</p>
                <a href="/place-order" className="text-blue-600 hover:underline font-medium">
                  Get Help →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Homework Types Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Types of Homework We Help With
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From simple worksheets to complex projects, we provide assistance with all types of homework assignments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeworkTypes.map((type, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <PenTool className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{type}</h4>
                    <a href="/place-order" className="text-blue-600 text-sm hover:underline">
                      Get Help →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Benefits of Our Homework Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              More than just answers - we help you understand and learn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h4>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-blue-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Affordable Homework Help Prices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparent pricing based on academic level. All prices are per assignment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${index === 1 ? 'border-blue-600 transform scale-105' : 'border-gray-200'}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.level}</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">{plan.price}</div>
                  <p className="text-gray-600">per assignment</p>
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
                  Get Help Now
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How Our Homework Help Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple process to get expert help with your homework assignments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Assignment', description: 'Upload your homework questions or requirements', icon: FileText },
              { step: '02', title: 'Expert Match', description: 'We match you with a qualified tutor in your subject', icon: Users },
              { step: '03', title: 'Get Solution', description: 'Receive detailed step-by-step solutions and explanations', icon: Lightbulb },
              { step: '04', title: 'Learn & Improve', description: 'Review the solution and ask questions if needed', icon: TrendingUp }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  {item.step}
                </div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
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
              What Students Say About Our Homework Help
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read testimonials from students who improved their grades with our homework assistance
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
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Need Help with Your Homework Right Now?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Don't struggle with difficult assignments alone. Get instant homework help from qualified tutors who will guide you through step-by-step solutions and help you understand the concepts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/place-order"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-green-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Get Homework Help Now
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 font-semibold rounded-full transition-all duration-300"
            >
              Chat with Tutor
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeworkHelp;
