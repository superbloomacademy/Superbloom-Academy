import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

export const StreamCard = ({ icon, title, description, targetAudience, link }) => {
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200">
      <div className="p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{description}</p>
        
        <div className="mb-6">
          <p className="text-sm font-semibold text-blue-600 mb-2">Designed for:</p>
          <p className="text-sm text-gray-600">{targetAudience}</p>
        </div>
        
        <Link to={link}>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 group">
            Explore {title.split(' ')[0]} Stream
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </div>
    </div>
  );
};