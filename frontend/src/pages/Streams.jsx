import React from 'react';
import { Link } from 'react-router-dom';
import { StreamCard } from '../components/StreamCard';
import { Microscope, Laptop } from 'lucide-react';

const Streams = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Training Stream
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Superbloom Academy offers multiple specialized training streams designed to meet the unique needs of different academic backgrounds and career paths.
            </p>
          </div>
        </div>
      </section>

      {/* Streams Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              description="Industry-oriented skill development programs designed in collaboration with academic institutions"
              targetAudience="Engineering students, Degree students, Freshers, Early-stage job seekers"
              link="/streams/engineering"
            />
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-6">
              Not sure which stream is right for you?
            </p>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 font-semibold">
              Contact us for guidance →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Streams;