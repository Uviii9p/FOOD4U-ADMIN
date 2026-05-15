import React, { useEffect, useState } from 'react';
import { Tags, Image as ImageIcon, Gift, MessageSquare } from 'lucide-react';
import api from '../../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ categories: 0, gallery: 0, offers: 0, messages: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [cat, gal, off, msg] = await Promise.all([
          api.get('/categories'),
          api.get('/gallery'),
          api.get('/offers'),
          api.get('/messages')
        ]);
        setStats({
          categories: cat.data.length,
          gallery: gal.data.length,
          offers: off.data.length,
          messages: msg.data.length
        });
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Categories', value: stats.categories, icon: <Tags className="w-8 h-8 text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Gallery Images', value: stats.gallery, icon: <ImageIcon className="w-8 h-8 text-green-500" />, bg: 'bg-green-50' },
    { title: 'Active Offers', value: stats.offers, icon: <Gift className="w-8 h-8 text-purple-500" />, bg: 'bg-purple-50' },
    { title: 'Total Messages', value: stats.messages, icon: <MessageSquare className="w-8 h-8 text-orange-500" />, bg: 'bg-orange-50' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 flex items-center border border-gray-100">
            <div className={`p-4 rounded-full mr-4 ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
