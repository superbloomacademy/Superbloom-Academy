import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Target, Users, TrendingUp, Award } from 'lucide-react';
import SEO from '../utils/SEO';

const About = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="About Superbloom Academy - Our Mission & Vision"
        description="Learn about Superbloom Academy's mission to provide industry-oriented training that prepares students for real-world professional challenges."
        url="https://www.superbloomacademy.in/about"
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Superbloom Academy
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Bridging the gap between academic education and industry requirements
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Overview</h2>
          <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
            <p>
              Superbloom Academy is a premier training institute dedicated to enhancing employability and professional competency. We recognize the gap between academic education and industry requirements, and our mission is to bridge that gap through comprehensive, industry-oriented training programs.
            </p>
            <p>
              Our programs are meticulously structured to meet current industry standards and job market requirements. We offer specialized training streams for both Pharmacy and Engineering students, ensuring that each program is tailored to the specific needs and career paths of these disciplines.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy & Commitment */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Training Philosophy</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We believe that true learning happens when theory meets practice. Our training philosophy centers on hands-on, skill-based learning that prepares students for real-world challenges.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every program incorporates case studies, practical demonstrations, and industry-oriented projects that mirror actual workplace scenarios.
              </p>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Commitment</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                We are committed to maintaining the highest standards of training quality. Our curriculum is continuously updated to reflect the latest industry trends and requirements.
              </p>
              <p className="text-gray-600 leading-relaxed">
                We focus on developing not just technical skills, but also the professional competencies that employers value most.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Focus Areas</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Employability Enhancement</h3>
              <p className="text-gray-600">
                Equipping students with the skills and knowledge that make them immediately valuable to employers
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Competency</h3>
              <p className="text-gray-600">
                Building comprehensive professional skills that go beyond technical knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Standards</h3>
              <p className="text-gray-600">
                Ensuring all training meets or exceeds current industry standards and best practices
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Join Superbloom Academy Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start your journey towards professional excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/streams">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 transition-colors duration-200">
                Explore Programs
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

export default About;