import React from 'react'
import { Button } from '../../components/ui/button'

const CTASection = () => {
  const scrollToJobs = () => {
    const jobsSection = document.getElementById('jobs-section');
    if (jobsSection) {
      jobsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Let's Build Something Meaningful Together</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">Join Superbloom and accelerate your career with practical, industry-focused training.</p>
        <div>
          <Button onClick={scrollToJobs} className="bg-white text-blue-600 px-6 py-3 cursor-pointer">View Open Roles</Button>
        </div>
      </div>
    </section>
  );
}

export default CTASection
