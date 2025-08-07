import React, { useState, useMemo } from 'react';
import { Star, Search, Filter, ChevronDown, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  subject: string;
  academicLevel: string;
  rating: number;
  text: string;
  image: string;
  date: string;
}

const Testimonials: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedRating, setSelectedRating] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Graduate Student',
      subject: 'Psychology',
      academicLevel: 'Masters',
      rating: 5,
      text: 'GradeHarvest helped me meet my deadlines with top-quality papers. The writers are professional and responsive. I was struggling with my thesis and they provided excellent guidance.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&h=688&q=80',
      date: '2024-01-15'
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'PhD Candidate',
      subject: 'Computer Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Excellent service! My writer understood my requirements perfectly and delivered exceptional work on time. The research quality was outstanding.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
      date: '2024-01-12'
    },
    {
      id: 3,
      name: 'Emily Chen',
      role: 'Undergraduate Student',
      subject: 'Business & Management',
      academicLevel: 'Bachelor',
      rating: 5,
      text: 'Amazing experience! The writer helped me understand complex business concepts and delivered a well-structured essay. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2024-01-10'
    },
    {
      id: 4,
      name: 'David Thompson',
      role: 'Master\'s Student',
      subject: 'Literature & English',
      academicLevel: 'Masters',
      rating: 5,
      text: 'The quality of writing exceeded my expectations. The analysis was thorough and the citations were perfect. Will definitely use again.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2024-01-08'
    },
    {
      id: 5,
      name: 'Jessica Williams',
      role: 'Graduate Student',
      subject: 'Nursing & Healthcare',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Professional service with excellent communication. The writer was knowledgeable about healthcare topics and delivered quality work.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2024-01-05'
    },
    {
      id: 6,
      name: 'Robert Johnson',
      role: 'PhD Student',
      subject: 'Economics',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Outstanding research paper! The economic analysis was sophisticated and the methodology was sound. Impressed with the quality.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2024-01-03'
    },
    {
      id: 7,
      name: 'Amanda Davis',
      role: 'Undergraduate Student',
      subject: 'History',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Great help with my history essay. The writer provided excellent historical context and analysis. Very satisfied with the result.',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2024-01-01'
    },
    {
      id: 8,
      name: 'Christopher Lee',
      role: 'Master\'s Student',
      subject: 'Marketing',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Exceptional marketing case study analysis. The writer understood current market trends and provided innovative solutions.',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-28'
    },
    {
      id: 9,
      name: 'Maria Garcia',
      role: 'Graduate Student',
      subject: 'Education',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Perfect dissertation chapter! The writer demonstrated deep understanding of educational theories and research methods.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-25'
    },
    {
      id: 10,
      name: 'James Wilson',
      role: 'PhD Candidate',
      subject: 'Political Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Brilliant political analysis! The writer provided comprehensive research and insightful arguments. Exceeded expectations.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-22'
    },
    {
      id: 11,
      name: 'Lisa Anderson',
      role: 'Undergraduate Student',
      subject: 'Sociology',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Good quality sociology paper. The writer addressed all the key sociological concepts and provided relevant examples.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-20'
    },
    {
      id: 12,
      name: 'Kevin Brown',
      role: 'Master\'s Student',
      subject: 'Philosophy',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent philosophical argument! The writer demonstrated critical thinking and provided well-reasoned conclusions.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-18'
    },
    {
      id: 13,
      name: 'Rachel Taylor',
      role: 'Graduate Student',
      subject: 'Psychology',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Outstanding psychological research paper. The methodology was rigorous and the analysis was comprehensive.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-15'
    },
    {
      id: 14,
      name: 'Daniel Martinez',
      role: 'PhD Student',
      subject: 'Computer Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Exceptional technical writing! The writer understood complex algorithms and provided clear explanations.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-12'
    },
    {
      id: 15,
      name: 'Sophie Clark',
      role: 'Undergraduate Student',
      subject: 'Business & Management',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Great business case study analysis. The writer provided practical solutions and demonstrated good business acumen.',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-10'
    },
    {
      id: 16,
      name: 'Thomas White',
      role: 'Master\'s Student',
      subject: 'Literature & English',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Brilliant literary analysis! The writer provided deep insights into the text and excellent critical interpretation.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-08'
    },
    {
      id: 17,
      name: 'Jennifer Lewis',
      role: 'Graduate Student',
      subject: 'Nursing & Healthcare',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Professional healthcare research paper. The writer demonstrated excellent knowledge of nursing practices and evidence-based care.',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-05'
    },
    {
      id: 18,
      name: 'Mark Robinson',
      role: 'PhD Candidate',
      subject: 'Economics',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Sophisticated economic modeling and analysis. The writer provided excellent theoretical framework and empirical evidence.',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-03'
    },
    {
      id: 19,
      name: 'Ashley Walker',
      role: 'Undergraduate Student',
      subject: 'History',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Well-researched historical essay. The writer provided good chronological analysis and used credible sources.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-12-01'
    },
    {
      id: 20,
      name: 'Ryan Hall',
      role: 'Master\'s Student',
      subject: 'Marketing',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent marketing strategy paper. The writer provided innovative ideas and comprehensive market analysis.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-28'
    },
    {
      id: 21,
      name: 'Nicole Young',
      role: 'Graduate Student',
      subject: 'Education',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Outstanding educational research. The writer provided excellent pedagogical insights and practical applications.',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-25'
    },
    {
      id: 22,
      name: 'Brandon King',
      role: 'PhD Student',
      subject: 'Political Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Exceptional political theory analysis. The writer demonstrated deep understanding of political concepts and current affairs.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-22'
    },
    {
      id: 23,
      name: 'Stephanie Wright',
      role: 'Undergraduate Student',
      subject: 'Sociology',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Good sociological research paper. The writer addressed social issues effectively and provided relevant case studies.',
      image: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-20'
    },
    {
      id: 24,
      name: 'Gregory Lopez',
      role: 'Master\'s Student',
      subject: 'Philosophy',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Brilliant philosophical dissertation chapter. The writer provided sophisticated arguments and excellent logical reasoning.',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-18'
    },
    {
      id: 25,
      name: 'Megan Hill',
      role: 'Graduate Student',
      subject: 'Psychology',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent psychological assessment paper. The writer demonstrated thorough understanding of psychological theories and research methods.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-15'
    },
    {
      id: 26,
      name: 'Jonathan Green',
      role: 'PhD Candidate',
      subject: 'Computer Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Outstanding technical dissertation chapter. The writer provided excellent algorithm analysis and implementation details.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-12'
    },
    {
      id: 27,
      name: 'Samantha Adams',
      role: 'Undergraduate Student',
      subject: 'Business & Management',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Great business ethics paper. The writer addressed ethical dilemmas effectively and provided practical solutions.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-10'
    },
    {
      id: 28,
      name: 'Patrick Baker',
      role: 'Master\'s Student',
      subject: 'Literature & English',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Exceptional literary criticism paper. The writer provided insightful analysis and demonstrated excellent writing skills.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-08'
    },
    {
      id: 29,
      name: 'Victoria Nelson',
      role: 'Graduate Student',
      subject: 'Nursing & Healthcare',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Professional nursing research paper. The writer demonstrated excellent knowledge of healthcare practices and patient care.',
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-05'
    },
    {
      id: 30,
      name: 'Andrew Carter',
      role: 'PhD Student',
      subject: 'Economics',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Sophisticated econometric analysis. The writer provided excellent statistical modeling and interpretation of results.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-03'
    },
    {
      id: 31,
      name: 'Brittany Mitchell',
      role: 'Undergraduate Student',
      subject: 'History',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Well-written historical analysis. The writer provided good context and used appropriate historical sources.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-11-01'
    },
    {
      id: 32,
      name: 'Tyler Perez',
      role: 'Master\'s Student',
      subject: 'Marketing',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent digital marketing strategy paper. The writer provided innovative approaches and comprehensive market research.',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-28'
    },
    {
      id: 33,
      name: 'Kimberly Roberts',
      role: 'Graduate Student',
      subject: 'Education',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Outstanding curriculum development paper. The writer provided excellent educational theories and practical implementation strategies.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-25'
    },
    {
      id: 34,
      name: 'Joshua Turner',
      role: 'PhD Candidate',
      subject: 'Political Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Brilliant comparative politics analysis. The writer provided excellent cross-national comparisons and theoretical insights.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-22'
    },
    {
      id: 35,
      name: 'Alexis Phillips',
      role: 'Undergraduate Student',
      subject: 'Sociology',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Good social research paper. The writer addressed contemporary social issues and provided relevant theoretical frameworks.',
      image: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-20'
    },
    {
      id: 36,
      name: 'Nathan Campbell',
      role: 'Master\'s Student',
      subject: 'Philosophy',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Exceptional ethics paper. The writer provided sophisticated moral arguments and excellent philosophical reasoning.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-18'
    },
    {
      id: 37,
      name: 'Heather Parker',
      role: 'Graduate Student',
      subject: 'Psychology',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent clinical psychology paper. The writer demonstrated thorough understanding of therapeutic approaches and case studies.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-15'
    },
    {
      id: 38,
      name: 'Jeremy Evans',
      role: 'PhD Student',
      subject: 'Computer Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Outstanding machine learning research paper. The writer provided excellent algorithm implementation and performance analysis.',
      image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-12'
    },
    {
      id: 39,
      name: 'Christina Edwards',
      role: 'Undergraduate Student',
      subject: 'Business & Management',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Great strategic management paper. The writer provided excellent business analysis and strategic recommendations.',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-10'
    },
    {
      id: 40,
      name: 'Marcus Collins',
      role: 'Master\'s Student',
      subject: 'Literature & English',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Brilliant comparative literature analysis. The writer provided excellent cross-cultural literary insights and critical analysis.',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-08'
    },
    {
      id: 41,
      name: 'Diana Stewart',
      role: 'Graduate Student',
      subject: 'Nursing & Healthcare',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Professional healthcare policy paper. The writer demonstrated excellent knowledge of healthcare systems and policy analysis.',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-05'
    },
    {
      id: 42,
      name: 'Carlos Sanchez',
      role: 'PhD Candidate',
      subject: 'Economics',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Exceptional macroeconomic analysis. The writer provided sophisticated economic modeling and excellent theoretical framework.',
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-03'
    },
    {
      id: 43,
      name: 'Melissa Morris',
      role: 'Undergraduate Student',
      subject: 'History',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Well-researched medieval history paper. The writer provided excellent historical context and used credible primary sources.',
      image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-10-01'
    },
    {
      id: 44,
      name: 'Steven Rogers',
      role: 'Master\'s Student',
      subject: 'Marketing',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent consumer behavior analysis. The writer provided innovative marketing insights and comprehensive research methodology.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-28'
    },
    {
      id: 45,
      name: 'Rebecca Reed',
      role: 'Graduate Student',
      subject: 'Education',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Outstanding special education research paper. The writer provided excellent pedagogical strategies and evidence-based practices.',
      image: 'https://images.unsplash.com/photo-1485893086445-ed75865251e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-25'
    },
    {
      id: 46,
      name: 'Brian Cook',
      role: 'PhD Student',
      subject: 'Political Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Brilliant international relations analysis. The writer provided excellent geopolitical insights and theoretical frameworks.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-22'
    },
    {
      id: 47,
      name: 'Tiffany Bailey',
      role: 'Undergraduate Student',
      subject: 'Sociology',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Good social inequality research paper. The writer addressed contemporary social issues with relevant theoretical perspectives.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-20'
    },
    {
      id: 48,
      name: 'Adam Rivera',
      role: 'Master\'s Student',
      subject: 'Philosophy',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Exceptional metaphysics paper. The writer provided sophisticated philosophical arguments and excellent logical reasoning.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-18'
    },
    {
      id: 49,
      name: 'Laura Cooper',
      role: 'Graduate Student',
      subject: 'Psychology',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Excellent developmental psychology paper. The writer demonstrated thorough understanding of child development theories and research.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-15'
    },
    {
      id: 50,
      name: 'Scott Ward',
      role: 'PhD Candidate',
      subject: 'Computer Science',
      academicLevel: 'PhD',
      rating: 5,
      text: 'Outstanding artificial intelligence research paper. The writer provided cutting-edge AI analysis and excellent technical implementation.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-12'
    },
    {
      id: 51,
      name: 'Michelle Torres',
      role: 'Undergraduate Student',
      subject: 'Business & Management',
      academicLevel: 'Bachelor',
      rating: 4,
      text: 'Great organizational behavior paper. The writer provided excellent analysis of workplace dynamics and management theories.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&h=687&q=80',
      date: '2023-09-10'
    },
    {
      id: 52,
      name: 'Kenneth Flores',
      role: 'Master\'s Student',
      subject: 'Literature & English',
      academicLevel: 'Masters',
      rating: 5,
      text: 'Brilliant postmodern literature analysis. The writer provided excellent critical interpretation and sophisticated literary theory.',
      image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&h=1470&q=80',
      date: '2023-09-08'
    }
  ];

  const subjects = ['All', 'Psychology', 'Computer Science', 'Business & Management', 'Literature & English', 'Nursing & Healthcare', 'Economics', 'History', 'Marketing', 'Education', 'Political Science', 'Sociology', 'Philosophy'];
  const academicLevels = ['All', 'Bachelor', 'Masters', 'PhD'];
  const ratings = ['All', '5', '4'];

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter(testimonial => {
      const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           testimonial.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || testimonial.subject === selectedSubject;
      const matchesLevel = selectedLevel === 'All' || testimonial.academicLevel === selectedLevel;
      const matchesRating = selectedRating === 'All' || testimonial.rating.toString() === selectedRating;
      
      return matchesSearch && matchesSubject && matchesLevel && matchesRating;
    });
  }, [searchTerm, selectedSubject, selectedLevel, selectedRating]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-navy via-navy-light to-purple-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/" 
              className="inline-flex items-center text-white hover:text-purple-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Student Testimonials</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Read what our satisfied students have to say about their experience with GradeHarvest. 
              Over 50,000+ students trust us with their academic success.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {academicLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {ratings.map(rating => (
                      <option key={rating} value={rating}>
                        {rating === 'All' ? 'All Ratings' : `${rating} Stars`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4 bg-gray-50">
        <div className="container mx-auto px-6">
          <p className="text-gray-600">
            Showing {filteredTestimonials.length} of {testimonials.length} testimonials
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({testimonial.rating}/5)</span>
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* User Info */}
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Subject and Level Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    {testimonial.subject}
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                    {testimonial.academicLevel}
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredTestimonials.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No testimonials found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search terms or filters to find more testimonials.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSubject('All');
                  setSelectedLevel('All');
                  setSelectedRating('All');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Success Stories?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied students who have achieved academic excellence with GradeHarvest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/place-order"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300"
            >
              Place Your Order
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 font-semibold rounded-full transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
