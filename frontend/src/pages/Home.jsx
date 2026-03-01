import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { StreamCard } from '../components/StreamCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Microscope, Laptop, Target, BookOpen, TrendingUp, Award, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { academyInfo, trainingHighlights, faqData } from '../mockData';
import SEO from '../utils/SEO';

const Home = () => {
  // FAQ Schema Data
  const faqSchemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Superbloom Academy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Superbloom Academy is an industry-oriented training academy that bridges the gap between academic learning and real-world industry practice. We offer specialized training programs for Engineering and Pharmacy students."
        }
      },
      {
        "@type": "Question",
        "name": "Who can enroll in the training programs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our programs are designed for Engineering and Pharmacy students, freshers, and professionals who want to develop industry-relevant skills and gain professional certifications."
        }
      },
      {
        "@type": "Question",
        "name": "What training streams do you offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer two main training streams: Engineering Stream and Pharmacy Stream, each with comprehensive industry-oriented curriculum designed by industry experts."
        }
      },
      {
        "@type": "Question",
        "name": "How can I register for a training program?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can register through our Admission page. Fill out the form with your details and choose your preferred training stream."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <SEO 
        title="Superbloom Academy - Industry-Oriented Training for Career Readiness"
        description="Expert-led industry training programs for Engineering and Pharmacy students. Bridge the gap between academic learning and real-world industry practice with professional certifications."
        url="https://www.superbloomacademy.in/"
        structuredData={faqSchemaData}
      />
      {/* Hero Section */}
      <section className="relative hero-gradient pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Transform Your Career Journey</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight animate-slide-up">
              Industry-Oriented Training for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
                Career Readiness
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Bridge academic learning with real-world industry practice through comprehensive training programs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/streams">
                <Button size="lg" className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/40 px-10 py-7 text-lg rounded-2xl transition-all duration-300">
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link to="/admission">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 px-10 py-7 text-lg rounded-2xl transition-all duration-300">
                  Apply Now
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 pt-12 border-t border-gray-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: 'Training Streams', value: '2+' },
                  { label: 'Domains Covered', value: '7+' },
                  { label: 'Duration Options', value: '3' },
                  { label: 'Job-Ready Focus', value: '100%' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                    <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <Award className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-600">About Us</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Superbloom Academy
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                A premier training institute focused on enhancing employability and professional competency through industry-oriented programs.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                Our programs are structured to meet current industry standards and job market requirements, ensuring you're ready for real-world challenges.
              </p>
              <Link to="/about">
                <Button variant="link" className="text-blue-600 hover:text-blue-700 text-lg font-semibold p-0 h-auto group">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {[
                { icon: Target, title: 'Practical Focus', desc: 'Real-world skills' },
                { icon: BookOpen, title: 'Expert Training', desc: 'Industry professionals' },
                { icon: TrendingUp, title: 'Career Growth', desc: 'Job-ready outcomes' },
                { icon: Award, title: 'Certification', desc: 'Recognized credentials' }
              ].map((item, index) => (
                <div key={index} className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Training Streams Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">Training Programs</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Select the training stream that aligns with your academic background and career aspirations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <StreamCard
              icon={<Microscope className="h-10 w-10 text-blue-600" />}
              title="Pharmacy Student Training"
              description="Advanced clinical & industry-oriented training for pharmaceutical professionals"
              targetAudience="D.Pharm, B.Pharm, M.Pharm, Pharm D & Pharm D (PB)"
              link="/streams/pharmacy"
              delay={0}
            />
            <StreamCard
              icon={<Laptop className="h-10 w-10 text-blue-600" />}
              title="Engineering & Technology"
              description="Comprehensive skill development programs for tech professionals"
              targetAudience="Engineering students, freshers & early-career professionals"
              link="/streams/engineering"
              delay={200}
            />
          </div>
        </div>
      </section>

      {/* Training Highlights */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference of industry-focused training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainingHighlights.map((highlight, index) => {
              const icons = [Target, BookOpen, TrendingUp, Award];
              const Icon = icons[index];
              return (
                <div 
                  key={index} 
                  className="relative group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{highlight.title}</h3>
                    <p className="text-gray-600">{highlight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certification Preview */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-8 shadow-2xl shadow-blue-500/30 animate-scale-in">
              <Award className="h-10 w-10 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
              Get Certified, Get Hired
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Earn a Certificate of Completion that demonstrates your skills and commitment to professional excellence
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {[
                { label: 'Skill Development', icon: TrendingUp },
                { label: 'Career Readiness', icon: Target },
                { label: 'Job Opportunities', icon: CheckCircle2 }
              ].map((item, index) => (
                <div key={index} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-lg">
                  <item.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900">{item.label}</p>
                </div>
              ))}
            </div>
            
            <Link to="/streams">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl shadow-blue-500/30 px-10 py-7 text-lg rounded-2xl transition-all duration-300">
                View Career Opportunities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Find answers to common questions about our programs
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-2xl px-6 hover:border-blue-200 transition-colors duration-300 bg-white"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-300 py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6 pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            Take the first step towards a successful career with industry-oriented training
          </p>
          <Link to="/admission">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-50 shadow-2xl hover:shadow-white/20 px-12 py-7 text-lg rounded-2xl transition-all duration-300 animate-scale-in font-semibold" 
              style={{ animationDelay: '200ms' }}
            >
              Register Now - Start Learning
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
