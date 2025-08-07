import React from 'react';
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
  ArrowUpRight,
  Play,
  Check,
  Star,
  User,
  Calendar,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Send
} from 'lucide-react';

const LandingPage: React.FC = () => {
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

  const features = [
    {
      icon: BookOpen,
      title: 'Academic Writing',
      description: 'Professional academic writing services for all subjects and levels',
      color: 'bg-navy/10 text-navy'
    },
    {
      icon: Users,
      title: 'Expert Writers',
      description: 'Work with experienced academic writers verified for quality',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Timely Delivery',
      description: 'Get your papers delivered on time, every time with quality assurance',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const courses = [
    {
      id: 1,
      title: 'Research Paper Writing',
      subject: 'Academic Writing',
      level: 'All Levels',
      duration: '2-5 days',
      rating: 4.8,
      reviews: 324,
      price: 25,
      instructor: 'Dr. Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80'
    },
    {
      id: 2,
      title: 'Essay Writing Mastery',
      subject: 'Academic Writing',
      level: 'Beginner',
      duration: '1-3 days',
      rating: 4.9,
      reviews: 567,
      price: 15,
      instructor: 'Prof. Michael Chen',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&h=982&q=80'
    },
    {
      id: 3,
      title: 'Thesis & Dissertation',
      subject: 'Advanced Writing',
      level: 'Advanced',
      duration: '7-14 days',
      rating: 4.7,
      reviews: 189,
      price: 150,
      instructor: 'Dr. Emily Rodriguez',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Graduate Student',
      rating: 5,
      text: 'GradeHarvest helped me meet my deadlines with top-quality papers. The writers are professional and responsive.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80'
    },
    {
      name: 'Michael R.',
      role: 'PhD Candidate',
      rating: 5,
      text: 'Excellent service! My writer understood my requirements perfectly and delivered exceptional work on time.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
    }
  ];

  const blogPosts = [
    {
      id: 1,
      title: 'How to Write a Perfect Research Paper',
      excerpt: 'Learn the essential steps to create compelling research papers that stand out...',
      category: 'Academic Tips',
      author: 'Dr. Johnson',
      date: '15 Jan, 2024',
      comments: 24,
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&h=982&q=80'
    },
    {
      id: 2,
      title: 'Citation Styles Made Simple',
      excerpt: 'Master APA, MLA, and Chicago citation styles with our comprehensive guide...',
      category: 'Writing Guide',
      author: 'Prof. Smith',
      date: '12 Jan, 2024',
      comments: 18,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80'
    },
    {
      id: 3,
      title: 'Time Management for Students',
      excerpt: 'Effective strategies to balance academic work and personal life successfully...',
      category: 'Student Life',
      author: 'Dr. Wilson',
      date: '10 Jan, 2024',
      comments: 32,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=980&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-navy via-navy-light to-purple-900 text-white py-12 sm:py-16 lg:py-20 overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-400 to-navy rounded-lg transform rotate-12 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full transform -rotate-12 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-navy transform rotate-45 opacity-40 animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg transform -rotate-6 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <span className="w-3 h-3 bg-navy-light rounded-full animate-pulse"></span>
                <h5 className="text-gray-300 font-medium text-sm sm:text-base">Your Future, Achieve Success</h5>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                Expert <span className="text-purple-400">Assignment Help</span><br />
                for Guaranteed Academic <span className="text-cyan-400">Success</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Welcome to GradeHarvest, where academic excellence knows no bounds. Whether you're a student, professional, or lifelong learner...
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href="/place-order"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-navy hover:bg-navy-dark text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 text-sm sm:text-base min-h-[48px]"
                >
                  Place Order
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white hover:bg-white hover:text-navy font-semibold rounded-full transition-all duration-300 text-sm sm:text-base min-h-[48px]"
                >
                  Get Started
                  <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&h=980&q=80" 
                  alt="Students studying together" 
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full h-auto"
                />
                
                {/* Floating Stats Cards - Hidden on mobile, visible on tablet+ */}
                <div className="hidden sm:block absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg animate-float">
                  <div className="text-navy font-bold text-base sm:text-lg">200k+</div>
                  <div className="text-gray-600 text-xs sm:text-sm">Satisfied Students</div>
                  <div className="flex -space-x-1 sm:-space-x-2 mt-2">
                    {[
                      'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
                      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80',
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
                      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
                      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
                    ].map((avatar, i) => (
                      <img 
                        key={i} 
                        src={avatar} 
                        alt={`Student ${i + 1}`}
                        className="w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white object-cover"
                      />
                    ))}
                  </div>
                </div>

                <div className="hidden sm:block absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-white rounded-xl p-3 sm:p-4 shadow-lg animate-float" style={{animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-bold text-purple-600 text-sm sm:text-base">20% OFF</div>
                      <div className="text-gray-600 text-xs sm:text-sm">For All Services</div>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block absolute top-1/2 -right-6 xl:-right-8 bg-white rounded-xl p-3 sm:p-4 shadow-lg animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-navy/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-navy" />
                    </div>
                    <div>
                      <div className="text-gray-600 text-xs sm:text-sm">24/7 Support</div>
                      <div className="font-bold text-navy text-sm sm:text-base">(979) 406-4586</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <h5 className="text-center text-gray-500 mb-8 font-medium">TRUSTED BY OVER 200,000 GREAT STUDENTS</h5>
            {/* <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['University A', 'College B', 'Institute C', 'Academy D', 'School E', 'Campus F'].map((brand, index) => (
                <div key={index} className="text-gray-400 font-semibold text-lg">
                  {brand}
                </div>
              ))}
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore 4,000+ Academic Writing Services
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Welcome to our diverse and dynamic service catalog. We're dedicated to providing you with access to high-quality academic assistance
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
                  View Services
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-blue-50 relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Explore 4,000+ Academic Writing Services
              </h2>
            </div>
            <div className="lg:max-w-md">
              <p className="text-gray-600 mb-6">
                Welcome to our diverse and dynamic service catalog. We're dedicated to providing you...
              </p>
              <a href="/services" className="inline-flex items-center text-blue-600 font-semibold hover:underline">
                See All Services
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>

          {/* Service Categories Tabs */}
          <div className="bg-white rounded-2xl p-4 mb-8 shadow-lg">
            <div className="flex flex-wrap gap-4">
              {['All Categories', 'Essays', 'Research Papers', 'Dissertations', 'Case Studies', 'Reports'].map((category, index) => (
                <button
                  key={index}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    index === 0 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-50 text-gray-600 hover:bg-blue-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="relative mb-6">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {course.duration}
                  </div>
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {course.title}
                  </h4>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{course.subject}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-medium">{course.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({course.reviews})</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img 
                        src={`https://images.unsplash.com/photo-${course.id === 1 ? '1494790108755-2616b612b5bc' : course.id === 2 ? '1507003211169-0a1dd7228f2d' : '1573496359142-b8d87734a5a2'}?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80`}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium">{course.instructor}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <h4 className="text-2xl font-bold text-purple-600">${course.price}</h4>
                    <a 
                      href="/place-order" 
                      className="inline-flex items-center text-blue-600 font-semibold hover:underline"
                    >
                      Order Now
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-8 -left-8 bg-purple-100 rounded-2xl p-4 shadow-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">20% OFF</div>
                    <div className="text-gray-600 text-sm">For All Services</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img 
                    src="https://wowtheme7.com/tf/eduall/demo/assets/images/thumbs/about-img1.png" 
                    alt="About 1"
                    className="rounded-2xl shadow-lg w-full"
                  />
                </div>
                <div className="space-y-6 pt-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-600 rounded-xl text-center py-6 px-4 text-white">
                      <h3 className="text-2xl font-bold">16+</h3>
                      <p className="text-sm">Years Experience</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl text-center py-6 px-4 text-white">
                      <h3 className="text-2xl font-bold">3.2k</h3>
                      <p className="text-sm">Happy Students</p>
                    </div>
                  </div>
                  <img 
                    src="https://wowtheme7.com/tf/eduall/demo/assets/images/thumbs/about-img2.png" 
                    alt="About 2"
                    className="rounded-2xl shadow-lg w-full"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <h5 className="text-blue-600 font-medium">About GradeHarvest</h5>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  The Place Where You Can Achieve Academic Excellence
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to GradeHarvest, where learning knows no bounds. Whether you're a student, professional, or lifelong learner, we're here to support your academic journey with expert writing services.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Our Mission</h4>
                    <p className="text-gray-600">
                      Driven by a team of dedicated educators and writers, we strive to create a supportive environment for academic success.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 mb-2">Our Vision</h4>
                    <p className="text-gray-600">
                      Whether you're seeking to improve your grades or exploring new academic horizons, we're here to accompany you every step of the way.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start gap-6 pt-8 border-t border-gray-200">
                <a
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300"
                >
                  Read More
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
                {/* <div className="flex items-center gap-4">
                  <img 
                    src="/api/placeholder/60/60" 
                    alt="CEO"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">John Smith</div>
                    <div className="text-sm text-gray-600">CEO of GradeHarvest</div>
                  </div>
                </div> */}
              </div>
            </div>
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
                  <h5 className="text-blue-600 font-medium">Why Choose Us</h5>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Our Commitment to Excellence
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  We are passionate about transforming academic lives through quality writing services. Founded with a vision to make academic success accessible to all.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  '9/10 Average Satisfaction Rate',
                  '96% Completion Rate',
                  'Expert Writers & 24/7 Support'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <a
                  href="/about"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300"
                >
                  Read More
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-8 -right-8 bg-yellow-100 rounded-2xl p-4 shadow-lg z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">4.6 (2.4k)</div>
                    <div className="text-gray-600 text-sm">AVG Reviews</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-lg z-10">
                <div className="text-blue-600 font-bold text-lg">200k+</div>
                <div className="text-gray-600 text-sm mb-2">Satisfied Students</div>
                <div className="flex -space-x-2">
                  {[
                    'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
                    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80',
                    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
                    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80'
                  ].map((avatar, i) => (
                    <img 
                      key={i} 
                      src={avatar} 
                      alt={`Student ${i + 1}`}
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
              </div>

              <div className="relative">
                <img 
                  src="https://wowtheme7.com/tf/eduall/demo/assets/images/thumbs/choose-us-img1.png" 
                  alt="Why Choose Us"
                  className="rounded-2xl shadow-lg w-full"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <button className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                    <Play className="w-8 h-8 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, number: '200K+', label: 'Successfully Served', color: 'bg-blue-50 text-blue-600' },
              { icon: BookOpen, number: '50M+', label: 'Papers Completed', color: 'bg-purple-50 text-purple-600' },
              { icon: Heart, number: '99%', label: 'Satisfaction Rate', color: 'bg-blue-50 text-blue-600' },
              { icon: GraduationCap, number: '55.6K', label: 'Writers Community', color: 'bg-purple-50 text-purple-600' }
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
      <section className="py-20 bg-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img 
                src="https://wowtheme7.com/tf/eduall/demo/assets/images/thumbs/testimonial-img1.png" 
                alt="Testimonial"
                className="rounded-2xl shadow-lg w-full"
              />
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 bg-blue-600 rounded-full"></span>
                  <h5 className="text-blue-600 font-medium">What Our Students Say</h5>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-6">
                  Testimonials from Happy Students
                </h2>
                <p className="text-gray-600">
                  Over 50k+ Students are already getting assignment GradeHarvest Platform
                </p>
              </div>

              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                        <p className="text-gray-600 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <a
                  href="/testimonials"
                  className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-300"
                >
                  Read More Testimonials
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Recent Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest academic writing tips, guides, and insights from our expert writers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="relative mb-6">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <span className="inline-block px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg">
                    {post.category}
                  </span>
                  
                  <h4 className="text-xl font-bold text-gray-800 line-clamp-2">
                    {post.title}
                  </h4>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>

                  <div className="pt-4 border-t border-gray-100">
                    <a 
                      href={`/blog/${post.id}`} 
                      className="inline-flex items-center text-blue-600 font-semibold hover:underline"
                    >
                      Read More
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-3 h-3 bg-white rounded-full"></span>
                <h5 className="text-white font-medium">Get Quality Service</h5>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Get Quality Academic Writing Services From GradeHarvest
              </h2>
              <a
                href="/place-order"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
              >
                Get Started Now
                <ArrowUpRight className="w-5 h-5 ml-2" />
              </a>
            </div>
            <div className="hidden lg:block">
              <img 
                src="/api/placeholder/400/300" 
                alt="Quality Service"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Subject Areas Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Popular Subject Areas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We cover a wide range of academic subjects with expert writers in each field
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {subjects.map((subject, index) => {
              const IconComponent = subject.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                  <div className="flex flex-col items-center space-y-3">
                    <div className={`w-12 h-12 ${subject.color} bg-opacity-10 rounded-full flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 ${subject.color}`} />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{subject.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Writers Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Are You a Writer?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join our community of professional academic writers and turn your expertise into income. 
            Flexible schedule, competitive pay, and steady work opportunities await.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/writer-landing"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Learn More
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/writer-login"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-gray-800 font-semibold rounded-full transition-all duration-300"
            >
              Writer Login
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-200 rounded-lg transform rotate-45 animate-bounce"></div>
        </div>

        <div className="py-20 relative z-10">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">GradeHarvest</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  GradeHarvest exceeded all my expectations! The writers were not only experts but also incredibly supportive.
                </p>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'linkedin', 'instagram'].map((social) => (
                    <a
                      key={social}
                      href={`#${social}`}
                      className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-sm font-bold">{social[0].toUpperCase()}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Navigation</h4>
                <ul className="space-y-3">
                  {['About us', 'Services', 'Writers', 'FAQs', 'Blog'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Services</h4>
                <ul className="space-y-3">
                  {['Essay Writing', 'Research Papers', 'Dissertations', 'Case Studies', 'Assignments'].map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Contact Us</h4>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <div>
                      <a href="tel:(979)406-4586" className="text-gray-600 hover:text-blue-600 block">
                        (979) 406-4586
                      </a>
                      <a href="tel:(979)406-4586" className="text-gray-600 hover:text-blue-600 block">
                        (979) 406-4586
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <div>
                      <a href="mailto:support@gradeharvest.com" className="text-gray-600 hover:text-blue-600 block">
                        support@gradeharvest.com
                      </a>
                      <a href="mailto:info@gradeharvest.com" className="text-gray-600 hover:text-blue-600 block">
                        info@gradeharvest.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="text-gray-600 block">123 Academic St.</span>
                      <span className="text-gray-600 block">Education City, EC 12345</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-800 mb-6">Subscribe Here</h4>
                <p className="text-gray-600 mb-4">
                  Enter your email address to register to our newsletter subscription
                </p>
                <form className="relative">
                  <input
                    type="email"
                    placeholder="Email..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 py-8 relative z-10">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-600">
                Copyright © 2024 <span className="font-semibold">GradeHarvest</span> All Rights Reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
