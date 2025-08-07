import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Users, 
  Clock, 
  Star, 
  ArrowUpRight,
  ChevronDown,
  Grid3X3,
  List,
  Briefcase,
  Brain,
  Heart,
  Monitor,
  TrendingUp,
  Megaphone,
  Scale,
  Lightbulb,
  Calculator,
  Globe,
  Microscope,
  Palette,
  Music,
  Camera,
  Wrench,
  Building,
  Leaf,
  Zap,
  Target,
  PieChart,
  Code,
  Database,
  Smartphone,
  Wifi,
  Shield,
  Award,
  CheckCircle
} from 'lucide-react';

interface Service {
  id: number;
  title: string;
  category: string;
  subject: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  level: string;
  icon: any;
  popular: boolean;
  urgent: boolean;
}

const AllServices: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSubject, setSelectedSubject] = useState('All Subjects');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [sortBy, setSortBy] = useState('Popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All Categories',
    'Essays & Papers',
    'Research & Analysis',
    'Dissertations & Theses',
    'Case Studies',
    'Reports & Presentations',
    'Assignments & Homework',
    'Lab Reports',
    'Creative Writing',
    'Business Documents',
    'Technical Writing',
    'Literature Reviews'
  ];

  const subjects = [
    { name: 'All Subjects', icon: BookOpen },
    { name: 'Business & Management', icon: Briefcase },
    { name: 'Psychology', icon: Brain },
    { name: 'Nursing & Healthcare', icon: Heart },
    { name: 'Computer Science', icon: Monitor },
    { name: 'Literature & English', icon: BookOpen },
    { name: 'Economics', icon: TrendingUp },
    { name: 'Marketing', icon: Megaphone },
    { name: 'Political Science', icon: Scale },
    { name: 'Philosophy', icon: Lightbulb },
    { name: 'Mathematics', icon: Calculator },
    { name: 'History', icon: Globe },
    { name: 'Biology', icon: Microscope },
    { name: 'Art & Design', icon: Palette },
    { name: 'Music', icon: Music },
    { name: 'Photography', icon: Camera },
    { name: 'Engineering', icon: Wrench },
    { name: 'Architecture', icon: Building },
    { name: 'Environmental Science', icon: Leaf },
    { name: 'Physics', icon: Zap },
    { name: 'Statistics', icon: PieChart },
    { name: 'Programming', icon: Code },
    { name: 'Data Science', icon: Database },
    { name: 'Mobile Development', icon: Smartphone },
    { name: 'Network Security', icon: Shield },
    { name: 'Web Development', icon: Wifi }
  ];

  const levels = ['All Levels', 'High School', 'Undergraduate', 'Graduate', 'PhD', 'Professional'];

  const services: Service[] = [
    // Essays & Papers
    {
      id: 1,
      title: 'Argumentative Essay Writing',
      category: 'Essays & Papers',
      subject: 'Literature & English',
      description: 'Professional argumentative essays with strong thesis statements and compelling evidence.',
      price: 15,
      duration: '1-3 days',
      rating: 4.9,
      reviews: 1247,
      level: 'All Levels',
      icon: FileText,
      popular: true,
      urgent: false
    },
    {
      id: 2,
      title: 'Narrative Essay Writing',
      category: 'Essays & Papers',
      subject: 'Literature & English',
      description: 'Engaging narrative essays that tell compelling stories with proper structure.',
      price: 12,
      duration: '1-2 days',
      rating: 4.8,
      reviews: 892,
      level: 'High School',
      icon: FileText,
      popular: true,
      urgent: false
    },
    {
      id: 3,
      title: 'Descriptive Essay Writing',
      category: 'Essays & Papers',
      subject: 'Literature & English',
      description: 'Vivid descriptive essays that paint clear pictures with detailed imagery.',
      price: 13,
      duration: '1-2 days',
      rating: 4.7,
      reviews: 654,
      level: 'High School',
      icon: FileText,
      popular: false,
      urgent: false
    },
    {
      id: 4,
      title: 'Expository Essay Writing',
      category: 'Essays & Papers',
      subject: 'Literature & English',
      description: 'Clear and informative expository essays that explain complex topics.',
      price: 14,
      duration: '1-3 days',
      rating: 4.8,
      reviews: 743,
      level: 'Undergraduate',
      icon: FileText,
      popular: false,
      urgent: false
    },
    {
      id: 5,
      title: 'Compare and Contrast Essays',
      category: 'Essays & Papers',
      subject: 'Literature & English',
      description: 'Analytical essays comparing and contrasting different subjects or ideas.',
      price: 16,
      duration: '2-3 days',
      rating: 4.9,
      reviews: 567,
      level: 'Undergraduate',
      icon: FileText,
      popular: true,
      urgent: false
    },

    // Research & Analysis
    {
      id: 6,
      title: 'Research Paper Writing',
      category: 'Research & Analysis',
      subject: 'All Subjects',
      description: 'Comprehensive research papers with proper citations and methodology.',
      price: 25,
      duration: '3-7 days',
      rating: 4.9,
      reviews: 2134,
      level: 'All Levels',
      icon: BookOpen,
      popular: true,
      urgent: false
    },
    {
      id: 7,
      title: 'Literature Review',
      category: 'Research & Analysis',
      subject: 'All Subjects',
      description: 'Systematic literature reviews analyzing existing research and studies.',
      price: 30,
      duration: '5-10 days',
      rating: 4.8,
      reviews: 876,
      level: 'Graduate',
      icon: BookOpen,
      popular: true,
      urgent: false
    },
    {
      id: 8,
      title: 'Systematic Review',
      category: 'Research & Analysis',
      subject: 'Healthcare',
      description: 'Evidence-based systematic reviews following PRISMA guidelines.',
      price: 45,
      duration: '7-14 days',
      rating: 4.9,
      reviews: 234,
      level: 'Graduate',
      icon: Heart,
      popular: false,
      urgent: false
    },
    {
      id: 9,
      title: 'Meta-Analysis',
      category: 'Research & Analysis',
      subject: 'Psychology',
      description: 'Statistical meta-analysis combining results from multiple studies.',
      price: 55,
      duration: '10-14 days',
      rating: 4.8,
      reviews: 156,
      level: 'PhD',
      icon: Brain,
      popular: false,
      urgent: false
    },
    {
      id: 10,
      title: 'Annotated Bibliography',
      category: 'Research & Analysis',
      subject: 'All Subjects',
      description: 'Comprehensive annotated bibliographies with critical analysis.',
      price: 20,
      duration: '2-5 days',
      rating: 4.7,
      reviews: 432,
      level: 'Undergraduate',
      icon: BookOpen,
      popular: false,
      urgent: false
    },

    // Business & Management
    {
      id: 11,
      title: 'Business Plan Writing',
      category: 'Business Documents',
      subject: 'Business & Management',
      description: 'Professional business plans with market analysis and financial projections.',
      price: 75,
      duration: '7-14 days',
      rating: 4.9,
      reviews: 345,
      level: 'Professional',
      icon: Briefcase,
      popular: true,
      urgent: false
    },
    {
      id: 12,
      title: 'Marketing Strategy Analysis',
      category: 'Business Documents',
      subject: 'Marketing',
      description: 'Comprehensive marketing strategy analysis and recommendations.',
      price: 35,
      duration: '3-7 days',
      rating: 4.8,
      reviews: 567,
      level: 'Undergraduate',
      icon: Megaphone,
      popular: true,
      urgent: false
    },
    {
      id: 13,
      title: 'Financial Analysis Report',
      category: 'Business Documents',
      subject: 'Economics',
      description: 'Detailed financial analysis with charts, graphs, and recommendations.',
      price: 40,
      duration: '3-7 days',
      rating: 4.8,
      reviews: 289,
      level: 'Graduate',
      icon: TrendingUp,
      popular: false,
      urgent: false
    },
    {
      id: 14,
      title: 'SWOT Analysis',
      category: 'Business Documents',
      subject: 'Business & Management',
      description: 'Strategic SWOT analysis for businesses and organizations.',
      price: 25,
      duration: '2-4 days',
      rating: 4.7,
      reviews: 456,
      level: 'Undergraduate',
      icon: Target,
      popular: false,
      urgent: false
    },

    // Computer Science & Technology
    {
      id: 15,
      title: 'Programming Assignment',
      category: 'Assignments & Homework',
      subject: 'Computer Science',
      description: 'Custom programming solutions in various languages (Python, Java, C++, etc.).',
      price: 30,
      duration: '2-5 days',
      rating: 4.9,
      reviews: 1234,
      level: 'All Levels',
      icon: Code,
      popular: true,
      urgent: true
    },
    {
      id: 16,
      title: 'Database Design Project',
      category: 'Technical Writing',
      subject: 'Computer Science',
      description: 'Complete database design with ER diagrams and SQL implementation.',
      price: 45,
      duration: '5-10 days',
      rating: 4.8,
      reviews: 234,
      level: 'Undergraduate',
      icon: Database,
      popular: false,
      urgent: false
    },
    {
      id: 17,
      title: 'Web Development Project',
      category: 'Technical Writing',
      subject: 'Web Development',
      description: 'Full-stack web applications with modern frameworks and technologies.',
      price: 65,
      duration: '7-14 days',
      rating: 4.9,
      reviews: 345,
      level: 'Graduate',
      icon: Wifi,
      popular: true,
      urgent: false
    },
    {
      id: 18,
      title: 'Mobile App Development',
      category: 'Technical Writing',
      subject: 'Mobile Development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      price: 85,
      duration: '10-21 days',
      rating: 4.8,
      reviews: 123,
      level: 'Graduate',
      icon: Smartphone,
      popular: false,
      urgent: false
    },

    // Healthcare & Nursing
    {
      id: 19,
      title: 'Nursing Care Plan',
      category: 'Reports & Presentations',
      subject: 'Nursing & Healthcare',
      description: 'Comprehensive nursing care plans with NANDA diagnoses.',
      price: 28,
      duration: '2-4 days',
      rating: 4.9,
      reviews: 789,
      level: 'Undergraduate',
      icon: Heart,
      popular: true,
      urgent: true
    },
    {
      id: 20,
      title: 'Medical Case Study',
      category: 'Case Studies',
      subject: 'Nursing & Healthcare',
      description: 'Detailed medical case studies with diagnosis and treatment plans.',
      price: 35,
      duration: '3-7 days',
      rating: 4.8,
      reviews: 456,
      level: 'Graduate',
      icon: Heart,
      popular: true,
      urgent: false
    },
    {
      id: 21,
      title: 'Health Assessment Report',
      category: 'Reports & Presentations',
      subject: 'Nursing & Healthcare',
      description: 'Comprehensive health assessment reports with recommendations.',
      price: 32,
      duration: '3-5 days',
      rating: 4.7,
      reviews: 234,
      level: 'Undergraduate',
      icon: Heart,
      popular: false,
      urgent: false
    },

    // Psychology
    {
      id: 22,
      title: 'Psychology Research Paper',
      category: 'Research & Analysis',
      subject: 'Psychology',
      description: 'APA-formatted psychology research papers with statistical analysis.',
      price: 28,
      duration: '3-7 days',
      rating: 4.8,
      reviews: 567,
      level: 'Undergraduate',
      icon: Brain,
      popular: true,
      urgent: false
    },
    {
      id: 23,
      title: 'Psychological Assessment',
      category: 'Reports & Presentations',
      subject: 'Psychology',
      description: 'Professional psychological assessments and evaluations.',
      price: 40,
      duration: '5-10 days',
      rating: 4.9,
      reviews: 234,
      level: 'Graduate',
      icon: Brain,
      popular: false,
      urgent: false
    },
    {
      id: 24,
      title: 'Behavioral Analysis Report',
      category: 'Reports & Presentations',
      subject: 'Psychology',
      description: 'Detailed behavioral analysis with intervention strategies.',
      price: 35,
      duration: '3-7 days',
      rating: 4.7,
      reviews: 345,
      level: 'Graduate',
      icon: Brain,
      popular: false,
      urgent: false
    },

    // Dissertations & Theses
    {
      id: 25,
      title: 'Master\'s Thesis',
      category: 'Dissertations & Theses',
      subject: 'All Subjects',
      description: 'Complete master\'s thesis with original research and analysis.',
      price: 200,
      duration: '30-60 days',
      rating: 4.9,
      reviews: 89,
      level: 'Graduate',
      icon: GraduationCap,
      popular: true,
      urgent: false
    },
    {
      id: 26,
      title: 'PhD Dissertation',
      category: 'Dissertations & Theses',
      subject: 'All Subjects',
      description: 'Comprehensive PhD dissertation with original contribution to knowledge.',
      price: 500,
      duration: '60-120 days',
      rating: 4.9,
      reviews: 34,
      level: 'PhD',
      icon: GraduationCap,
      popular: true,
      urgent: false
    },
    {
      id: 27,
      title: 'Thesis Proposal',
      category: 'Dissertations & Theses',
      subject: 'All Subjects',
      description: 'Well-structured thesis proposals with clear methodology.',
      price: 75,
      duration: '7-14 days',
      rating: 4.8,
      reviews: 156,
      level: 'Graduate',
      icon: GraduationCap,
      popular: false,
      urgent: false
    },

    // Lab Reports & Technical
    {
      id: 28,
      title: 'Chemistry Lab Report',
      category: 'Lab Reports',
      subject: 'Chemistry',
      description: 'Detailed chemistry lab reports with data analysis and conclusions.',
      price: 22,
      duration: '2-4 days',
      rating: 4.7,
      reviews: 345,
      level: 'Undergraduate',
      icon: Microscope,
      popular: false,
      urgent: true
    },
    {
      id: 29,
      title: 'Physics Lab Report',
      category: 'Lab Reports',
      subject: 'Physics',
      description: 'Comprehensive physics lab reports with calculations and graphs.',
      price: 24,
      duration: '2-4 days',
      rating: 4.8,
      reviews: 234,
      level: 'Undergraduate',
      icon: Zap,
      popular: false,
      urgent: true
    },
    {
      id: 30,
      title: 'Biology Lab Report',
      category: 'Lab Reports',
      subject: 'Biology',
      description: 'Scientific biology lab reports with proper methodology and results.',
      price: 20,
      duration: '2-3 days',
      rating: 4.7,
      reviews: 456,
      level: 'Undergraduate',
      icon: Microscope,
      popular: false,
      urgent: true
    }
  ];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || service.category === selectedCategory;
    const matchesSubject = selectedSubject === 'All Subjects' || service.subject === selectedSubject;
    const matchesLevel = selectedLevel === 'All Levels' || service.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesSubject && matchesLevel;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'Popular':
        return b.reviews - a.reviews;
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating':
        return b.rating - a.rating;
      case 'Newest':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  const ServiceCard = ({ service }: { service: Service }) => {
    const IconComponent = service.icon;
    
    if (viewMode === 'list') {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <IconComponent className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  {service.popular && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      Popular
                    </span>
                  )}
                  {service.urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {service.subject}
                  </span>
                  <span className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    {service.level}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration}
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    {service.rating} ({service.reviews})
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-2xl font-bold text-green-600 mb-2">
                ${service.price}
              </div>
              <Link
                to="/place-order"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Order Now
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex space-x-2">
            {service.popular && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                Popular
              </span>
            )}
            {service.urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Urgent
              </span>
            )}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              {service.subject}
            </span>
            <span className="flex items-center">
              <GraduationCap className="w-4 h-4 mr-1" />
              {service.level}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {service.duration}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
              {service.rating} ({service.reviews})
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            ${service.price}
          </div>
          <Link
            to="/place-order"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Order Now
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore 4,000+ Academic Writing Services
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Welcome to our diverse and dynamic service catalog. We're dedicated to providing you with access to high-quality academic assistance across all subjects and levels.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-6">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services, subjects, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors lg:hidden"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ${showFilters ? 'block' : 'hidden lg:grid'}`}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              {subjects.map(subject => (
                <option key={subject.name} value={subject.name}>{subject.name}</option>
              ))}
            </select>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="Popular">Most Popular</option>
              <option value="Price: Low to High">Price: Low to High</option>
              <option value="Price: High to Low">Price: High to Low</option>
              <option value="Rating">Highest Rated</option>
              <option value="Newest">Newest</option>
            </select>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {sortedServices.length} Services Found
          </h2>
          <div className="text-sm text-gray-600">
            Showing {sortedServices.length} of {services.length} total services
          </div>
        </div>

        {/* Services Grid/List */}
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }`}>
          {sortedServices.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Load More Button */}
        {sortedServices.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
              Load More Services
              <ChevronDown className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {/* No Results */}
        {sortedServices.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all categories.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All Categories');
                setSelectedSubject('All Subjects');
                setSelectedLevel('All Levels');
              }}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Popular Categories Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Subject Areas</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our most requested academic subjects with expert writers in each field
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {subjects.slice(1, 13).map((subject, index) => {
              const IconComponent = subject.icon;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedSubject(subject.name)}
                  className="bg-gray-50 hover:bg-blue-50 p-6 rounded-xl text-center transition-all duration-300 hover:scale-105 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700 text-sm">{subject.name}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Services?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive academic writing services with guaranteed quality and timely delivery
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quality Guaranteed</h3>
              <p className="text-gray-600">
                All our work is original, well-researched, and meets the highest academic standards with plagiarism-free guarantee.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">On-Time Delivery</h3>
              <p className="text-gray-600">
                We understand the importance of deadlines and ensure your work is delivered on time, every time.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Writers</h3>
              <p className="text-gray-600">
                Our team consists of qualified academic writers with advanced degrees in their respective fields.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied students who have achieved academic success with our professional writing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/place-order"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Place Your Order
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-lg transition-colors"
            >
              Get Started
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllServices;
