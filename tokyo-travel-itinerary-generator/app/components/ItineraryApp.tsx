'use client';

import { useState } from 'react';
import { FormValues, Itinerary } from '../lib/types';
import { generateItinerary } from '../lib/mockApi';
import InputStep from './InputStep';
import LoadingStep from './LoadingStep';
import ResultStep from './ResultStep';

type Step = 'input' | 'loading' | 'result';

export default function ItineraryApp() {
  const [step, setStep] = useState<Step>('input');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  async function handleFormSubmit(values: FormValues) {
    setStep('loading');
    const result = await generateItinerary(values);
    setItinerary(result);
    setStep('result');
  }

  function handleReset() {
    setItinerary(null);
    setStep('input');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {step === 'input' && <InputStep onSubmit={handleFormSubmit} />}
      {step === 'loading' && <LoadingStep />}
      {step === 'result' && itinerary && (
        <ResultStep itinerary={itinerary} onReset={handleReset} />
      )}
    </div>
  );
}
