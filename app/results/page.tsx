'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Game } from '@/lib/game';

export default function ResultsPage() {
  const router = useRouter();
  const [question, setQuestion] = useState<string>('');
  const [mostCommon, setMostCommon] = useState<string>('');
  const [winners, setWinners] = useState<string[]>([]);
  const [allAnswers, setAllAnswers] = useState<Record<string, string>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [totalRounds, setTotalRounds] = useState<number>(3);
  const [isLastRound, setIsLastRound] = useState<boolean>(false);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    // Load game state from localStorage
    const storedPlayers = localStorage.getItem('herdMentality_players');
    const storedRound = localStorage.getItem('herdMentality_currentRound');
    const storedNumRounds = localStorage.getItem('herdMentality_numRounds');
    const storedQuestion = localStorage.getItem('herdMentality_currentQuestion');
    const storedAnswers = localStorage.getItem('herdMentality_answers');
    const storedScores = localStorage.getItem('herdMentality_scores');
    
    if (!storedPlayers || !storedAnswers) {
      router.push('/');
      return;
    }
    
    const players = JSON.parse(storedPlayers);
    const currentRound = storedRound ? parseInt(storedRound) : 1;
    const totalRounds = storedNumRounds ? parseInt(storedNumRounds) : 3;
    const answers = JSON.parse(storedAnswers);
    const scores = storedScores ? JSON.parse(storedScores) : {};
    
    // Initialize game
    const newGame = new Game();
    players.forEach((player: string) => newGame.addPlayer(player));
    
    // Skip to the current question
    for (let i = 1; i < currentRound; i++) {
      newGame.nextQuestion();
    }
    
    // Set answers from localStorage
    const currentQuestion = newGame.getCurrentQuestion();
    Object.entries(answers).forEach(([player, answer]) => {
      currentQuestion.addAnswer(player, answer as string);
    });
    
    // Score the question
    const playersWithMostCommon = newGame.scoreCurrentQuestion();
    
    // Update scores
    Object.entries(newGame.getScores()).forEach(([player, score]) => {
      scores[player] = score;
    });
    
    // Save updated scores
    localStorage.setItem('herdMentality_scores', JSON.stringify(scores));
    
    setQuestion(storedQuestion || currentQuestion.text);
    setMostCommon(currentQuestion.getMostCommonAnswer());
    setWinners(playersWithMostCommon);
    setAllAnswers(answers);
    setScores(scores);
    setCurrentRound(currentRound);
    setTotalRounds(totalRounds);
    setIsLastRound(currentRound >= totalRounds);
    setGame(newGame);
  }, [router]);

  const handleNextRound = () => {
    if (!game) return;
    
    if (isLastRound) {
      router.push('/game-over');
    } else {
      // Update current round
      const nextRound = currentRound + 1;
      localStorage.setItem('herdMentality_currentRound', nextRound.toString());
      
      // Navigate to next question
      router.push('/play');
    }
  };

  if (!game) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto section-spacing">
        <header className="text-center mb-8 relative">
          <div className="inline-block relative">
            <h1 className="text-4xl font-bold relative inline-block heading">
              Programming Herd Mentality
            </h1>
          </div>
        </header>
        
        <main>
          <div className="card p-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <span className="emoji">🐄</span>
                <h2 className="text-2xl font-bold">Herd Results</h2>
              </div>
              <span className="badge">
                <span className="emoji">🐮</span> Round {currentRound}/{totalRounds}
              </span>
            </div>
            
            <div className="info-box primary mb-6">
              <p className="text-lg font-medium">Question: {question}</p>
            </div>
            
            <div className="info-box success mb-8">
              <div className="flex items-center">
                <span className="emoji">🥛</span>
                <p className="text-lg font-medium">The herd's answer was: "{mostCommon}"</p>
              </div>
              <p className="text-md mt-2 flex items-center">
                <span className="emoji">🎉</span>
                Cows in the herd: {winners.join(', ')}
              </p>
            </div>
            
            <h3 className="text-xl font-bold mb-5 flex items-center mt-8">
              <span className="text-2xl mr-2">🐄</span>
              All Answers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(allAnswers).map(([player, answer]) => (
                <div 
                  key={player} 
                  className={`border p-4 rounded-md ${winners.includes(player) ? 'bg-green-50 border-green-300' : ''}`}
                >
                  <span className="font-semibold">{player}:</span> <span className="ml-2">"{answer}"</span>
                </div>
              ))}
            </div>
            
            <h3 className="text-xl font-bold mb-5 flex items-center mt-10">
              <span className="text-2xl mr-2">🏆</span>
              Current Scores
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .map(([player, score]) => (
                  <div key={player} className="border p-4 rounded-md flex justify-between items-center space-x-8">
                    <span className="font-semibold">{player}</span>
                    <span className="badge">{score} points</span>
                  </div>
                ))
              }
            </div>
            
            <div className="text-center mt-6">
              <button 
                onClick={handleNextRound}
                className="button inline-flex items-center"
              >
                <span className="emoji">🐄</span> 
                {isLastRound ? 'See Final Results' : 'Next Round'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
