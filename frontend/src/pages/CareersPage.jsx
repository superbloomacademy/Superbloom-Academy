import React from 'react'
import HeroSection from '../components/careers/HeroSection'
import WhyJoinSection from '../components/careers/WhyJoinSection'
import CultureSection from '../components/careers/CultureSection'
import CTASection from '../components/careers/CTASection'
import Jobs from '../components/careers/Jobs'
import SEO from '../utils/SEO'

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="Job Opportunities | Superbloom Academy"
        description="Explore exciting career opportunities at Superbloom Academy. Join our team and help us transform industry training."
        url="https://www.superbloomacademy.in/careers"
      />
      <HeroSection />
      <div id="jobs-section">
        <Jobs />
      </div>
      <WhyJoinSection />
      <CultureSection />
      <CTASection />
    </div>
  )
}
