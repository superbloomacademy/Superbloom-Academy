import React from 'react'
import { CheckCircle2, Lightbulb } from 'lucide-react'

const reasons = [
  { title: 'Career Growth', desc: 'Fast-track progression through performance-based outcomes.' },
  { title: 'Real Ownership', desc: 'Work on real projects with measurable impact.' },
  { title: 'Innovation-Driven', desc: 'A culture that rewards curiosity and experimentation.' },
  { title: 'Learning & Leadership', desc: 'Mentorship, workshops, and leadership exposure.' },
]

const WhyJoinSection = () => (
  <section className="py-16 lg:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join Superbloom</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Industry-focused training that converts talent into job-ready professionals.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {reasons.map((r) => (
          <div key={r.title} className="flex gap-4 items-start bg-gradient-to-br from-white to-blue-50 p-6 rounded-xl shadow-sm">
            <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{r.title}</h3>
              <p className="text-gray-600">{r.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default WhyJoinSection
