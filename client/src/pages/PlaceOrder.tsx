import React from 'react';
import OrderForm from '../components/OrderForm';

const PlaceOrder: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <OrderForm />
      </div>
    </div>
  );
};

export default PlaceOrder;
