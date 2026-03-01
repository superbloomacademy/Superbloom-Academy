import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/button'

const HeroSection = () => (
  <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 md:gap-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* <Award className="h-20 w-20 text-blue-600 mx-auto mb-6" /> */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
             Build the Future of Industry-Ready Talent
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
               Grow with Superbloom — practical training, real projects, and career transformation
            </p>
          </div>

        </div>
      </section>
)

export default HeroSection
