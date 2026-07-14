import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { format, addDays } from 'date-fns';
import { Check, AlertCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  numberOfBedrooms: string;
  numberOfGuests: string;
  specialRequests: string;
}

interface Booking {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfBedrooms: string;
  numberOfGuests: string;
  specialRequests: string;
  submittedAt: string;
}

export default function Booking() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    checkInDate: undefined,
    checkOutDate: undefined,
    numberOfBedrooms: '',
    numberOfGuests: '',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Name is required';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.checkInDate) newErrors.checkInDate = 'Check-in date is required';
    if (!formData.checkOutDate) newErrors.checkOutDate = 'Check-out date is required';
    if (!formData.numberOfBedrooms) newErrors.numberOfBedrooms = 'Please select bedroom type';
    if (!formData.numberOfGuests) newErrors.numberOfGuests = 'Please select number of guests';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleDateChange = (date: Date | undefined, field: 'checkInDate' | 'checkOutDate') => {
    setFormData(prev => ({ ...prev, [field]: date }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save to localStorage
      const newBooking: Booking = {
        id: Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        checkInDate: formData.checkInDate?.toISOString() || '',
        checkOutDate: formData.checkOutDate?.toISOString() || '',
        numberOfBedrooms: formData.numberOfBedrooms,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests,
        submittedAt: new Date().toISOString(),
      };

      // Get existing bookings
      const existingBookings = JSON.parse(localStorage.getItem('kibagabaga_bookings') || '[]');
      existingBookings.push(newBooking);
      localStorage.setItem('kibagabaga_bookings', JSON.stringify(existingBookings));

      setSubmitStatus('success');
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          checkInDate: undefined,
          checkOutDate: undefined,
          numberOfBedrooms: '',
          numberOfGuests: '',
          specialRequests: '',
        });
        setSubmitStatus('idle');
      }, 3000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative w-full bg-gradient-to-b from-cream to-cream/50"
      style={{ padding: '120px 0' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          ref={contentRef}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Reserve Your Stay
            </span>
            <h2
              className="mt-4 font-display font-medium text-charcoal leading-[1.1] tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Plan Your Move to <br className="hidden md:inline" />
              Kibagabaga
            </h2>
            <p className="mt-6 font-body text-charcoal/60 text-base lg:text-lg leading-relaxed">
              Check availability and book your apartment viewing or reservation today. Our team will confirm your booking within 24 hours.
            </p>
          </div>

          {/* Booking Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-charcoal/5">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-display text-lg text-charcoal font-medium">Personal Information</h3>
                    
                    <div className="space-y-2">
                      <label className="font-body text-sm font-medium text-charcoal/70">Full Name</label>
                      <Input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="font-body text-base"
                      />
                      {errors.fullName && (
                        <p className="font-body text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} /> {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Email Address</label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="font-body text-base"
                        />
                        {errors.email && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Phone Number</label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+250 XXX XXX XXX"
                          className="font-body text-base"
                        />
                        {errors.phone && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4 pt-6 border-t border-charcoal/10">
                    <h3 className="font-display text-lg text-charcoal font-medium">Booking Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Check-in Date */}
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Check-in Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-body"
                            >
                              {formData.checkInDate
                                ? format(formData.checkInDate, 'MMM dd, yyyy')
                                : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.checkInDate}
                              onSelect={(date) => handleDateChange(date, 'checkInDate')}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkInDate && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.checkInDate}
                          </p>
                        )}
                      </div>

                      {/* Check-out Date */}
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Check-out Date</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-body"
                            >
                              {formData.checkOutDate
                                ? format(formData.checkOutDate, 'MMM dd, yyyy')
                                : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formData.checkOutDate}
                              onSelect={(date) => handleDateChange(date, 'checkOutDate')}
                              disabled={(date) =>
                                !formData.checkInDate ||
                                date <= formData.checkInDate
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        {errors.checkOutDate && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.checkOutDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Number of Bedrooms */}
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Number of Bedrooms</label>
                        <Select
                          value={formData.numberOfBedrooms}
                          onValueChange={(value) => handleSelectChange('numberOfBedrooms', value)}
                        >
                          <SelectTrigger className="font-body text-base">
                            <SelectValue placeholder="Select bedrooms" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Bedroom</SelectItem>
                            <SelectItem value="2">2 Bedrooms</SelectItem>
                            <SelectItem value="3">3 Bedrooms</SelectItem>
                            <SelectItem value="4">4 Bedrooms</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.numberOfBedrooms && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.numberOfBedrooms}
                          </p>
                        )}
                      </div>

                      {/* Number of Guests */}
                      <div className="space-y-2">
                        <label className="font-body text-sm font-medium text-charcoal/70">Number of Guests</label>
                        <Select
                          value={formData.numberOfGuests}
                          onValueChange={(value) => handleSelectChange('numberOfGuests', value)}
                        >
                          <SelectTrigger className="font-body text-base">
                            <SelectValue placeholder="Select guests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Guest</SelectItem>
                            <SelectItem value="2">2 Guests</SelectItem>
                            <SelectItem value="3">3 Guests</SelectItem>
                            <SelectItem value="4">4 Guests</SelectItem>
                            <SelectItem value="5">5+ Guests</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.numberOfGuests && (
                          <p className="font-body text-xs text-red-500 flex items-center gap-1">
                            <AlertCircle size={14} /> {errors.numberOfGuests}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-4 pt-6 border-t border-charcoal/10">
                    <h3 className="font-display text-lg text-charcoal font-medium">Additional Information</h3>
                    
                    <div className="space-y-2">
                      <label className="font-body text-sm font-medium text-charcoal/70">Special Requests (Optional)</label>
                      <Textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        placeholder="Any special requests or questions? Let us know..."
                        className="font-body text-base min-h-24 resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Status */}
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                      <Check className="text-green-600" size={20} />
                      <div>
                        <p className="font-body text-sm font-semibold text-green-900">Booking Confirmed!</p>
                        <p className="font-body text-xs text-green-700">Your booking has been saved. The owner will review all bookings from the admin dashboard.</p>
                      </div>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                      <AlertCircle className="text-red-600" size={20} />
                      <div>
                        <p className="font-body text-sm font-semibold text-red-900">Something went wrong</p>
                        <p className="font-body text-xs text-red-700">Please try again or call us directly.</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-gold/90 text-charcoal font-body font-semibold py-6 text-base rounded-full transition-colors duration-300"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Complete Booking'
                    )}
                  </Button>

                  <p className="font-body text-xs text-charcoal/50 text-center">
                    Your booking request will be saved and the owner can view it from the admin dashboard.
                  </p>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-charcoal text-cream rounded-3xl p-8 space-y-6">
                <div>
                  <h3 className="font-display text-xl font-medium mb-4">Booking Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-cream/10">
                      <span className="font-body text-sm text-cream/70">Check-in</span>
                      <span className="font-body font-semibold text-cream">
                        {formData.checkInDate ? format(formData.checkInDate, 'MMM dd') : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-cream/10">
                      <span className="font-body text-sm text-cream/70">Check-out</span>
                      <span className="font-body font-semibold text-cream">
                        {formData.checkOutDate ? format(formData.checkOutDate, 'MMM dd') : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-cream/10">
                      <span className="font-body text-sm text-cream/70">Duration</span>
                      <span className="font-body font-semibold text-cream">
                        {formData.checkInDate && formData.checkOutDate
                          ? `${Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24))} nights`
                          : '--'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-body text-sm text-cream/70">Bedrooms</span>
                      <span className="font-body font-semibold text-cream">
                        {formData.numberOfBedrooms || '--'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gold/10 rounded-2xl p-4">
                  <p className="font-body text-xs text-cream/60 mb-2">Starting from</p>
                  <p className="font-display text-3xl font-semibold text-gold">500K RWF</p>
                  <p className="font-body text-xs text-cream/50 mt-2">per month</p>
                </div>

                <div className="space-y-3 pt-6 border-t border-cream/10">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-xs text-cream/80">Verified property</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-xs text-cream/80">Instant confirmation</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-xs text-cream/80">24/7 support</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-cream border-2 border-charcoal/10 rounded-3xl p-6 text-center">
                <p className="font-body text-xs text-charcoal/60 mb-4">Need help booking?</p>
                <a
                  href="tel:+250788236675"
                  className="inline-flex items-center justify-center w-full px-6 py-3 bg-gold text-charcoal font-body text-sm font-semibold rounded-full hover:bg-charcoal hover:text-cream transition-colors duration-300"
                >
                  <svg className="mr-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Call Us
                </a>
                <p className="font-body text-xs text-charcoal/60 mt-4">+250 788 236 675</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
