import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { toast } from 'sonner';
import { Send, Loader2 } from 'lucide-react';
import axios from 'axios';
import api from '../utils/api.js';

const Admission = () => {
  const [selectedStream, setSelectedStream] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    
    // Educational Background
    currentQualification: '',
    institution: '',
    yearOfStudy: '',
    
    // Program Details
    stream: '',
    duration: '',
    
    // Additional Information
    whyApplying: '',
    hearAboutUs: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStreamChange = (value) => {
    setSelectedStream(value);
    setFormData({
      ...formData,
      stream: value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get Formspree endpoint from environment variable
    const formspreeEndpoint = process.env.REACT_APP_FORMSPREE_APPLICATION_ID;
    
    if (!formspreeEndpoint) {
      toast.error('Form configuration error. Please contact support.');
      console.error('REACT_APP_FORMSPREE_APPLICATION_ID is not set in environment variables');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for Formspree
      const submissionData = {
        _subject: `New Application - ${formData.stream} Stream`,
        _format: 'plain',
        // Personal Information
        'First Name': formData.firstName,
        'Last Name': formData.lastName,
        'Email': formData.email,
        'Phone': formData.phone,
        'Date of Birth': formData.dateOfBirth,
        'Address': formData.address,
        // Educational Background
        'Current Qualification': formData.currentQualification,
        'Institution': formData.institution,
        'Year of Study': formData.yearOfStudy,
        // Program Details
        'Stream': formData.stream,
        'Preferred Duration': formData.duration,
        'How did you hear about us?': formData.hearAboutUs,
        // Additional Information
        'Why Applying': formData.whyApplying,
      };

      // Submit to Formspree
        const response = await axios.post(`https://formspree.io/f/${formspreeEndpoint}`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      const res = await api.post(`/admission`, submissionData);
      console.log(res.message);
      

      if (res.status !== 200) {
        throw new Error("Backend failed")
      }

      toast.success('Application submitted successfully! We will contact you soon.');
      
      // Reset form
      setSelectedStream('');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        address: '',
        currentQualification: '',
        institution: '',
        yearOfStudy: '',
        stream: '',
        duration: '',
        whyApplying: '',
        hearAboutUs: ''
      });
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit application. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Apply Now
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Take the first step towards your professional development. Fill out the application form below.
            </p>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Stream Selection */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Your Training Stream</h2>
              <RadioGroup value={selectedStream} onValueChange={handleStreamChange} className="space-y-3">
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border-2 border-transparent hover:border-blue-600 transition-colors duration-200 cursor-pointer">
                  <RadioGroupItem value="pharmacy" id="pharmacy" />
                  <Label htmlFor="pharmacy" className="cursor-pointer flex-1">
                    <span className="font-semibold text-gray-900">Pharmacy Student Training</span>
                    <p className="text-sm text-gray-600 mt-1">For D.Pharm, B.Pharm, M.Pharm, Pharm D students</p>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 bg-white p-4 rounded-lg border-2 border-transparent hover:border-blue-600 transition-colors duration-200 cursor-pointer">
                  <RadioGroupItem value="engineering" id="engineering" />
                  <Label htmlFor="engineering" className="cursor-pointer flex-1">
                    <span className="font-semibold text-gray-900">Engineering & Technology Training</span>
                    <p className="text-sm text-gray-600 mt-1">For engineering students and freshers</p>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {selectedStream && (
              <>
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="First name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Last name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 XXXXX XXXXX"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      placeholder="Your complete address"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Educational Background */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Educational Background</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="currentQualification">Current Qualification *</Label>
                      <Select onValueChange={(value) => handleSelectChange('currentQualification', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select qualification" />
                        </SelectTrigger>
                        <SelectContent>
                          {selectedStream === 'pharmacy' ? (
                            <>
                              <SelectItem value="dpharm">D. Pharmacy</SelectItem>
                              <SelectItem value="bpharm">B. Pharmacy</SelectItem>
                              <SelectItem value="mpharm">M. Pharmacy</SelectItem>
                              <SelectItem value="pharmd">Pharm D</SelectItem>
                              <SelectItem value="pharmdpb">Pharm D (Post Baccalaureate)</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="btech">B.Tech / B.E.</SelectItem>
                              <SelectItem value="mtech">M.Tech / M.E.</SelectItem>
                              <SelectItem value="bsc">B.Sc. (Computer Science / IT)</SelectItem>
                              <SelectItem value="msc">M.Sc. (Computer Science / IT)</SelectItem>
                              <SelectItem value="diploma">Diploma in Engineering</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="institution">Institution Name *</Label>
                      <Input
                        id="institution"
                        name="institution"
                        type="text"
                        value={formData.institution}
                        onChange={handleChange}
                        required
                        placeholder="Your college/university"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearOfStudy">Year of Study *</Label>
                      <Select onValueChange={(value) => handleSelectChange('yearOfStudy', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1st">1st Year</SelectItem>
                          <SelectItem value="2nd">2nd Year</SelectItem>
                          <SelectItem value="3rd">3rd Year</SelectItem>
                          <SelectItem value="4th">4th Year</SelectItem>
                          <SelectItem value="final">Final Year</SelectItem>
                          <SelectItem value="graduated">Graduated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Program Details */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Program Details</h3>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="duration">Preferred Training Duration *</Label>
                      <Select onValueChange={(value) => handleSelectChange('duration', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6weeks">Short-Term (6 Weeks)</SelectItem>
                          <SelectItem value="3months">Medium-Term (3 Months)</SelectItem>
                          <SelectItem value="6months">Long-Term (6 Months)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="hearAboutUs">How did you hear about us? *</Label>
                      <Select onValueChange={(value) => handleSelectChange('hearAboutUs', value)} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="friend">Friend/Colleague</SelectItem>
                          <SelectItem value="college">College/Institution</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Information</h3>
                  <div>
                    <Label htmlFor="whyApplying">Why do you want to join this program? *</Label>
                    <Textarea
                      id="whyApplying"
                      name="whyApplying"
                      value={formData.whyApplying}
                      onChange={handleChange}
                      required
                      placeholder="Tell us about your motivation and career goals..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}

            {!selectedStream && (
              <div className="text-center py-8 text-gray-500">
                Please select a training stream to continue with your application
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Admission;