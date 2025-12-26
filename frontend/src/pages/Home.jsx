import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { StreamCard } from '../components/StreamCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Microscope, Laptop, Target, BookOpen, TrendingUp, Award } from 'lucide-react';
import { academyInfo, trainingHighlights, faqData } from '../mockData';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {academyInfo.tagline}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              {academyInfo.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/streams">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg transition-colors duration-200">
                  Explore Streams
                </Button>
              </Link>
              <Link to="/apply">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg transition-colors duration-200">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About Superbloom Academy
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Superbloom Academy is a training institute focused on enhancing employability and professional competency.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our programs are structured to meet industry standards and current job market requirements.
            </p>
            <Link to="/about">
              <Button variant="link" className="mt-4 text-blue-600 hover:text-blue-700 text-base">
                Learn More About Us →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Training Streams Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Training Streams
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the stream that aligns with your academic background and career goals
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <StreamCard
              icon={<Microscope className="h-8 w-8 text-blue-600" />}
              title="Pharmacy Student Training"
              description="Advanced Clinical & Industry-Oriented Training Program for Pharmacy Students"
              targetAudience="D.Pharm, B.Pharm, M.Pharm, Pharm D & Pharm D (PB)"
              link="/streams/pharmacy"
            />
            <StreamCard
              icon={<Laptop className="h-8 w-8 text-blue-600" />}
              title="Engineering & Technology Training"
              description="Industry-oriented skill development programs"
              targetAudience="Designed in collaboration with academic institutions"
              link="/streams/engineering"
            />
          </div>
        </div>
      </section>

      {/* Training Highlights */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Training Highlights
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trainingHighlights.map((highlight, index) => {
              const icons = [Target, BookOpen, TrendingUp, Award];
              const Icon = icons[index];
              return (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm">{highlight.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certification & Outcomes Preview */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Award className="h-16 w-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Certification & Career Outcomes
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Upon successful completion, receive a Certificate of Completion that demonstrates your skill development, improved employability, and readiness for professional roles.
            </p>
            <Link to="/certification-careers">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transition-colors duration-200">
                View Certification Details
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our programs
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards a successful career with industry-oriented training
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

export default Home;