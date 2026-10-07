import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from 'react-icons/fi';

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Enquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Get in Touch</span>
        <h1 className="text-4xl font-serif font-bold text-[#4A2523]">Contact FOOD CONNECT Support</h1>
        <p className="text-sm text-[#746B66]">
          Have questions about donating food, NGO verification, or volunteering? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Information */}
        <div className="lg:col-span-5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Central Office</h2>
          <p className="text-sm text-[#746B66] leading-relaxed">
            Our team coordinates donor verification, volunteer support, and NGO partnerships.
          </p>

          <div className="space-y-4 pt-2 text-sm text-[#2D2422]">
            <div className="flex items-start space-x-3">
              <FiMapPin className="w-5 h-5 text-[#D7A94C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#4A2523]">Headquarters</span>
                <span className="text-[#746B66]">Food Connect Coordination Hub, Light House Hill Road, Mangalore, KA 575001</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiMail className="w-5 h-5 text-[#D7A94C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#4A2523]">Email Us</span>
                <span className="text-[#746B66]">support@foodconnect.org</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <FiPhone className="w-5 h-5 text-[#D7A94C] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#4A2523]">Phone Hotline</span>
                <span className="text-[#746B66]">0800-FOOD-CONNECT (+91 800 366 3266)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-12 h-12 bg-[#E8F0E6] text-[#5F8F65] rounded-full flex items-center justify-center mx-auto">
                <FiCheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#4A2523]">Message Sent Successfully</h3>
              <p className="text-sm text-[#746B66] max-w-md mx-auto">
                Thank you for reaching out. Our support coordinator will get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816]"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-2xl font-serif font-bold text-[#4A2523]">Send a Message</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1.5">Enquiry Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                >
                  <option value="General Enquiry">General Enquiry</option>
                  <option value="Donor Support">Donor Support</option>
                  <option value="NGO Verification">NGO Verification Request</option>
                  <option value="Volunteer Support">Volunteer Inquiry</option>
                  <option value="Partnerships">Institutional Partnership</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1.5">Message</label>
                <textarea
                  rows="4"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4A2523] text-[#FFF9F0] font-medium text-sm rounded-fc-md hover:bg-[#351816] transition-colors flex items-center justify-center space-x-2"
              >
                <FiSend className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};

export default ContactPage;
