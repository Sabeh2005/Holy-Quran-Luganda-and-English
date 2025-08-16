import React from 'react';

const Hero = () => {
  return (
    <div className="relative bg-primary text-primary-foreground rounded-xl p-8 md:p-16 text-center overflow-hidden mb-8">
      <div className="absolute inset-0 bg-dot-pattern opacity-20"></div>
      <div className="relative z-10">
        <h1 className="font-arabic text-5xl md:text-7xl mb-4">القرآن الكريم</h1>
        <h2 className="text-3xl md:text-5xl font-bold mb-2">Al-Quran</h2>
        <p className="text-lg md:text-xl text-primary-foreground/80 mb-6">Quran with Luganda translation</p>
        <div className="flex justify-center items-center flex-wrap gap-2 md:gap-4 text-sm md:text-base text-primary-foreground/60">
          <span>Luganda</span>
          <span className="text-xs">•</span>
          <span>English</span>
          <span className="text-xs">•</span>
          <span className="font-arabic">العربية</span>
          <span className="text-xs">•</span>
          <span>114 Surahs</span>
          <span className="text-xs">•</span>
          <span>Complete Quran</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;