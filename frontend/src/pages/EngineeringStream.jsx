import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Users, TrendingUp, Handshake, Award, CheckCircle2, Target } from 'lucide-react';
import { engineeringTargetAudience } from '../mockData';

const EngineeringStream = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Engineering & Technology Training
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Industry-oriented skill development programs designed to complement institutional education and bridge the gap between academic learning and practical, job-relevant skills.
            </p>
            <Link to="/apply">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-colors duration-200">
                Apply for Engineering Stream
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Stream Overview</h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              Our Engineering & Technology stream offers industry-oriented skill development programs focused on bridging academic learning with practical, job-relevant skills.
            </p>
            <p>
              These programs are designed to complement institutional education, providing students with the hands-on experience and industry exposure that employers seek.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should Enroll?</h2>
            <p className="text-lg text-gray-600">This program is designed for students and early-career professionals</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {engineeringTargetAudience.map((audience, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{audience}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Approach */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training & Delivery Approach</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-lg p-8">
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill-based Learning Model</h3>
              <p className="text-gray-600">
                Focus on developing practical, hands-on skills that are directly applicable in industry settings.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry-relevant Training</h3>
              <p className="text-gray-600">
                Curriculum aligned with current industry requirements and emerging technology trends.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <Users className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Practical Orientation</h3>
              <p className="text-gray-600">
                Emphasis on real-world projects and practical problem-solving scenarios.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <Handshake className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Career Readiness</h3>
              <p className="text-gray-600">
                Preparing students for successful transition from academic life to professional career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Model */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <Handshake className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Collaboration Model</h2>
          </div>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our Engineering stream operates through an <strong className="text-gray-900">academic-industry collaboration framework</strong>, where programs are delivered in association with educational institutions.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              This collaborative approach ensures that training is both academically sound and industry-relevant, focusing on student skill development and career readiness.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Outcomes</h2>
            <p className="text-lg text-gray-600">What you'll gain from this program</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Enhancement</h3>
              <p className="text-gray-600">
                Develop advanced technical and professional skills valued by employers
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Industry Exposure</h3>
              <p className="text-gray-600">
                Gain practical experience with real-world projects and industry practices
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Improved Employability</h3>
              <p className="text-gray-600">
                Become more competitive in the job market with industry-relevant skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Apply / Partner Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started</h2>
            <p className="text-lg text-gray-600">Whether you're a student or an institution, we're here to help</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Students</h3>
              <p className="text-gray-600 mb-6">
                Apply for our engineering training programs and start your journey towards career readiness
              </p>
              <Link to="/apply">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                  Student Enquiry Form
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Handshake className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Institutions</h3>
              <p className="text-gray-600 mb-6">
                Partner with us to bring industry-oriented training to your students
              </p>
              <Link to="/contact">
                <Button variant="outline" className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors duration-200">
                  Institutional Collaboration
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Enhance Your Engineering Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our Engineering & Technology training program today
          </p>
          <Link to="/apply">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg transition-colors duration-200">
              Apply Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EngineeringStream;