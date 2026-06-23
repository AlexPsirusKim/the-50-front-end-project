export default function LoadingStep() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-16 text-center">
      {/* Animated torii gate icon */}
      <div className="relative mb-8">
        <div className="text-6xl animate-bounce">⛩️</div>
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-red-200 animate-pulse"
        />
      </div>

      {/* Spinner */}
      <div className="flex gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-red-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        도쿄 여행 일정을 생성 중입니다
      </h2>
      <p className="text-sm text-gray-500 max-w-xs">
        선택하신 기간과 여행 목적에 맞는 최적의 일정을 만들고 있어요.
        잠시만 기다려 주세요!
      </p>

      {/* Progress dots */}
      <div className="mt-8 flex flex-col items-center gap-1 text-xs text-gray-400">
        <span className="animate-pulse">🗼 명소 탐색 중...</span>
      </div>
    </div>
  );
}
