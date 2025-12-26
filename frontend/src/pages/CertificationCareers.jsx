import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Award, Briefcase, TrendingUp, CheckCircle2 } from 'lucide-react';

const CertificationCareers = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <Award className="h-20 w-20 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Certification & Career Outcomes
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Earn recognized certification and open doors to exciting career opportunities in your field
            </p>
          </div>
        </div>
      </section>

      {/* Certification Details */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Certificate of Completion</h2>
              <p className="text-lg text-gray-600">
                Upon successful completion of your training program
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8 md:p-12 border border-blue-200">
              <div className="text-center mb-8">
                <Award className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Official Certificate of Completion
                </h3>
                <p className="text-lg text-gray-700">
                  Recognized certification demonstrating your professional training
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">For Pharmacy Stream:</h4>
                  <p className="text-gray-600">
                    Certificate of Completion in Clinical & Industry-Oriented Pharmacy Training
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-3">For Engineering Stream:</h4>
                  <p className="text-gray-600">
                    Certificate of Completion in Engineering & Technology Training
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Readiness Focus */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Readiness Focus</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our training goes beyond certification to ensure you're truly ready for professional success
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Development</h3>
              <p className="text-gray-600">
                Develop practical, job-relevant skills that employers actively seek in candidates
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Improved Employability</h3>
              <p className="text-gray-600">
                Stand out in the job market with industry-recognized training and practical experience
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Professional Competency</h3>
              <p className="text-gray-600">
                Build comprehensive professional skills beyond just technical knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Opportunities by Stream */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Career Opportunities</h2>
            <p className="text-lg text-gray-600">
              Our training prepares you for specific roles in your chosen field
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Pharmacy Careers */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Pharmacy Stream Careers</h3>
              <ul className="space-y-3">
                {[
                  'Drug Safety Associate',
                  'Clinical Research Associate (CRA)',
                  'Clinical Research Coordinator (CRC)',
                  'Medical Coder',
                  'Medical Billing Analyst',
                  'Quality Control (QC) Analyst',
                  'Quality Assurance (QA) Executive',
                  'Regulatory Affairs Executive',
                  'Hospital Pharmacist',
                  'Clinical Pharmacist'
                ].map((career, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{career}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Engineering Careers */}
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Engineering Stream Careers</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Our Engineering & Technology training prepares you for various entry-level and trainee positions in:
                </p>
                <ul className="space-y-3">
                  {[
                    'Software Development roles',
                    'Technical Support positions',
                    'Quality Assurance roles',
                    'Project Coordination positions',
                    'Technical Documentation roles',
                    'System Administration positions',
                    'Database Management roles',
                    'Network Administration positions'
                  ].map((career, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{career}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Development */}
      <section className="py-16 lg:py-24 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Beyond Certification</h2>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              While certification is important, at Superbloom Academy we focus on ensuring you have the complete package employers are looking for:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Technical Excellence</h4>
                <p className="text-gray-600 text-sm">
                  Deep understanding of domain-specific concepts and tools
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Practical Experience</h4>
                <p className="text-gray-600 text-sm">
                  Hands-on work with real-world scenarios and projects
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Professional Skills</h4>
                <p className="text-gray-600 text-sm">
                  Communication, teamwork, and problem-solving abilities
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Industry Awareness</h4>
                <p className="text-gray-600 text-sm">
                  Understanding of current industry trends and best practices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Start Your Career Journey Today
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Earn your certification and step confidently into your professional future
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 transition-colors duration-200">
                Apply Now
              </Button>
            </Link>
            <Link to="/streams">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-blue-700 px-8 py-3 transition-colors duration-200">
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CertificationCareers;