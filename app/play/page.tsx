'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/lib/game';

export default function PlayPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    // Load game state from localStorage
    const storedPlayers = localStorage.getItem('herdMentality_players');
    const storedRound = localStorage.getItem('herdMentality_currentRound');
    const storedNumRounds = localStorage.getItem('herdMentality_numRounds');
    
    if (!storedPlayers) {
      router.push('/');
      return;
    }
    
    const players = JSON.parse(storedPlayers);
    const currentRound = storedRound ? parseInt(storedRound) : 1;
    const totalRounds = storedNumRounds ? parseInt(storedNumRounds) : 3;
    
    // Initialize game
    const newGame = new Game();
    players.forEach((player: string) => newGame.addPlayer(player));
    
    // Skip to the current question
    for (let i = 1; i < currentRound; i++) {
      newGame.nextQuestion();
    }
    


    setPlayers(players);
    setCurrentRound(currentRound);
    setTotalRounds(totalRounds);
    setGame(newGame);
    setCurrentQuestion(newGame.getCurrentQuestion().text);
    setAnswers(Object.fromEntries(players.map((p: string) => [p, ''])));
  }, [router]);



  const handleAnswerChange = (player: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [player]: answer
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!game) return;
    
    // Submit all answers
    Object.entries(answers).forEach(([player, answer]) => {
      if (answer.trim()) {
        game.submitAnswer(player, answer);
      }
    });
    
    // Store game state for results page
    localStorage.setItem('herdMentality_currentQuestion', currentQuestion);
    localStorage.setItem('herdMentality_answers', JSON.stringify(game.getCurrentQuestion().answers));
    
    // Navigate to results page
    router.push('/results');
  };

  if (!game) {
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="emoji-cow">🐮</span>
                <h2 className="text-2xl font-bold">Round {currentRound} of {totalRounds}</h2>
              </div>
              <span className="cow-badge">
                <span className="emoji-cow">🐄</span> Question {currentRound}/{totalRounds}
              </span>
            </div>
            
            <div className="info-box primary mb-6">
              <p className="text-xl font-medium">{currentQuestion}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-lg">
              <div className="space-y-md">
                {players.map(player => (
                  <div key={player} className="border p-6 rounded-md relative mb-6">
                    <div className="flex items-center mb-2">
                      <span className="emoji-cow">🐄</span>
                      <label htmlFor={player} className="block text-gray-700 font-semibold">{player}&apos;s Answer:</label>
                    </div>
                    <input 
                      type="text" 
                      id={player} 
                      value={answers[player] || ''} 
                      onChange={(e) => handleAnswerChange(player, e.target.value)} 
                      className="cow-input answer-input" 
                      required 
                    />
                    <p className="text-sm text-gray-500 mt-1 flex items-center">
                      <span className="emoji text-yellow-500">⚠️</span>
                      Other players should look away when it&apos;s not their turn!
                    </p>
                    <div className="absolute top-2 right-2 opacity-20 emoji-cow">🐮</div>
                  </div>
                ))}
              </div>
              
              <div className="cow-divider">
                <span className="emoji-bounce">🐮</span>
              </div>
              
              <div className="text-center mt-6">
                <button 
                  type="submit" 
                  className="cow-button inline-flex items-center"
                >
                  <span className="emoji-cow">🐄</span> Submit Herd Answers
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
