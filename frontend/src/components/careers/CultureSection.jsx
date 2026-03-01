import React from 'react'

const CultureSection = () => (
  <section className="py-16 lg:py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Life at Superbloom</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">A collaborative, growth-minded environment where learning never stops.</p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Culture</h4>
          <p className="text-gray-600">Transparent communication, ownership, and rapid iteration.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Growth Mindset</h4>
          <p className="text-gray-600">Continuous learning, regular feedback, and mentorship programs.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Collaboration</h4>
          <p className="text-gray-600">Cross-functional teams working on real-world outcomes.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-2">Environment</h4>
          <p className="text-gray-600">Flexible, modern, and supportive — remote-friendly.</p>
        </div>
      </div>
    </div>
  </section>
)

export default CultureSection
