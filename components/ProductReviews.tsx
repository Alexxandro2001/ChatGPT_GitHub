'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { toast } from 'react-hot-toast';

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: number;
    name: string | null;
    email: string;
  };
}

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { data: session, status } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Carica le recensioni al caricamento del componente
  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Funzione per caricare le recensioni
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reviews/${productId}`);
      
      if (!response.ok) {
        throw new Error('Errore nel recupero delle recensioni');
      }
      
      const data = await response.json();
      setReviews(data.reviews);
      setTotalReviews(data.totalReviews);
      setAverageRating(data.averageRating);
    } catch (error) {
      console.error('Errore:', error);
      toast.error('Errore nel caricamento delle recensioni');
    } finally {
      setLoading(false);
    }
  };

  // Funzione per inviare una nuova recensione
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Devi effettuare l\'accesso per lasciare una recensione');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore nell\'invio della recensione');
      }
      
      // Pulisci il form e ricarica le recensioni
      setComment('');
      setRating(5);
      toast.success('Recensione inviata con successo!');
      fetchReviews();
      
    } catch (error: any) {
      console.error('Errore:', error);
      toast.error(error.message || 'Errore nell\'invio della recensione');
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizza le stelle per una data valutazione
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${
              i < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Renderizza le stelle selezionabili per la form
  const renderSelectableStars = () => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setRating(i + 1)}
            className="focus:outline-none"
            aria-label={`${i + 1} stelle`}
          >
            <svg
              className={`h-8 w-8 ${
                i < rating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  // Formatta la data
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: it });
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recensioni dei clienti</h2>
      
      {/* Sommario recensioni */}
      <div className="flex items-center mb-6">
        <div className="flex items-center mr-4">
          {renderStars(Math.round(averageRating))}
          <span className="ml-2 text-lg font-semibold">
            {averageRating.toFixed(1)}
          </span>
        </div>
        <span className="text-gray-500">
          ({totalReviews} {totalReviews === 1 ? 'recensione' : 'recensioni'})
        </span>
      </div>
      
      {/* Form per nuova recensione (solo per utenti autenticati) */}
      {status === 'authenticated' && (
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Lascia una recensione</h3>
          <form onSubmit={submitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valutazione
              </label>
              {renderSelectableStars()}
            </div>
            
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Commento
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Condividi la tua esperienza con questo prodotto..."
                required
                minLength={3}
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
                submitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Invio in corso...' : 'Invia recensione'}
            </button>
          </form>
        </div>
      )}
      
      {/* Lista recensioni */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 last:border-b-0">
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold">
                      {review.user.name ? review.user.name.charAt(0).toUpperCase() : '?'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <p className="font-semibold mr-2">
                      {review.user.name || 'Utente'}
                    </p>
                    <span className="text-gray-500 text-sm">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  
                  <p className="text-gray-700 whitespace-pre-line">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nessuna recensione disponibile per questo prodotto.</p>
          {status === 'authenticated' ? (
            <p className="mt-2">Sii il primo a recensire questo prodotto!</p>
          ) : (
            <p className="mt-2">Accedi per lasciare una recensione.</p>
          )}
        </div>
      )}
    </div>
  );
} 