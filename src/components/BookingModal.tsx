import React, { useState } from "react";
import { X, Calendar, Users, ShieldCheck, Check, Info, Sparkles, CreditCard, Share2, ClipboardList, Star } from "lucide-react";
import { Activity, Booking } from "../types";

interface BookingModalProps {
  activity: Activity;
  onClose: () => void;
  onSubmitBooking: (bookingData: {
    activityId: string;
    date: string;
    guests: number;
    addOns: string[];
    totalPaid: number;
  }) => void;
  userEmail: string;
}

export default function BookingModal({
  activity,
  onClose,
  onSubmitBooking,
  userEmail,
}: BookingModalProps) {
  const [viewState, setViewState] = useState<"details" | "checkout" | "receipt">("details");
  const [selectedDate, setSelectedDate] = useState(activity.dates[0] || "2026-07-04");
  const [guestsCount, setGuestsCount] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  // Add-ons list
  const addOnsCatalog = [
    { id: "meal", label: "Chulha wood-fired Village Lunch (Pithla Bhakri)", price: 250, perGuest: true },
    { id: "tarp", label: "Premium high-altitude rainproof tent tarp protection", price: 150, perGuest: false },
    { id: "guide", label: "Private local tribal naturalist guild guide", price: 800, perGuest: false }
  ];

  const handleToggleAddOn = (id: string) => {
    if (selectedAddOns.includes(id)) {
      setSelectedAddOns(selectedAddOns.filter((x) => x !== id));
    } else {
      setSelectedAddOns([...selectedAddOns, id]);
    }
  };

  // Price calculations
  const basePrice = activity.price * guestsCount;
  const addOnsPrice = addOnsCatalog
    .filter((a) => selectedAddOns.includes(a.id))
    .reduce((acc, curr) => acc + (curr.perGuest ? curr.price * guestsCount : curr.price), 0);
  const totalPrice = basePrice + addOnsPrice;

  // Razorpay payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentLoading(true);

    // Simulate gateway handshakes
    setTimeout(async () => {
      setPaymentLoading(false);

      const addOnLabels = addOnsCatalog
        .filter((a) => selectedAddOns.includes(a.id))
        .map((a) => a.label);

      try {
        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId: activity.id,
            date: selectedDate,
            guests: guestsCount,
            addOns: addOnLabels,
            email: userEmail,
            totalPaid: totalPrice
          })
        });
        const data = await response.json();
        if (data.success) {
          setConfirmedBooking(data.booking);
          setViewState("receipt");
        } else {
          alert("Booking submission failed. Please try again.");
        }
      } catch (err) {
        // Fallback local voucher trigger if server endpoint fails
        const randId = Math.floor(1000 + Math.random() * 9000);
        const mockBooking = {
          bookingCode: `TMAI-VCH-${randId}`,
          activityTitle: activity.title,
          destinationName: "Bhandardara Backwaters",
          date: selectedDate,
          guests: guestsCount,
          totalPrice: totalPrice,
          addOns: addOnLabels
        };
        setConfirmedBooking(mockBooking);
        setViewState("receipt");
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto" id="booking-modal-overlay">
      
      {/* Central Card Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" id="booking-modal-card">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
              {viewState === "details" ? "Trip Portfolio" : viewState === "checkout" ? "Secure Checkout" : "Booking Confirmed"}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          
          {/* VIEW 1: Portfolio / Details */}
          {viewState === "details" && (
            <div className="space-y-6">
              
              {/* Top Summary Info */}
              <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    {activity.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Operated by <strong className="text-slate-300">{activity.operatorName}</strong> • Verified Sahyadri Guide
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-emerald-400 font-mono font-bold text-lg">₹{activity.price}</span>
                  <span className="block text-[10px] text-slate-500 font-mono">per traveler</span>
                </div>
              </div>

              {/* Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-center">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Difficulty</span>
                  <span className="block text-white font-bold text-xs mt-0.5">{activity.difficulty}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Duration</span>
                  <span className="block text-white font-bold text-xs mt-0.5">{activity.duration}</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <span className="block text-[10px] text-slate-500 uppercase">Safety Rating</span>
                  <span className="block text-white font-bold text-xs mt-0.5">{activity.safetyScore}/100</span>
                </div>
              </div>

              {/* Photo Showcase */}
              <div className="h-44 rounded-xl overflow-hidden border border-slate-800 relative">
                <img
                  src={activity.image}
                  alt={activity.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded text-[10px] font-mono">
                  EcoScore {activity.ecoScore}% • Carbon Footprint {activity.carbonFootprint}
                </div>
              </div>

              {/* Trip Slots */}
              <div className="space-y-2">
                <h4 className="font-display font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  Select Travel Slot Date
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {activity.dates.map((d) => (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`p-2 rounded-xl text-center text-xs font-mono border transition ${
                        selectedDate === d
                          ? "bg-teal-950/40 border-teal-500 text-teal-400 font-bold"
                          : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="space-y-3 pt-3 border-t border-slate-800/60">
                <h4 className="font-display font-bold text-xs text-slate-300 uppercase tracking-wider">
                  Verified Reviews
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-white">Ameya K.</strong>
                      <span className="text-amber-400">★★★★★</span>
                    </div>
                    <p className="text-[11px] text-slate-400 italic mt-1">
                      "Extremely well-organized. The guides were extremely cautious of flash floods and rain safety. The wood-fired breakfast was incredible!"
                    </p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: Secure Checkout Form */}
          {viewState === "checkout" && (
            <div className="space-y-6">
              <div className="p-4 bg-teal-950/20 border border-teal-900/30 rounded-xl flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Securing slots for {selectedDate}</span>
                  <span className="text-slate-400 block">Provide guest details to initialize secure local booking protocols.</span>
                </div>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4" id="razorpay-form">
                
                {/* Guests counter */}
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                  <div className="text-xs">
                    <span className="text-white font-semibold block">Total Travelers</span>
                    <span className="text-slate-500 block text-[10px]">Max 10 per party</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={guestsCount <= 1}
                      onClick={() => setGuestsCount(guestsCount - 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition disabled:opacity-55"
                    >
                      -
                    </button>
                    <span className="font-mono text-white font-bold w-4 text-center">{guestsCount}</span>
                    <button
                      type="button"
                      disabled={guestsCount >= 10}
                      onClick={() => setGuestsCount(guestsCount + 1)}
                      className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition disabled:opacity-55"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Maharashtra Add-ons checklist */}
                <div className="space-y-2">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Maharashtra Special Add-ons</span>
                  <div className="space-y-2">
                    {addOnsCatalog.map((addOn) => (
                      <div
                        key={addOn.id}
                        onClick={() => handleToggleAddOn(addOn.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          selectedAddOns.includes(addOn.id)
                            ? "bg-teal-950/20 border-teal-500/40 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                            selectedAddOns.includes(addOn.id) ? "bg-teal-600 border-teal-500" : "border-slate-800"
                          }`}>
                            {selectedAddOns.includes(addOn.id) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-xs font-medium">{addOn.label}</span>
                        </div>
                        <span className="text-xs font-mono font-bold shrink-0 text-emerald-400">
                          +₹{addOn.price} {addOn.perGuest && "/guest"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stylized Mock Razorpay payment frame */}
                <div className="p-4 rounded-xl border border-orange-500/30 bg-orange-950/10 space-y-3">
                  <div className="flex items-center justify-between border-b border-orange-950/40 pb-2">
                    <span className="text-xs font-bold text-orange-400 flex items-center gap-1 font-display">
                      <CreditCard className="w-4 h-4" />
                      Razorpay Secure Terminal
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: SECURE_P10283</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase">Card Holder Name</label>
                      <input
                        type="text"
                        required
                        defaultValue="Ben Waeldon"
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase">Card Number</label>
                      <input
                        type="text"
                        required
                        defaultValue="4111 •••• •••• 1234"
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 rounded focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-slate-500 uppercase">CVV / Expiry</label>
                      <input
                        type="text"
                        required
                        defaultValue="12/29 • 321"
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2.5 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Summary & Trigger */}
                <div className="p-4 bg-slate-950 rounded-xl space-y-2 border border-slate-800/60 text-xs font-mono">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Fee ({guestsCount} travelers)</span>
                    <span>₹{basePrice}</span>
                  </div>
                  {addOnsPrice > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Add-ons Surcharge</span>
                      <span>₹{addOnsPrice}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-emerald-400 font-bold text-sm">
                    <span>Grand Total Due</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={paymentLoading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs cursor-pointer transition shadow-lg flex items-center justify-center gap-2"
                >
                  {paymentLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Contacting Gateways...
                    </>
                  ) : (
                    `Authorize & Pay ₹${totalPrice}`
                  )}
                </button>
              </form>
            </div>
          )}

          {/* VIEW 3: Confirmed Voucher Receipt */}
          {viewState === "receipt" && confirmedBooking && (
            <div className="space-y-6 text-center py-6">
              
              <div className="relative w-16 h-16 mx-auto bg-emerald-950 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-8 h-8" />
                <Sparkles className="w-5 h-5 text-amber-500 absolute -top-1 -right-1 animate-pulse" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="font-display font-bold text-xl text-white">Adventure Confirmed!</h3>
                <p className="text-xs text-slate-400">
                  Your booking is authorized with operator <strong>{activity.operatorName}</strong>. Check your email for full logistics details.
                </p>
              </div>

              {/* Digital Pass Receipt Ticket */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 border-dashed max-w-sm mx-auto space-y-3 text-left relative overflow-hidden" id="booking-digital-pass">
                {/* side circle cutouts */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-900 border-r border-slate-800" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-900 border-l border-slate-800" />

                <div className="text-center pb-2 border-b border-slate-900">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold block uppercase tracking-widest">DIGITAL TRAVEL VOUCHER</span>
                  <span className="text-[11px] font-mono text-slate-400 mt-0.5 block font-bold">{confirmedBooking.bookingCode}</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono pt-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="text-white font-bold">{confirmedBooking.destinationName || "Sahyadri Mountains"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date slot:</span>
                    <span className="text-white font-bold">{confirmedBooking.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Group size:</span>
                    <span className="text-white font-bold">{confirmedBooking.guests} Travelers</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="text-emerald-400 font-bold">₹{confirmedBooking.totalPrice}</span>
                  </div>
                  {confirmedBooking.addOns && confirmedBooking.addOns.length > 0 && (
                    <div className="pt-1.5 border-t border-slate-900 text-[10px] text-slate-400">
                      <strong>Selected Add-ons:</strong>
                      <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                        {confirmedBooking.addOns.map((add: string, index: number) => (
                          <li key={index}>{add}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => alert("Itinerary passport downloaded in PDF format successfully!")}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-orange-400" />
                  PDF Download
                </button>
                <button
                  onClick={() => alert(`Share Code: ${confirmedBooking.bookingCode} copied to clipboard!`)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  Share Receipt
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer (CTAs) */}
        {viewState !== "receipt" && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-4">
            {viewState === "details" ? (
              <>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => setViewState("checkout")}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-8 py-3 rounded-xl cursor-pointer transition shadow-md"
                  id="modal-details-book-btn"
                >
                  Book slots for {selectedDate}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setViewState("details")}
                  className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Back to Details
                </button>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Total: <strong className="text-emerald-400 text-sm font-mono">₹{totalPrice}</strong>
                </span>
              </>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
