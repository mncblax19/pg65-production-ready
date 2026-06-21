import React from 'react';

export default function BrandSection() {
  return (
    <div className="relative flex w-full flex-col justify-center bg-linear-to-b from-[#FF8080] via-[#E03030] to-[#392525] px-8 py-12 lg:w-3/5 lg:px-16 lg:py-0">
      <div className="relative z-10">
        <h1 className="font-poppins mb-2 text-4xl font-bold text-white lg:text-6xl">PG-65</h1>
        <p className="font-poppins text-lg text-white/90 lg:text-xl">Practical Geriatrican</p>
      </div>

      {/* Decorative curved lines */}
      <div className="absolute right-0 bottom-0 left-0">
        <svg
          className="w-full"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 300 Q 200 200, 400 250 T 800 300"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M0 350 Q 250 250, 500 300 T 800 350"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>
    </div>
  );
}
