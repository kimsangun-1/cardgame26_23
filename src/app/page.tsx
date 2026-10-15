'use client';

import React, { useState } from 'react';
import { HwatuStartScreen } from '@/components/HwatuStartScreen';
import { HwatuGameBoard } from '@/components/HwatuGameBoard';

export default function Home() {
  const [nickname, setNickname] = useState<string | null>(null);

  const handleStartGame = (name: string) => {
    setNickname(name);
  };

  const handleResetToHome = () => {
    setNickname(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 font-sans">
      {!nickname ? (
        <HwatuStartScreen onStart={handleStartGame} />
      ) : (
        <HwatuGameBoard nickname={nickname} onResetToHome={handleResetToHome} />
      )}
    </div>
  );
}
