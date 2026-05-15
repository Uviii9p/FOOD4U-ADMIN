import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Trash2, Mail } from 'lucide-react';
import { toast } from 'react-toastify';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data);
    } catch (err) {
      toast.error('Failed to load messages');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await api.delete(`/messages/${id}`);
        toast.success('Message deleted');
        fetchMessages();
      } catch (err) {
        toast.error('Error deleting message');
      }
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Messages</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No messages yet.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                <th className="px-6 py-4 font-semibold text-gray-600">Message</th>
                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-800">{msg.name}</td>
                  <td className="px-6 py-4 text-blue-600">
                    <a href={`mailto:${msg.email}`}>{msg.email}</a>
                  </td>
                  <td className="px-6 py-4 text-gray-600 max-w-md truncate" title={msg.message}>
                    {msg.message}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(msg._id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageMessages;
