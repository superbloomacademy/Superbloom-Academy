import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const DomainCard = ({ title, description, jobRoles }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      <div>
        <p className="text-sm font-semibold text-blue-600 mb-2">Job Roles:</p>
        <ul className="space-y-2">
          {jobRoles.map((role, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
              <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>{role}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};