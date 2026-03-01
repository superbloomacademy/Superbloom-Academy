import React from 'react'
import { Button } from '../../components/ui/button'

const JobCard = ({ title, description, responsibilities = [], applyLink = '/apply' }) => (
  <div className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow">
    <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
    <p className="text-gray-600 mb-4">{description}</p>
    <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
      {responsibilities.map((r, idx) => (
        <li key={idx}>{r}</li>
      ))}
    </ul>
    <div className="text-right">
      <Button as="a" href={applyLink} className="bg-blue-600 text-white hover:opacity-95 px-4 py-2">Apply Now</Button>
    </div>
  </div>
)

export default JobCard
