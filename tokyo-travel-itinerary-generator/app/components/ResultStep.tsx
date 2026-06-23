'use client';

import { useState } from 'react';
import { Itinerary, PURPOSE_EMOJIS, PURPOSE_LABELS } from '../lib/types';

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  sightseeing: 'bg-blue-100 text-blue-700',
  food:        'bg-amber-100 text-amber-700',
  shopping:    'bg-purple-100 text-purple-700',
  culture:     'bg-orange-100 text-orange-700',
  nature:      'bg-green-100 text-green-700',
  nightlife:   'bg-indigo-100 text-indigo-700',
};

const TIMELINE_COLORS: Record<string, string> = {
  sightseeing: 'border-blue-400',
  food:        'border-amber-400',
  shopping:    'border-purple-400',
  culture:     'border-orange-400',
  nature:      'border-green-400',
  nightlife:   'border-indigo-400',
};

export default function ResultStep({ itinerary, onReset }: Props) {
  const [activeDay, setActiveDay] = useState(1);

  const currentDay = itinerary.days.find((d) => d.day === activeDay)!;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">🗾</div>
        <h1 className="text-xl font-bold text-gray-900">도쿄 여행 일정</h1>
        <p className="text-sm text-gray-500 mt-1">
          {itinerary.duration}일 ·{' '}
          {itinerary.purposes.map((p) => PURPOSE_LABELS[p]).join(', ')}
        </p>
        {/* Purpose badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {itinerary.purposes.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs text-red-700"
            >
              {PURPOSE_EMOJIS[p]} {PURPOSE_LABELS[p]}
            </span>
          ))}
        </div>
      </div>

      {/* Day tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-hide">
        {itinerary.days.map((d) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(d.day)}
            className={`
              flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150
              ${
                activeDay === d.day
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Day theme */}
      <div className="rounded-xl bg-gradient-to-r from-red-500 to-rose-400 px-5 py-4 mb-6 text-white shadow-sm">
        <p className="text-xs font-medium opacity-80">Day {currentDay.day}</p>
        <p className="text-base font-semibold mt-0.5">{currentDay.theme}</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[52px] top-0 bottom-0 w-px bg-gray-200" />

        <div className="space-y-6">
          {currentDay.items.map((item, idx) => (
            <div key={idx} className="flex gap-4 relative">
              {/* Time */}
              <div className="w-[52px] flex-shrink-0 text-right">
                <span className="text-xs font-semibold text-gray-500 leading-none">
                  {item.time}
                </span>
              </div>

              {/* Dot */}
              <div
                className={`
                  relative z-10 flex-shrink-0 w-4 h-4 mt-0.5 rounded-full border-2 bg-white
                  ${TIMELINE_COLORS[item.category] ?? 'border-gray-400'}
                `}
              />

              {/* Card */}
              <div className="flex-1 rounded-xl border border-gray-100 bg-white p-4 shadow-sm -mt-1">
                {/* Category badge */}
                <span
                  className={`
                    inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium mb-2
                    ${CATEGORY_COLORS[item.category] ?? 'bg-gray-100 text-gray-600'}
                  `}
                >
                  {PURPOSE_EMOJIS[item.category]} {PURPOSE_LABELS[item.category]}
                </span>
                <p className="font-semibold text-gray-900 text-sm">{item.place}</p>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Day navigation */}
      <div className="flex justify-between mt-8 gap-3">
        <button
          onClick={() => setActiveDay((d) => Math.max(1, d - 1))}
          disabled={activeDay === 1}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600
                     hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← 이전 날
        </button>
        <button
          onClick={() => setActiveDay((d) => Math.min(itinerary.duration, d + 1))}
          disabled={activeDay === itinerary.duration}
          className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600
                     hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          다음 날 →
        </button>
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="mt-4 w-full rounded-xl bg-red-500 py-3.5 text-sm font-semibold text-white
                   hover:bg-red-600 active:scale-95 transition-all duration-150 shadow-sm"
      >
        새 일정 만들기
      </button>
    </div>
  );
}
