import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { DomainCard } from '../components/DomainCard';
import { Clock, BookOpen, CheckCircle2, Award } from 'lucide-react';
import { pharmacyDomains, trainingDurations, pharmacyTargetAudience } from '../mockData';

const PharmacyStream = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pharmacy Student Training
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Advanced clinical & industry-oriented training program designed to bridge academic education with real-world clinical & industry practice.
            </p>
            <Link to="/apply">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-colors duration-200">
                Apply for Pharmacy Stream
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Program Overview</h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
            <p>
              Our pharmacy training program is specifically designed to bridge the gap between academic education and real-world clinical and industry practice.
            </p>
            <p>
              <strong className="text-gray-900">Objective:</strong> Focus on job readiness and professional skills development, ensuring graduates are prepared for immediate contribution in clinical and industry settings.
            </p>
          </div>
        </div>
      </section>

      {/* Target Audience */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Should Enroll?</h2>
            <p className="text-lg text-gray-600">This program is designed for pharmacy students across all levels</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {pharmacyTargetAudience.map((audience, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{audience}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Domains Covered */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Domains Covered</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive training across seven key pharmaceutical industry domains
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pharmacyDomains.map((domain) => (
              <DomainCard
                key={domain.id}
                title={domain.title}
                description={domain.description}
                jobRoles={domain.jobRoles}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Training Duration Models */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Duration Models</h2>
            <p className="text-lg text-gray-600">Flexible duration options to suit your schedule</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {trainingDurations.map((duration, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center hover:shadow-lg transition-shadow duration-300">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{duration.type}</h3>
                <p className="text-3xl font-bold text-blue-600 mb-3">{duration.duration}</p>
                <p className="text-gray-600">{duration.hours}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Methodology */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Training Methodology</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: 'Classroom-based Learning', desc: 'Structured theoretical foundation' },
              { title: 'Case Study Discussions', desc: 'Real-world scenario analysis' },
              { title: 'Practical Demonstrations', desc: 'Hands-on skill development' },
              { title: 'Skill-based Assignments', desc: 'Applied learning exercises' },
              { title: 'Industry-oriented Projects', desc: 'Real industry project exposure' },
              { title: 'Hospital/Clinical Exposure', desc: 'Practical clinical environment experience' }
            ].map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-sm text-gray-600">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Method */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Assessment Method</h2>
            <p className="text-lg text-gray-600">Comprehensive evaluation to ensure skill mastery</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Weekly quizzes',
                'Practical assignments',
                'Case study presentations',
                'Final evaluation test',
                'Viva / oral examination'
              ].map((assessment, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-900">{assessment}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certification & Careers */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Award className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Certification & Career Opportunities</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 rounded-lg p-8 mb-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Certificate of Completion
              </h3>
              <p className="text-lg text-gray-700">
                Clinical & Industry-Oriented Pharmacy Training
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Career Opportunities Include:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  'Drug Safety Associate',
                  'Clinical Research Associate',
                  'Medical Coder',
                  'QC / QA Executive',
                  'Regulatory Affairs Trainee',
                  'Hospital / Clinical Pharmacist'
                ].map((career, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-900">{career}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Advance Your Pharmacy Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Apply now for the Pharmacy Student Training program
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

export default PharmacyStream;