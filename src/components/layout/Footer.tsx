import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/Nexara_logo.png" 
                alt="Nexara" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold">Nexara</span>
            </div>
            <p className="text-gray-400 text-sm">
              Customer Engagement Platform for modern businesses. Build, manage, and optimize your marketing campaigns.
            </p>
          </div>

          {/* Policy Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/cancellation-refunds" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Shipping Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <a 
                  href="mailto:networker.udayan@gmail.com" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  networker.udayan@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-green-400" />
                <a 
                  href="tel:9823329163" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  9823329163
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-purple-400" />
                <span className="text-gray-400 text-sm">
                  Mon–Fri, 9am–6pm IST
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  to="/login" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link 
                  to="/signup" 
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Nexara. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Terms
              </Link>
              <Link 
                to="/cancellation-refunds" 
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
