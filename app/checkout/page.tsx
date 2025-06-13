'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useCartStore from '@/store/cartStore';
import { toast } from 'react-toastify';

type PaymentMethod = 'card' | 'cod' | 'paypal';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    province: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolder: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    province: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardHolder: '',
    terms: '',
  });

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
              className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors"
            >
              Torna allo shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calcoli per i totali
  const subtotal = getTotalPrice();
  const shippingCost = shippingMethod === 'express' ? 6.90 : 0;
  const iva = subtotal * 0.22;
  const totalOrder = subtotal + shippingCost;

  // Gestione del cambiamento dei campi del form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Reset error quando l'utente inizia a digitare
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Gestione della checkbox per i termini e condizioni
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked);
    if (e.target.checked && errors.terms) {
      setErrors({
        ...errors,
        terms: '',
      });
    }
  };

  // Validazione del form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validazione nome e cognome
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Il nome è obbligatorio';
      isValid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Il cognome è obbligatorio';
      isValid = false;
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido';
      isValid = false;
    }

    // Validazione telefono
    const phoneRegex = /^[0-9]{8,15}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Inserisci un numero di telefono valido';
      isValid = false;
    }
    
    // Validazione indirizzo
    if (!formData.address.trim()) {
      newErrors.address = 'L\'indirizzo di spedizione è obbligatorio';
      isValid = false;
    }
    
    // Validazione città
    if (!formData.city.trim()) {
      newErrors.city = 'La città è obbligatoria';
      isValid = false;
    }
    
    // Validazione CAP
    const zipRegex = /^\d{5}$/;
    if (!formData.zipCode.trim() || !zipRegex.test(formData.zipCode)) {
      newErrors.zipCode = 'Inserisci un CAP valido (5 cifre)';
      isValid = false;
    }
    
    // Validazione provincia
    if (!formData.province.trim()) {
      newErrors.province = 'La provincia è obbligatoria';
      isValid = false;
    }
    
    // Validazione carta di credito se è selezionato il pagamento con carta
    if (paymentMethod === 'card') {
      // Validazione numero carta
      const cardNumberRegex = /^\d{16}$/;
      if (!formData.cardNumber.trim() || !cardNumberRegex.test(formData.cardNumber.replace(/\s+/g, ''))) {
        newErrors.cardNumber = 'Inserisci un numero di carta valido (16 cifre)';
        isValid = false;
      }
      
      // Validazione scadenza carta
      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
      if (!formData.cardExpiry.trim() || !expiryRegex.test(formData.cardExpiry)) {
        newErrors.cardExpiry = 'Inserisci una data di scadenza valida (MM/AA)';
        isValid = false;
      }
      
      // Validazione CVV
      const cvvRegex = /^\d{3}$/;
      if (!formData.cardCvv.trim() || !cvvRegex.test(formData.cardCvv)) {
        newErrors.cardCvv = 'Inserisci un CVV valido (3 cifre)';
        isValid = false;
      }
      
      // Validazione titolare carta
      if (!formData.cardHolder.trim()) {
        newErrors.cardHolder = 'Il nome del titolare è obbligatorio';
        isValid = false;
      }
    }
    
    // Validazione accettazione termini e condizioni
    if (!acceptTerms) {
      newErrors.terms = 'Devi accettare i Termini e Condizioni per procedere';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Gestione dell'invio del form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Recupera gli elementi del carrello
        const cartItems = items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }));

        // Recupera l'ID utente dal localStorage se l'utente è loggato
        let userId = null;
        const userDataStr = localStorage.getItem('user');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          userId = userData.id;
        }

        // Prepara i dati dell'ordine
        const orderData = {
          userId,
          items: cartItems,
          shippingAddress: formData.address,
          shippingCity: formData.city,
          shippingPostCode: formData.zipCode,
          shippingCountry: formData.province,
          paymentMethod: paymentMethod,
          customerEmail: formData.email // Aggiungiamo l'email del cliente per l'invio della conferma
        };

        // Invia i dati dell'ordine all'API
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          throw new Error('Errore durante la creazione dell\'ordine');
        }

        const result = await response.json();

        // Svuota il carrello
        clearCart();

        // Reindirizza alla pagina di conferma dell'ordine
        router.push(`/ordine-confermato?id=${result.orderId}`);
        
        toast.success("Ordine completato con successo! Email di conferma inviata.");
      } catch (error) {
        console.error('Errore durante la creazione dell\'ordine:', error);
        toast.error("Si è verificato un errore durante la creazione dell'ordine");
        setIsSubmitting(false);
      }
    } else {
      // Scroll alla prima sezione con errore
      const firstErrorElement = document.querySelector('.border-red-500');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  // Renderizza il messaggio di conferma dell'ordine
  if (showConfirmation) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Ordine completato con successo!</h1>
          <p className="mb-6 text-gray-600">
            Grazie per il tuo acquisto! Ti abbiamo inviato una conferma all'indirizzo email {formData.email}.
            <br />La tua spedizione verrà preparata entro 24 ore.
          </p>
          <div className="p-4 bg-gray-50 rounded-lg mb-6">
            <p className="font-medium">Numero ordine: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}</p>
            <p className="text-gray-600">Data: {new Date().toLocaleDateString('it-IT')}</p>
          </div>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-brand-orange text-white rounded-md font-medium hover:bg-opacity-90 transition"
          >
            Continua lo shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonna Sinistra: Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dati Anagrafici */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Dati Anagrafici</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Cognome
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="mt-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Indirizzo di Spedizione */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Indirizzo di Spedizione</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Indirizzo
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.address ? 'border-red-500' : 'border-gray-300'
                      } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        Città
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                      />
                      {errors.city && (
                        <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                        CAP
                      </label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                      />
                      {errors.zipCode && (
                        <p className="mt-1 text-sm text-red-500">{errors.zipCode}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                        Provincia
                      </label>
                      <input
                        type="text"
                        id="province"
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          errors.province ? 'border-red-500' : 'border-gray-300'
                        } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                      />
                      {errors.province && (
                        <p className="mt-1 text-sm text-red-500">{errors.province}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Metodo di Pagamento */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Metodo di Pagamento</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 p-4 rounded-lg border ${
                        paymentMethod === 'card'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-500'
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="font-medium">Carta di Credito</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`flex-1 p-4 rounded-lg border ${
                        paymentMethod === 'paypal'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 hover:border-orange-500'
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">PayPal</span>
                      </div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Numero Carta
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                        />
                        {errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                            Scadenza
                          </label>
                          <input
                            type="text"
                            id="cardExpiry"
                            name="cardExpiry"
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            placeholder="MM/AA"
                            className={`w-full px-4 py-2 rounded-lg border ${
                              errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                          />
                          {errors.cardExpiry && (
                            <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cardCvv"
                            name="cardCvv"
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className={`w-full px-4 py-2 rounded-lg border ${
                              errors.cardCvv ? 'border-red-500' : 'border-gray-300'
                            } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                          />
                          {errors.cardCvv && (
                            <p className="mt-1 text-sm text-red-500">{errors.cardCvv}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                          Nome Titolare
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-lg border ${
                            errors.cardHolder ? 'border-red-500' : 'border-gray-300'
                          } focus:ring-2 focus:ring-orange-500 focus:border-orange-500`}
                        />
                        {errors.cardHolder && (
                          <p className="mt-1 text-sm text-red-500">{errors.cardHolder}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Termini e Condizioni */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={handleTermsChange}
                    className="h-4 w-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    Accetto i <a href="#" className="text-orange-500 hover:text-orange-600">Termini e Condizioni</a>
                  </label>
                  {errors.terms && (
                    <p className="mt-1 text-sm text-red-500">{errors.terms}</p>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Colonna Destra: Riepilogo */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Riepilogo Ordine</h2>
            
            {/* Lista Prodotti */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-100">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Quantità: {item.quantity || 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      €{(item.price * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totale */}
            <div className="space-y-2 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotale</span>
                <span className="text-gray-900">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Spedizione</span>
                <span className="text-gray-900">€{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (22%)</span>
                <span className="text-gray-900">€{iva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-gray-100">
                <span className="text-gray-900">Totale</span>
                <span className="text-orange-500">€{totalOrder.toFixed(2)}</span>
              </div>
            </div>

            {/* Pulsante Conferma */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full mt-6 py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              } transition-colors`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Elaborazione...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Conferma e Paga
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 