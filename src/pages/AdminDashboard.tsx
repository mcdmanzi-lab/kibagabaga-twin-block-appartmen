import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Trash2, LogOut, Calendar, Users, Home } from 'lucide-react';
import { format } from 'date-fns';

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

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const ADMIN_PASSWORD = 'kibagabaga'; // Default password

  useEffect(() => {
    // Check if already logged in
    const storedAuth = localStorage.getItem('kibagabaga_admin_auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      loadBookings();
    }
  }, []);

  const loadBookings = () => {
    const stored = localStorage.getItem('kibagabaga_bookings');
    const data = stored ? JSON.parse(stored) : [];
    setBookings(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      localStorage.setItem('kibagabaga_admin_auth', 'true');
      setPasswordError('');
      loadBookings();
      setPassword('');
    } else {
      setPasswordError('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('kibagabaga_admin_auth');
    setSelectedBooking(null);
  };

  const handleDeleteBooking = (id: string) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const updated = bookings.filter(b => b.id !== id);
      setBookings(updated);
      localStorage.setItem('kibagabaga_bookings', JSON.stringify(updated));
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-cream/50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-sm border border-charcoal/5">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-charcoal mb-2">Admin Access</h1>
            <p className="font-body text-sm text-charcoal/60">Kibagabaga Bookings</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="font-body text-sm font-medium text-charcoal/70">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                placeholder="Enter admin password"
                className="font-body text-base"
              />
              {passwordError && (
                <p className="font-body text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold/90 text-charcoal font-body font-semibold py-3 rounded-full"
            >
              Login
            </Button>
          </form>

          <p className="font-body text-xs text-charcoal/40 text-center mt-6">
            Default password: kibagabaga2024
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-cream/50">
      {/* Header */}
      <div className="bg-charcoal text-cream shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="font-display text-3xl font-medium">Bookings Dashboard</h1>
            <p className="font-body text-sm text-cream/60 mt-1">Kibagabaga Apartments</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="bg-cream/10 border-cream/30 text-cream hover:bg-cream/20"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bookings List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-charcoal/5 overflow-hidden">
              <div className="bg-gradient-to-r from-gold to-gold/80 px-8 py-6">
                <h2 className="font-display text-xl font-medium text-charcoal">
                  All Bookings ({bookings.length})
                </h2>
              </div>

              {bookings.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="mx-auto text-charcoal/20 mb-4" size={48} />
                  <p className="font-body text-charcoal/60">No bookings yet</p>
                </div>
              ) : (
                <div className="divide-y divide-charcoal/10">
                  {[...bookings].reverse().map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => setSelectedBooking(booking)}
                      className={`p-6 cursor-pointer transition-colors ${
                        selectedBooking?.id === booking.id
                          ? 'bg-gold/10 border-l-4 border-gold'
                          : 'hover:bg-cream/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-medium text-charcoal">
                            {booking.fullName}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm font-body text-charcoal/70">
                            <span>{booking.email}</span>
                            <span>{booking.phone}</span>
                          </div>
                          <div className="flex gap-4 mt-3 flex-wrap">
                            <div className="flex items-center gap-1 bg-charcoal/5 px-3 py-1 rounded-full text-xs font-body text-charcoal/70">
                              <Calendar size={14} />
                              {format(new Date(booking.checkInDate), 'MMM dd')} - {format(new Date(booking.checkOutDate), 'MMM dd')}
                            </div>
                            <div className="flex items-center gap-1 bg-charcoal/5 px-3 py-1 rounded-full text-xs font-body text-charcoal/70">
                              <Home size={14} />
                              {booking.numberOfBedrooms} BR
                            </div>
                            <div className="flex items-center gap-1 bg-charcoal/5 px-3 py-1 rounded-full text-xs font-body text-charcoal/70">
                              <Users size={14} />
                              {booking.numberOfGuests} Guest{booking.numberOfGuests !== '1' ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div>
            {selectedBooking ? (
              <div className="bg-white rounded-3xl shadow-sm border border-charcoal/5 overflow-hidden sticky top-6">
                <div className="bg-gradient-to-r from-charcoal to-charcoal/90 px-6 py-6">
                  <h3 className="font-display text-lg font-medium text-cream">Booking Details</h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Personal Info */}
                  <div className="space-y-3">
                    <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Personal Information
                    </h4>
                    <div className="space-y-2 text-sm font-body text-charcoal/80">
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Full Name</p>
                        <p className="font-semibold">{selectedBooking.fullName}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Email</p>
                        <p className="font-mono text-xs break-all">{selectedBooking.email}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Phone</p>
                        <p className="font-semibold">{selectedBooking.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-charcoal/10" />

                  {/* Booking Details */}
                  <div className="space-y-3">
                    <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Booking Details
                    </h4>
                    <div className="space-y-3 text-sm font-body text-charcoal/80">
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Check-in</p>
                        <p className="font-semibold">{format(new Date(selectedBooking.checkInDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Check-out</p>
                        <p className="font-semibold">{format(new Date(selectedBooking.checkOutDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Duration</p>
                        <p className="font-semibold">{calculateNights(selectedBooking.checkInDate, selectedBooking.checkOutDate)} nights</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Bedrooms</p>
                        <p className="font-semibold">{selectedBooking.numberOfBedrooms} Bedroom{selectedBooking.numberOfBedrooms !== '1' ? 's' : ''}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50 text-xs mb-1">Guests</p>
                        <p className="font-semibold">{selectedBooking.numberOfGuests} Guest{selectedBooking.numberOfGuests !== '1' ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {selectedBooking.specialRequests && (
                    <>
                      <div className="border-t border-charcoal/10" />
                      <div className="space-y-3">
                        <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                          Special Requests
                        </h4>
                        <p className="text-sm font-body text-charcoal/80 leading-relaxed">
                          {selectedBooking.specialRequests}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="border-t border-charcoal/10" />

                  {/* Submitted */}
                  <div className="space-y-3">
                    <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                      Submitted
                    </h4>
                    <p className="text-xs font-body text-charcoal/70">
                      {format(new Date(selectedBooking.submittedAt), 'MMM dd, yyyy \'at\' h:mm a')}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleDeleteBooking(selectedBooking.id)}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 mt-4"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Booking
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-charcoal/5 p-8 text-center sticky top-6">
                <Calendar className="mx-auto text-charcoal/20 mb-4" size={48} />
                <p className="font-body text-charcoal/60">Select a booking to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
