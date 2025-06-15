'use client';

import Link from 'next/link';
import { useState } from 'react';

interface CheckoutStepsProps {
  currentStep: 1 | 2 | 3;
}

export default function CheckoutSteps({ currentStep = 1 }: CheckoutStepsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-16">
        {/* Step 1 */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-500">Step 1</div>
            <div className={`font-semibold ${currentStep === 1 ? 'text-black' : 'text-gray-500'}`}>Address</div>
          </div>
        </div>

        {/* Linea di connessione */}
        <div className="flex-1 h-px bg-gray-300 mx-4"></div>

        {/* Step 2 */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-5h2.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v1h-2V8a1 1 0 00-1-1H8a1 1 0 00-1 1v3a1 1 0 001 1h2a1 1 0 001-1v-1h2v1a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-500">Step 2</div>
            <div className={`font-semibold ${currentStep === 2 ? 'text-black' : 'text-gray-500'}`}>Shipping</div>
          </div>
        </div>

        {/* Linea di connessione */}
        <div className="flex-1 h-px bg-gray-300 mx-4"></div>

        {/* Step 3 */}
        <div className="flex flex-col items-center relative z-10">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mt-2 text-center">
            <div className="text-sm font-medium text-gray-500">Step 3</div>
            <div className={`font-semibold ${currentStep === 3 ? 'text-black' : 'text-gray-500'}`}>Payment</div>
          </div>
        </div>
      </div>

      {/* Contenuto Step 1 */}
      {currentStep === 1 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Select Address</h2>
          
          {/* Indirizzo Casa */}
          <div className="bg-gray-50 p-6 mb-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="home"
                    name="address"
                    className="h-5 w-5 text-black focus:ring-black"
                    defaultChecked
                  />
                  <label htmlFor="home" className="ml-2 font-semibold">
                    2118 Thornridge
                  </label>
                  <span className="ml-2 text-xs bg-black text-white px-2 py-1 rounded">HOME</span>
                </div>
                <div className="ml-7">
                  <p className="text-gray-700 mb-1">2118 Thornridge Cir. Syracuse, Connecticut 35624</p>
                  <p className="text-gray-700">(209) 555-0104</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Indirizzo Ufficio */}
          <div className="bg-gray-50 p-6 mb-6 rounded-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <input
                    type="radio"
                    id="office"
                    name="address"
                    className="h-5 w-5 text-black focus:ring-black"
                  />
                  <label htmlFor="office" className="ml-2 font-semibold">
                    Headoffice
                  </label>
                  <span className="ml-2 text-xs bg-black text-white px-2 py-1 rounded">OFFICE</span>
                </div>
                <div className="ml-7">
                  <p className="text-gray-700 mb-1">2715 Ash Dr. San Jose, South Dakota 83475</p>
                  <p className="text-gray-700">(704) 555-0127</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button className="text-gray-500 hover:text-black">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Aggiungi nuovo indirizzo */}
          <button className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-black hover:border-gray-400 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Address
          </button>

          {/* Pulsanti di navigazione */}
          <div className="flex justify-end mt-8 space-x-4">
            <button className="px-6 py-3 border border-gray-300 rounded-md text-black font-medium hover:bg-gray-50 transition-colors">
              Back
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {/* Contenuto Step 2 */}
      {currentStep === 2 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Shipping Method</h2>
          {/* Contenuto per lo step 2 */}
        </div>
      )}

      {/* Contenuto Step 3 */}
      {currentStep === 3 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          {/* Contenuto per lo step 3 */}
        </div>
      )}
    </div>
  );
} 