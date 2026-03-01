import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export const StreamCard = ({ icon, title, description, targetAudience, link, delay = 0 }) => {
  return (
    <div 
      className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 card-hover animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Decorative gradient background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-32 -mt-32"></div>
      
      <div className="relative p-10">
        <div className="flex items-start justify-between mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {icon}
            </div>
          </div>
          <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="text-xs font-semibold">Popular</span>
          </div>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Designed for:</p>
          <p className="text-sm text-gray-700 leading-relaxed">{targetAudience}</p>
        </div>
        
        <Link to={link}>
          <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-6 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 group/btn">
            <span className="flex items-center justify-center gap-2 font-semibold">
              Explore Program
              <span className="group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
};