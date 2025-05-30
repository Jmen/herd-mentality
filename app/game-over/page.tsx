'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GameOverPage() {
  const router = useRouter();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [winners, setWinners] = useState<string[]>([]);
  const [winnerScore, setWinnerScore] = useState<number>(0);

  useEffect(() => {
    // Load game state from localStorage
    const storedScores = localStorage.getItem('herdMentality_scores');
    
    if (!storedScores) {
      router.push('/');
      return;
    }
    
    const scores = JSON.parse(storedScores);
    
    // Find the winners (players with highest score)
    const highestScore = Math.max(...Object.values(scores).map(score => Number(score)));
    const winners = Object.entries(scores)
      .filter(([, score]) => score === highestScore)
      .map(([player]) => player);
    
    setScores(scores);
    setWinners(winners);
    setWinnerScore(highestScore);
  }, [router]);

  const handlePlayAgain = () => {
    // Clear game state
    localStorage.removeItem('herdMentality_players');
    localStorage.removeItem('herdMentality_numRounds');
    localStorage.removeItem('herdMentality_currentRound');
    localStorage.removeItem('herdMentality_scores');
    localStorage.removeItem('herdMentality_currentQuestion');
    localStorage.removeItem('herdMentality_answers');
    
    // Navigate to home page
    router.push('/');
  };

  if (Object.keys(scores).length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 cow-pattern">
      <div className="container mx-auto section-spacing">
        <header className="text-center mb-8 relative">
          <div className="inline-block relative">
            <h1 className="text-4xl font-bold relative inline-block heading">
              Programming Herd Mentality
            </h1>
          </div>
        </header>
        
        <main>
          <div className="cow-card p-6 max-w-2xl mx-auto">
            <div className="cow-spots"></div>
            <div className="text-center mb-6">
              <div className="flex justify-center items-center">
                <span className="emoji-cow">🐮</span>
                <h2 className="text-3xl font-bold relative inline-block">
                  Final Results
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-pink-400 rounded"></span>
                </h2>
                <span className="emoji-cow">🐄</span>
              </div>
              <p className="text-gray-600 mt-4">The herd has spoken!</p>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-6 text-center relative overflow-hidden">
              <div className="flex justify-center mb-2">
                <span className="text-4xl emoji-bounce">🏆</span>
              </div>
              {winners.length === 1 ? (
                <p className="text-2xl font-bold text-yellow-800">The lead cow is {winners[0]}!</p>
              ) : (
                <p className="text-2xl font-bold text-yellow-800">It&apos;s a tie! The lead cows are {winners.join(', ')}!</p>
              )}
              <p className="text-xl text-yellow-700 mt-2">With {winnerScore} points</p>
              <div className="flex justify-center mt-3">
                <div className="mx-1 hoof-print">🐾</div>
                <div className="mx-1 hoof-print">🐾</div>
                <div className="mx-1 hoof-print">🐾</div>
              </div>
            </div>
            
            <div className="cow-divider">
              <span className="emoji-cow">🐄</span>
            </div>
            
            <h3 className="text-xl font-bold mb-3 flex items-center justify-center">
              <span className="text-2xl mr-2 emoji-cow">🐄</span>
              Final Herd Standings
              <span className="text-2xl ml-2 emoji-cow">🐄</span>
            </h3>
            <div className="space-y-3 mb-6">
              {Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .map(([player, score]) => (
                  <div 
                    key={player} 
                    className={`border p-4 rounded-md flex justify-between items-center space-x-8 ${winners.includes(player) ? 'bg-yellow-50 border-yellow-300' : ''}`}
                  >
                    <span className="font-semibold">{player}</span>
                    <span className="cow-badge">{score} points</span>
                  </div>
                ))
              }
            </div>
            
            <div className="text-center mt-8">
              <button 
                onClick={handlePlayAgain}
                className="cow-button inline-flex items-center"
              >
                <span className="emoji-cow">🐄</span> Herd Again!
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
