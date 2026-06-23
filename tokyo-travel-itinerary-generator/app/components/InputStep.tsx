'use client';

import { useState } from 'react';
import {
  FormValues,
  TravelPurpose,
  PURPOSE_LABELS,
  PURPOSE_EMOJIS,
} from '../lib/types';

const ALL_PURPOSES: TravelPurpose[] = [
  'sightseeing',
  'food',
  'shopping',
  'culture',
  'nature',
  'nightlife',
];

interface Props {
  onSubmit: (values: FormValues) => void;
}

export default function InputStep({ onSubmit }: Props) {
  const [duration, setDuration] = useState(3);
  const [purposes, setPurposes] = useState<TravelPurpose[]>(['sightseeing', 'food']);
  const [error, setError] = useState('');

  function togglePurpose(p: TravelPurpose) {
    setPurposes((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
    setError('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (purposes.length === 0) {
      setError('여행 목적을 최소 하나 이상 선택해 주세요.');
      return;
    }
    onSubmit({ duration, purposes });
  }

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🗾</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">도쿄 여행 일정 생성기</h1>
        <p className="text-gray-500 text-sm">
          여행 기간과 목적을 선택하면 맞춤 일정을 만들어 드립니다
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Duration */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            여행 기간 <span className="text-red-500">*</span>
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={`
                  flex flex-col items-center justify-center rounded-xl py-3 text-sm font-medium
                  border-2 transition-all duration-150
                  ${
                    duration === d
                      ? 'border-red-500 bg-red-500 text-white shadow-sm'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-red-300'
                  }
                `}
              >
                <span className="text-lg font-bold">{d}</span>
                <span className="text-xs mt-0.5 opacity-80">일</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400 text-center">
            선택된 기간: <span className="font-semibold text-red-500">{duration}일</span>
          </p>
        </section>

        {/* Purpose */}
        <section>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            여행 목적 <span className="text-red-500">*</span>
            <span className="ml-2 text-xs font-normal text-gray-400">(중복 선택 가능)</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ALL_PURPOSES.map((p) => {
              const selected = purposes.includes(p);
              return (
                <label
                  key={p}
                  className={`
                    flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer
                    transition-all duration-150
                    ${
                      selected
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-red-200'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={selected}
                    onChange={() => togglePurpose(p)}
                  />
                  <span className="text-xl">{PURPOSE_EMOJIS[p]}</span>
                  <span
                    className={`text-sm font-medium ${
                      selected ? 'text-red-700' : 'text-gray-700'
                    }`}
                  >
                    {PURPOSE_LABELS[p]}
                  </span>
                  {selected && (
                    <span className="ml-auto text-red-500 text-xs">✓</span>
                  )}
                </label>
              );
            })}
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </section>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-red-500 py-4 text-base font-semibold text-white
                     hover:bg-red-600 active:scale-95 transition-all duration-150 shadow-md"
        >
          일정 생성하기 →
        </button>
      </form>
    </div>
  );
}
