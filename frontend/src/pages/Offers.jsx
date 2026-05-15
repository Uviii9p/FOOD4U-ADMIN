import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Clock } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    api.get('/offers').then(res => {
      setOffers(res.data.filter(o => o.active));
    }).catch(console.error);
  }, []);

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary">Special In-Store Offers</h1>
          <div className="w-24 h-1 bg-accent mx-auto mt-4"></div>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">Visit our store to avail these exciting discounts and offers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map(offer => (
            <div key={offer._id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col">
              <div className="h-56 relative">
                <img src={`http://localhost:5001${offer.image}`} alt={offer.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  Active Offer
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-primary mb-2">{offer.title}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{offer.description}</p>
                <div className="flex items-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 text-accent" />
                  <span>Valid till: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
          {offers.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-10">No active offers at the moment. Please check back later.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Offers;
