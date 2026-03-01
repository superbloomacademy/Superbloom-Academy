import React from 'react'
import JobCard from './JobCard'

const pharmacyRoles = [
  {
    title: 'Clinical Pharmacist',
    description: 'Provide clinical support and medication management in healthcare settings.',
    responsibilities: ['Patient medication reviews', 'Collaborate with medical teams', 'Maintain records'],
  },
  {
    title: 'Quality Assurance Executive',
    description: 'Ensure product quality and regulatory compliance in pharma operations.',
    responsibilities: ['QA processes', 'Documentation', 'Regulatory liaison'],
  },
]

const engineeringRoles = [
  {
    title: 'Junior Software Engineer',
    description: 'Work on product features and support engineering initiatives.',
    responsibilities: ['Implement features', 'Write tests', 'Participate in code reviews'],
  },
  {
    title: 'Technical Support Engineer',
    description: 'Provide technical assistance and troubleshoot issues for clients.',
    responsibilities: ['Support tickets', 'Root-cause analysis', 'Client communication'],
  },
]

const JobListSection = () => (
  <section id="open-roles" className="py-16 lg:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h2>
        <p className="text-lg text-gray-600">Explore roles across Pharmacy and Engineering, plus operations and training.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pharmacy Roles</h3>
          <div className="space-y-4">
            {pharmacyRoles.map((r) => (
              <JobCard key={r.title} title={r.title} description={r.description} responsibilities={r.responsibilities} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Engineering Roles</h3>
          <div className="space-y-4">
            {engineeringRoles.map((r) => (
              <JobCard key={r.title} title={r.title} description={r.description} responsibilities={r.responsibilities} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export default JobListSection
