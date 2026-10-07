import React, { useState } from 'react';
import { faqsList } from '../../data/mockData';
import { FiChevronDown, FiChevronUp, FiHelpCircle } from 'react-icons/fi';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F8EFE1] text-[#4A2523] flex items-center justify-center mx-auto border border-[#E8D8C1]">
          <FiHelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-[#4A2523]">Frequently Asked Questions</h1>
        <p className="text-sm text-[#746B66]">
          Find detailed guidance on food safety, donation eligibility, NGO verification, and transport.
        </p>
      </div>

      <div className="space-y-4">
        {faqsList.map((faq, idx) => (
          <div key={idx} className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full text-left p-5 flex items-center justify-between font-serif font-bold text-base text-[#4A2523] hover:bg-[#F8EFE1]/40 transition-colors"
            >
              <span>{faq.question}</span>
              {openIndex === idx ? (
                <FiChevronUp className="w-5 h-5 text-[#D7A94C] shrink-0" />
              ) : (
                <FiChevronDown className="w-5 h-5 text-[#746B66] shrink-0" />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 text-sm text-[#746B66] leading-relaxed border-t border-[#E7DED1]/50 pt-3">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default FAQPage;
