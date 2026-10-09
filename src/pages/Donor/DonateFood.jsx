import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { FiBox, FiClock, FiMapPin, FiShield, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const DonateFood = () => {
  const { user } = useAuth();
  const { createDonation } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Wedding',
    foodType: '',
    description: '',
    quantity: '100 meals',
    estimatedMeals: '100',
    preparationTime: 'Prepared 1-2 hours ago',
    address: '45 Grand Palace Road',
    city: 'Mangalore',
    postalCode: '575001',
    donorName: user?.name || 'Shifali Rao',
    donorPhone: user?.phone || '+91 98765 11223',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupFrom: '19:00',
    pickupTo: '22:00',
    temperatureMaintained: 'Kept hot above 60°C in insulated warmers',
    containerType: 'Sealed stainless steel urns & food-grade boxes',
    allergens: 'Standard Vegetarian / Contains Dairy'
  });

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meals = Number(formData.estimatedMeals);
    if (!formData.eventName.trim() || !formData.foodType.trim() || !formData.address.trim() || !formData.city.trim()) {
      setError('Add the event name, food summary, pickup address, and city before publishing.');
      return;
    }
    if (!Number.isInteger(meals) || meals < 1) {
      setError('Estimated meals must be a whole number greater than zero.');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const res = await createDonation({ ...formData, eventName: formData.eventName.trim(), foodType: formData.foodType.trim(), address: formData.address.trim(), estimatedMeals: meals });
      if (res.success) {
        navigate(`/donor/donations/${res.donation.id}`);
      } else {
        setError(res.error || 'Could not publish the donation. Please try again.');
      }
    } catch {
      setError('Could not reach the server. Check that the backend is running, then try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="border-b border-[#E7DED1] pb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D7A94C]">Surplus Cooked Food</span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#4A2523] mt-1">
          Post Surplus Food Donation
        </h1>
        <p className="text-sm text-[#746B66] mt-1">
          Register safe leftover meals from your event. Verified NGOs nearby will be notified to accept and coordinate volunteer pickup.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-8 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            
            {/* Section 1: Event Information */}
            <div className="space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#4A2523] border-b border-[#E7DED1] pb-2 flex items-center space-x-2">
                <FiBox className="w-5 h-5 text-[#D7A94C]" />
                <span>1. Event & Food Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Event Name *</label>
                  <input
                    type="text"
                    value={formData.eventName}
                    onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                    placeholder="e.g. Royal Banquet Reception"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Event Category</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  >
                    <option value="Wedding">Wedding Reception</option>
                    <option value="Corporate Event">Corporate Summit / Gala</option>
                    <option value="Birthday Party">Birthday / Anniversary</option>
                    <option value="Community Gathering">Community Feast</option>
                    <option value="Religious Function">Religious Gathering</option>
                    <option value="Other">Other Event</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Food Summary & Cuisine *</label>
                  <input
                    type="text"
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    placeholder="e.g. North Indian Buffet (Curries, Biryani, Naan)"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Estimated Meals Count *</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.estimatedMeals}
                    onChange={(e) => setFormData({ ...formData, estimatedMeals: e.target.value, quantity: `${e.target.value} meals` })}
                    placeholder="100"
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1">Detailed Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mention dishes, packing status, and handling guidelines..."
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Section 2: Pickup Location & Window */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif font-bold text-lg text-[#4A2523] border-b border-[#E7DED1] pb-2 flex items-center space-x-2">
                <FiMapPin className="w-5 h-5 text-[#D7A94C]" />
                <span>2. Pickup Location & Timing</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#4A2523] mb-1">Pickup Street Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Anand Banquet Hall, 45 Grand Palace Road"
                  className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Pickup Date</label>
                  <input
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-sm text-[#2D2422] focus:border-[#4A2523] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Time Window (From - To)</label>
                  <div className="flex space-x-2">
                    <input
                      type="time"
                      value={formData.pickupFrom}
                      onChange={(e) => setFormData({ ...formData, pickupFrom: e.target.value })}
                      className="w-1/2 px-2 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422]"
                    />
                    <input
                      type="time"
                      value={formData.pickupTo}
                      onChange={(e) => setFormData({ ...formData, pickupTo: e.target.value })}
                      className="w-1/2 px-2 py-2.5 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Food Safety Metrics */}
            <div className="space-y-4 pt-2">
              <h3 className="font-serif font-bold text-lg text-[#4A2523] border-b border-[#E7DED1] pb-2 flex items-center space-x-2">
                <FiShield className="w-5 h-5 text-[#5F8F65]" />
                <span>3. Food Safety Confirmation</span>
              </h3>

              <div className="space-y-3 bg-[#F8EFE1]/60 p-4 rounded-fc-lg border border-[#E8D8C1]">
                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Temperature Maintenance</label>
                  <input
                    type="text"
                    value={formData.temperatureMaintained}
                    onChange={(e) => setFormData({ ...formData, temperatureMaintained: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A2523] mb-1">Container & Packaging Type</label>
                  <input
                    type="text"
                    value={formData.containerType}
                    onChange={(e) => setFormData({ ...formData, containerType: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-md text-xs text-[#2D2422]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            {error && (
              <div role="alert" aria-live="polite" className="p-4 bg-[#F5E3E0] border border-[#ECC9C5] text-[#B84C46] text-sm rounded-fc-md">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              aria-busy={saving}
              className="w-full py-3.5 bg-[#4A2523] text-[#FFF9F0] font-bold text-base rounded-fc-md hover:bg-[#351816] disabled:opacity-70 disabled:cursor-wait transition-colors flex items-center justify-center space-x-2 shadow-sm"
            >
              <span>{saving ? 'Publishing donation…' : 'Publish Surplus Food Donation'}</span>
              {!saving && <FiArrowRight className="w-5 h-5" />}
            </button>

          </form>
        </div>

        {/* Right Column: Editorial Food Safety Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#F8EFE1] border border-[#E8D8C1] rounded-fc-xl p-6 space-y-4">
            <h4 className="font-serif font-bold text-lg text-[#4A2523]">Food Safety Guidelines</h4>
            <p className="text-xs text-[#746B66] leading-relaxed">
              FOOD CONNECT handles cooked food with utmost responsibility. Please ensure:
            </p>
            <ul className="space-y-2.5 text-xs text-[#2D2422]">
              <li className="flex items-start space-x-2">
                <FiCheckCircle className="w-4 h-4 text-[#5F8F65] shrink-0 mt-0.5" />
                <span>Food is untouched, freshly prepared, and stored clean.</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiCheckCircle className="w-4 h-4 text-[#5F8F65] shrink-0 mt-0.5" />
                <span>Hot food is kept above 60°C or cold items below 5°C.</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiCheckCircle className="w-4 h-4 text-[#5F8F65] shrink-0 mt-0.5" />
                <span>Containers are food-grade and securely covered.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#FFFDF8] border border-[#E7DED1] rounded-fc-xl p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#E8F0E6] text-[#5F8F65] flex items-center justify-center mx-auto">
              <FiShield className="w-5 h-5" />
            </div>
            <h5 className="font-serif font-bold text-base text-[#4A2523]">Verified NGO Network</h5>
            <p className="text-xs text-[#746B66] leading-relaxed">
              Once published, nearby registered NGOs will review and accept your donation. A volunteer will pick up the food during your requested window.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default DonateFood;
