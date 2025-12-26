import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Target, Users, BookOpen, TrendingUp, Award, Clock } from 'lucide-react';

const WhySuperbloom = () => {
  const benefits = [
    {
      icon: Target,
      title: 'Industry-Aligned Training',
      description: 'Our curriculum is designed to meet current industry standards and job market requirements, ensuring you learn what employers actually need.'
    },
    {
      icon: Users,
      title: 'Experienced Faculty',
      description: 'Learn from professionals with real industry experience who bring practical insights and current best practices to the classroom.'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Learning',
      description: 'Balanced approach combining theoretical knowledge with extensive hands-on practical training and real-world projects.'
    },
    {
      icon: TrendingUp,
      title: 'Career-Focused Approach',
      description: 'Every aspect of our training is designed with one goal: making you job-ready and competitive in your chosen field.'
    },
    {
      icon: Clock,
      title: 'Flexible Duration Options',
      description: 'Choose from short-term, medium-term, or long-term programs based on your schedule and learning goals.'
    },
    {
      icon: Award,
      title: 'Recognized Certification',
      description: 'Receive a Certificate of Completion that demonstrates your competency and commitment to professional development.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Superbloom Academy?
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover what makes Superbloom Academy the right choice for your professional development and career advancement.
            </p>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here's why students and institutions choose Superbloom Academy for industry-oriented training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-blue-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Training Advantages */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Training Advantages</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Hands-On Learning</h3>
                  <p className="text-gray-600">
                    Move beyond theory with practical demonstrations, case studies, and industry-oriented projects that mirror real workplace scenarios.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Industry Relevance</h3>
                  <p className="text-gray-600">
                    Our curriculum is continuously updated to reflect current industry trends, technologies, and requirements.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehensive Assessment</h3>
                  <p className="text-gray-600">
                    Regular quizzes, practical assignments, presentations, and examinations ensure thorough understanding and skill mastery.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Development</h3>
                  <p className="text-gray-600">
                    Focus not just on technical skills, but also on professional competencies that employers value.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">By The Numbers</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Training Programs</span>
                  <span className="text-3xl font-bold text-blue-600">2</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Pharmacy Domains</span>
                  <span className="text-3xl font-bold text-blue-600">7</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <span className="text-gray-600">Duration Options</span>
                  <span className="text-3xl font-bold text-blue-600">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Focus Areas</span>
                  <span className="text-3xl font-bold text-blue-600">100%</span>
                </div>
                <p className="text-sm text-gray-500 mt-4">Job-Readiness Focused</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Factors */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Factors</h2>
            <p className="text-lg text-gray-600">
              What makes our students successful in their careers
            </p>
          </div>
          <div className="space-y-6">
            {[
              {
                title: 'Practical Skills Development',
                description: 'Students gain hands-on experience with tools, technologies, and processes used in actual industry settings.'
              },
              {
                title: 'Industry Exposure',
                description: 'Through projects, case studies, and clinical exposure, students understand real-world challenges and solutions.'
              },
              {
                title: 'Professional Readiness',
                description: 'Beyond technical skills, we focus on communication, teamwork, and problem-solving abilities employers seek.'
              },
              {
                title: 'Career Support',
                description: 'Our training prepares you for specific job roles with clear career pathways in your chosen field.'
              }
            ].map((factor, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border-l-4 border-blue-600">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{factor.title}</h3>
                <p className="text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Experience the Superbloom Difference?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of students who have advanced their careers through our industry-oriented training
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 transition-colors duration-200">
                Apply Now
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-blue-700 px-8 py-3 transition-colors duration-200">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhySuperbloom;