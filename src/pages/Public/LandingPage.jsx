import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiShield, 
  FiTruck, 
  FiUsers, 
  FiArrowRight, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp, 
  FiClock,
  FiMapPin,
  FiBox
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { faqsList } from '../../data/mockData';

const LandingPage = () => {
  const { impactMetrics } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative pt-8 pb-12 lg:pt-16 lg:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#F8EFE1] border border-[#E8D8C1] text-[#4A2523] text-xs font-semibold tracking-wide">
                <FiHeart className="w-3.5 h-3.5 text-[#D7A94C]" />
                <span>Zero Food Waste • Social Impact Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#4A2523] leading-[1.15] tracking-tight">
                Surplus Food. <br />
                <span className="italic font-normal text-[#6B403C]">Stronger Communities.</span>
              </h1>

              <p className="text-lg sm:text-xl text-[#2D2422] leading-relaxed max-w-2xl">
                Good food deserves to be shared, not wasted. We connect event hosts with verified NGOs to give surplus cooked food a second purpose — serving people who need it most.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  to="/register?role=donor"
                  className="px-7 py-3.5 bg-[#4A2523] text-[#FFF9F0] text-base font-medium rounded-fc-md hover:bg-[#351816] transition-all flex items-center space-x-2 shadow-sm"
                >
                  <span>Donate Surplus Food</span>
                  <FiArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/how-it-works"
                  className="px-7 py-3.5 border border-[#4A2523] text-[#4A2523] text-base font-medium rounded-fc-md hover:bg-[#F8EFE1] transition-colors"
                >
                  How It Works
                </Link>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#E7DED1]">
                <div>
                  <div className="text-sm font-bold text-[#4A2523]">Surplus Cooked</div>
                  <div className="text-xs text-[#746B66]">Event leftover meals</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#4A2523]">Verified NGOs</div>
                  <div className="text-xs text-[#746B66]">Strict safety checks</div>
                </div>
                <div>
                  <div className="text-sm font-bold text-[#4A2523]">Volunteer Driven</div>
                  <div className="text-xs text-[#746B66]">Prompt local pickup</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Frame */}
            <div className="lg:col-span-5">
              <div className="relative rounded-fc-xl overflow-hidden border border-[#E7DED1] bg-[#FFFDF8] p-3 shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=1000"
                  alt="Surplus food spread from community feast"
                  className="w-full h-[420px] object-cover rounded-fc-lg"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-[#FFFDF8]/95 backdrop-blur-md border border-[#E7DED1] rounded-fc-lg p-4 shadow-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8F0E6] text-[#5F8F65] flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#4A2523]">Grand Wedding Buffet Rescued</div>
                      <div className="text-xs text-[#746B66]">150 freshly cooked meals delivered to Hope Shelter</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. EDITORIAL IMPACT METRICS BAR */}
      <section className="bg-[#FFFDF8] border-y border-[#E7DED1] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl font-bold text-[#4A2523]">Redistribution Impact</h2>
            <p className="text-sm text-[#746B66]">Collective progress in rescuing surplus cooked food across communities</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#E7DED1]/60">
            <div className="px-4">
              <div className="text-3xl lg:text-4xl font-serif font-bold text-[#4A2523]">{impactMetrics.mealsServed.toLocaleString('en-IN')}</div>
              <div className="text-sm font-medium text-[#2D2422] mt-1">Meals Served</div>
              <div className="text-xs text-[#746B66] mt-0.5">To communities in need</div>
            </div>

            <div className="px-4">
              <div className="text-3xl lg:text-4xl font-serif font-bold text-[#4A2523]">{impactMetrics.completedDeliveries.toLocaleString('en-IN')}</div>
              <div className="text-sm font-medium text-[#2D2422] mt-1">Deliveries Completed</div>
              <div className="text-xs text-[#746B66] mt-0.5">Recorded on the platform</div>
            </div>

            <div className="px-4">
              <div className="text-3xl lg:text-4xl font-serif font-bold text-[#4A2523]">{impactMetrics.eventsConnected.toLocaleString('en-IN')}</div>
              <div className="text-sm font-medium text-[#2D2422] mt-1">Events Connected</div>
              <div className="text-xs text-[#746B66] mt-0.5">Weddings & gatherings</div>
            </div>

            <div className="px-4">
              <div className="text-3xl lg:text-4xl font-serif font-bold text-[#4A2523]">{impactMetrics.partnerNgos.toLocaleString('en-IN')}</div>
              <div className="text-sm font-medium text-[#2D2422] mt-1">Partner NGOs</div>
              <div className="text-xs text-[#746B66] mt-0.5">Verified distribution hubs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS - NUMBERED EDITORIAL PROCESS ROW (NO 3-CARD CARDS!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Seamless Journey</span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A2523] mt-1">How Food Connect Operates</h2>
          <p className="text-base text-[#746B66] mt-2">
            A structured operational workflow connecting event hosts, verified NGOs, and volunteer logistics.
          </p>
        </div>

        {/* Numbered Horizontal Process Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          
          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] font-serif font-bold text-lg flex items-center justify-center border border-[#E8D8C1]">01</span>
              <FiBox className="w-5 h-5 text-[#D7A94C]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Event Host Posts Surplus</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              After a wedding or conference, the host posts food description, quantity, location, and preparation timing.
            </p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] font-serif font-bold text-lg flex items-center justify-center border border-[#E8D8C1]">02</span>
              <FiShield className="w-5 h-5 text-[#D7A94C]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Verified NGO Accepts</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              Nearby verified NGOs review food safety metrics and accept the donation for immediate community distribution.
            </p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] font-serif font-bold text-lg flex items-center justify-center border border-[#E8D8C1]">03</span>
              <FiTruck className="w-5 h-5 text-[#D7A94C]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">Volunteer Pick Up</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              A local volunteer receives the pickup assignment, collects food in insulated containers, and transports it safely.
            </p>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="w-10 h-10 rounded-full bg-[#F8EFE1] text-[#4A2523] font-serif font-bold text-lg flex items-center justify-center border border-[#E8D8C1]">04</span>
              <FiHeart className="w-5 h-5 text-[#D7A94C]" />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#4A2523]">People Are Served</h3>
            <p className="text-sm text-[#746B66] leading-relaxed">
              Food reaches shelters and community centers. Donors receive live completion notifications and social impact metrics.
            </p>
          </div>

        </div>
      </section>

      {/* 4. NGO & VOLUNTEER COLLABORATION EDITORIAL SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4A2523]">Partner Ecosystem</span>
              <h2 className="text-3xl font-serif font-bold text-[#4A2523]">
                Empowering NGOs & Volunteers to Drive Change
              </h2>
              <p className="text-base text-[#2D2422] leading-relaxed">
                Whether you operate a shelter feeding hundreds daily or wish to contribute your time as a pickup volunteer, FOOD CONNECT provides the technology layer to coordinate food logistics smoothly.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-[#5F8F65] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2D2422]">Rigorous NGO verification ensures food goes directly to community beneficiaries.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-[#5F8F65] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2D2422]">Real-time tracking of pickup status and estimated delivery time.</span>
                </div>
                <div className="flex items-start space-x-3">
                  <FiCheckCircle className="w-5 h-5 text-[#5F8F65] shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2D2422]">Complete food safety protocols with container & temperature guidelines.</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  to="/register?role=ngo"
                  className="px-6 py-3 bg-[#4A2523] text-[#FFF9F0] text-sm font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
                >
                  Register NGO
                </Link>
                <Link
                  to="/register?role=volunteer"
                  className="px-6 py-3 border border-[#4A2523] text-[#4A2523] text-sm font-medium rounded-fc-md hover:bg-[#FFFDF8] transition-colors"
                >
                  Join as Volunteer
                </Link>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800"
                alt="Volunteers serving meals at community center"
                className="w-full h-[360px] object-cover rounded-fc-lg border border-[#E7DED1]"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 5. SUCCESS STORIES & TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#4A2523]">Real Stories of Impact</h2>
          <p className="text-sm text-[#746B66] mt-2">How surplus food from celebrations became warm meals for others.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                alt="Donor Avatar"
                className="w-12 h-12 rounded-full object-cover border border-[#E7DED1]"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-[#4A2523]">Ananya & Vikram Hegde</h4>
                <p className="text-xs text-[#746B66]">Wedding Hosts, Mangalore</p>
              </div>
            </div>
            <p className="text-sm text-[#2D2422] italic leading-relaxed">
              "We had over 180 meals left after our reception. Through FOOD CONNECT, Hope Shelter accepted the donation within 20 minutes, and a volunteer picked it up in thermal boxes. Knowing our celebration fed families brought so much peace."
            </p>
            <div className="pt-2 text-xs font-semibold text-[#D7A94C] flex items-center space-x-2">
              <FiCheckCircle className="w-4 h-4 text-[#5F8F65]" />
              <span>Rescued 180 Meals • 100% Food Delivered</span>
            </div>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
                alt="NGO Director Avatar"
                className="w-12 h-12 rounded-full object-cover border border-[#E7DED1]"
              />
              <div>
                <h4 className="font-serif font-bold text-base text-[#4A2523]">Sister Maria D'Souza</h4>
                <p className="text-xs text-[#746B66]">Director, Hope Shelter & Kitchen</p>
              </div>
            </div>
            <p className="text-sm text-[#2D2422] italic leading-relaxed">
              "Accessing surplus food notifications from major event halls in the city allows our kitchen to provide wholesome, varied meals to over 250 residents daily without budget constraints."
            </p>
            <div className="pt-2 text-xs font-semibold text-[#D7A94C] flex items-center space-x-2">
              <FiCheckCircle className="w-4 h-4 text-[#5F8F65]" />
              <span>Verified NGO Partner • 1,200+ Meals Received</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FAQ ACCORDION SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-[#4A2523]">Frequently Asked Questions</h2>
          <p className="text-sm text-[#746B66] mt-2">Answers to common questions about food safety, pickup, and donation rules.</p>
        </div>

        <div className="space-y-4">
          {faqsList.map((faq, index) => (
            <div
              key={index}
              className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left p-5 flex items-center justify-between font-serif font-bold text-base text-[#4A2523] hover:bg-[#F8EFE1]/50 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaqIndex === index ? (
                  <FiChevronUp className="w-5 h-5 text-[#D7A94C] shrink-0" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-[#746B66] shrink-0" />
                )}
              </button>
              {openFaqIndex === index && (
                <div className="px-5 pb-5 text-sm text-[#746B66] leading-relaxed border-t border-[#E7DED1]/50 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#4A2523] text-[#FFF9F0] rounded-fc-xl p-10 lg:p-16 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold max-w-2xl mx-auto leading-tight">
            Turn Surplus Food Into Community Warmth
          </h2>
          <p className="text-base text-[#E8D8C1] max-w-xl mx-auto leading-relaxed">
            Hosting an upcoming wedding, party, or corporate banquet? Register today and ensure any leftover cooked food reaches people who need it.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              to="/register?role=donor"
              className="px-8 py-3.5 bg-[#FFF9F0] text-[#4A2523] font-bold rounded-fc-md hover:bg-[#F8EFE1] transition-colors shadow-md"
            >
              Start Donating Food
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 border border-[#E8D8C1] text-[#FFF9F0] font-medium rounded-fc-md hover:bg-[#351816] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
