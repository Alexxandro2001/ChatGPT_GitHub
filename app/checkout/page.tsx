'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddressStep from './steps/address';
import useCartStore from '@/store/cartStore';

type CheckoutStep = 'address' | 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice } = useCartStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');

  // Se il carrello è vuoto, reindirizza alla home
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Carrello vuoto</h1>
            <p className="text-gray-600 mb-8">Il tuo carrello è vuoto. Aggiungi alcuni prodotti prima di procedere al checkout.</p>
            <button 
              onClick={() => router.push('/')}
              className="inline-flex items-center px-6 py-3 bg-[#f97316] text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Torna allo shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleNext = () => {
    if (currentStep === 'address') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      // Qui gestiresti la finalizzazione dell'ordine
      console.log('Ordine completato!');
    }
  };

  const handleBack = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('address');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    } else {
      // Se siamo già al primo step, torniamo alla pagina del carrello
      router.push('/carrello');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentStep === 'address' && (
        <AddressStep 
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      
      {/* Qui aggiungeresti gli altri step */}
      {currentStep === 'shipping' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
          {/* Contenuto dello step shipping */}
          <div className="flex justify-end mt-8 space-x-4">
            <button 
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-black font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 'payment' && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          {/* Contenuto dello step payment */}
          <div className="flex justify-end mt-8 space-x-4">
            <button 
              onClick={handleBack}
              className="px-6 py-3 border border-gray-300 rounded-md text-black font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button 
              onClick={handleNext}
              className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Complete Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 