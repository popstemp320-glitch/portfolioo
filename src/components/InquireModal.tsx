import React, { useState } from 'react';
import { X, Send, CheckCircle2, Calendar, MapPin, Sparkles } from 'lucide-react';

interface InquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const InquireModal: React.FC<InquireModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'weddings',
}) => {
  const [category, setCategory] = useState(defaultCategory);
  const [names, setNames] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Dark backdrop with blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[#17140f]/85 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-[#1c1813] border border-[#ece7db]/20 rounded-2xl p-6 sm:p-10 text-[#ece7db] shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full border border-[#ece7db]/20 text-[#ece7db]/70 hover:text-[#ece7db] hover:border-[#ece7db]/50 transition-colors cursor-pointer"
          aria-label="Close inquiry modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-[#7a8058] mb-4 animate-bounce" />
            <span className="font-mono-exif text-xs tracking-[0.3em] text-[#7a8058] uppercase">
              Inquiry Dispatched
            </span>
            <h3 className="font-display text-3xl sm:text-4xl text-[#ece7db] mt-2 mb-4">
              Thank You, {names.split(' ')[0] || 'Friend'}
            </h3>
            <p className="font-body text-sm text-[#d9d2c1]/80 max-w-md leading-relaxed mb-8">
              We accept a strictly limited allocation of 18 commissions per year to ensure archival devotion to every plate. Sumeet will review your details and respond within 48 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="font-mono-exif text-xs uppercase tracking-[0.2em] px-6 py-2.5 rounded-full bg-[#ece7db] text-[#17140f] hover:bg-[#ece7db]/90 cursor-pointer font-medium"
            >
              Return to Portfolio
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <span className="font-mono-exif text-[10px] tracking-[0.3em] text-[#837c6d] uppercase">
                COMMISSION & ARCHIVAL INQUIRY
              </span>
              <h2 className="font-display text-3xl sm:text-4xl text-[#ece7db] mt-1">
                Tell Us Your Story
              </h2>
              <p className="font-body text-sm text-[#837c6d] mt-2">
                Available nationwide & internationally. Washington DC · New York · Paris · Amalfi Coast.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category Selector */}
              <div>
                <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-2">
                  Commission Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'weddings', label: 'Wedding' },
                    { id: 'engagements', label: 'Engagement' },
                    { id: 'commercials', label: 'Commercial' },
                    { id: 'editorials', label: 'Editorial' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCategory(item.id)}
                      className={`py-2 px-3 text-xs font-mono-exif uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                        category === item.id
                          ? 'border-[#ece7db] bg-[#ece7db]/15 text-[#ece7db] font-semibold'
                          : 'border-[#ece7db]/15 text-[#837c6d] hover:border-[#ece7db]/30 hover:text-[#ece7db]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-1.5">
                    Your Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    placeholder="e.g. Clara & Julian"
                    className="w-full bg-[#26221a]/80 border border-[#ece7db]/20 rounded-lg px-4 py-2.5 text-sm text-[#ece7db] focus:outline-none focus:border-[#ece7db]"
                  />
                </div>
                <div>
                  <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clara@example.com"
                    className="w-full bg-[#26221a]/80 border border-[#ece7db]/20 rounded-lg px-4 py-2.5 text-sm text-[#ece7db] focus:outline-none focus:border-[#ece7db]"
                  />
                </div>
              </div>

              {/* Date & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" /> Event Date / Target Window
                  </label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. September 2026 or Fall 2026"
                    className="w-full bg-[#26221a]/80 border border-[#ece7db]/20 rounded-lg px-4 py-2.5 text-sm text-[#ece7db] focus:outline-none focus:border-[#ece7db]"
                  />
                </div>
                <div>
                  <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" /> Location / Venue
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. New York, Brooklyn Promenade or Villa Cimbrone"
                    className="w-full bg-[#26221a]/80 border border-[#ece7db]/20 rounded-lg px-4 py-2.5 text-sm text-[#ece7db] focus:outline-none focus:border-[#ece7db]"
                  />
                </div>
              </div>

              {/* Vision & Details */}
              <div>
                <label className="block font-mono-exif text-[10px] uppercase tracking-widest text-[#837c6d] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Creative Vision / Priorities
                </label>
                <textarea
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Share a glimpse of what you are planning, your aesthetic priorities, and what draws you to medium format film..."
                  className="w-full bg-[#26221a]/80 border border-[#ece7db]/20 rounded-lg px-4 py-2.5 text-sm text-[#ece7db] focus:outline-none focus:border-[#ece7db] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-full bg-[#ece7db] text-[#17140f] font-mono-exif text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>SEND INQUIRY</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
