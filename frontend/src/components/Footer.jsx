import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { academyInfo } from '../mockData';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div>
                <img src="/sba-logo.png" alt="Superbloom Academy Logo" className="h-7 w-7 object-contain" />
              </div>
              <span className="text-lg font-bold text-white">Superbloom Academy</span>
            </div>
            <p className="text-sm text-gray-400">
              Industry-Oriented Training for Career Readiness
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/streams" className="hover:text-blue-400 transition-colors duration-200">
                  Training Streams
                </Link>
              </li>
              <li>
                <Link to="/why-superbloom" className="hover:text-blue-400 transition-colors duration-200">
                  Why Superbloom
                </Link>
              </li>
              <li>
                <Link to="/certification-careers" className="hover:text-blue-400 transition-colors duration-200">
                  Certification
                </Link>
              </li>
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h3 className="text-white font-semibold mb-4">Programs</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/streams/pharmacy" className="hover:text-blue-400 transition-colors duration-200">
                  Pharmacy Training
                </Link>
              </li>
              <li>
                <Link to="/streams/engineering" className="hover:text-blue-400 transition-colors duration-200">
                  Engineering Training
                </Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-blue-400 transition-colors duration-200">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-blue-400" />
                <span>{academyInfo.contact.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <span>{academyInfo.contact.phone}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-blue-400" />
                <span>{academyInfo.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Superbloom Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};