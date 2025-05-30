'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>(['']);
  const [numRounds, setNumRounds] = useState<number>(3);
  const [error, setError] = useState<string>('');

  const handleAddPlayer = () => {
    setPlayers([...players, '']);
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 1) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate player names
    const validPlayers = players.filter((p: string) => p.trim() !== '');
    
    if (validPlayers.length < 2) {
      setError('You need at least 2 players to start the game!');
      return;
    }
    
    // Check for duplicate names
    const uniqueNames = new Set(validPlayers.map((p: string) => p.trim().toLowerCase()));
    if (uniqueNames.size !== validPlayers.length) {
      setError('All player names must be unique!');
      return;
    }
    
    // Store game state in localStorage
    localStorage.setItem('herdMentality_players', JSON.stringify(validPlayers));
    localStorage.setItem('herdMentality_numRounds', numRounds.toString());
    localStorage.setItem('herdMentality_currentRound', '1');
    localStorage.setItem('herdMentality_scores', JSON.stringify(
      Object.fromEntries(validPlayers.map((p: string) => [p, 0]))
    ));
    
    // Navigate to the play page
    router.push('/play');
  };

  return (
    <main className="min-h-screen p-8">
      <div className="container mx-auto section-spacing">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 relative inline-block heading">
            Programming Herd Mentality
          </h1>
          <p className="text-xl text-gray-600 mt-6 flex justify-center items-center">
            <span className="emoji">🐄</span>
            The programming quiz where the herd mentality wins!
          </p>
        </header>
        
        <div className="max-w-2xl mx-auto card p-8 relative overflow-hidden">
          
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="emoji">🥛</span>
            Round Up Your Herd
          </h2>
          
          <form onSubmit={handleStartGame} className="space-y-lg">
            {error && (
              <div className="info-box warning p-4 mb-6">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <span className="emoji">🐄</span>
                Number of Rounds:
              </label>
              <input 
                type="number" 
                min="1" 
                max="10" 
                value={numRounds} 
                onChange={(e) => setNumRounds(parseInt(e.target.value) || 3)} 
                className="input w-32" 
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                <span className="emoji">🐮</span>
                Players:
              </label>
              
              <div className="space-y-3">
                {players.map((player, index) => (
                  <div key={index} className="flex items-center justify-between space-x-4">
                    <input 
                      type="text" 
                      value={player} 
                      onChange={(e) => handlePlayerChange(index, e.target.value)} 
                      placeholder={`Player ${index + 1} name`} 
                      className="input player-input" 
                      required 
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemovePlayer(index)} 
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      aria-label="Remove player"
                      disabled={players.length <= 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <button 
                type="button" 
                onClick={handleAddPlayer} 
                className="mt-3 flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="emoji">+</span> Add Another Player
              </button>
            </div>
            
            <div className="text-center mt-8">
              <button 
                type="submit" 
                className="button inline-flex items-center"
              >
                <span className="emoji">🐄</span> Start Herding!
              </button>
            </div>
          </form>
          
          <div className="mt-8 info-box primary">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Each round, players will be shown a programming-related question.</li>
              <li>Everyone writes down their answer without showing others.</li>
              <li>Players who give the most common answer earn points!</li>
              <li>The player with the most points at the end wins.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
