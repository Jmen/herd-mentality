import sys
from typing import List
from game import Game, Question

class GameCLI:
    def __init__(self, game: Game):
        self.game = game
    
    def display_welcome_message(self):
        """
        Display a welcome message for the game
        """
        print("\n" + "=" * 50)
        print("Welcome to Programming Herd Mentality!")
        print("=" * 50)
        print("\nIn this game, you'll answer programming-related questions.")
        print("Points are awarded to players who give the same answer as the majority.")
        print("The goal is to think like the herd!\n")
    
    def setup_players(self):
        """
        Set up players for the game
        """
        print("\nLet's set up the players!")
        print("Enter player names one by one (press Enter with no name to finish):")
        
        while True:
            player_name = input("Enter player name: ").strip()
            if not player_name:
                break
            
            self.game.add_player(player_name)
            print(f"Added {player_name} to the game!")
        
        print(f"\nGame set up with {len(self.game.players)} players: {', '.join(self.game.players)}")
    
    def display_question(self):
        """
        Display the current question
        """
        current_question = self.game.get_current_question()
        print("\n" + "-" * 50)
        print(f"Question: {current_question.text}")
        print("-" * 50)
    
    def collect_answers(self):
        """
        Collect answers from all players for the current question
        """
        print("\nTime to collect answers!")
        print("(Other players should look away when it's not their turn)")
        
        for player in sorted(self.game.players):
            input(f"\nPress Enter when {player} is ready to answer...")
            answer = input(f"{player}, what's your answer? ")
            self.game.submit_answer(player, answer)
            print("\n" * 20)  # Clear the screen a bit
    
    def display_results(self):
        """
        Display the results of the current question
        """
        current_question = self.game.get_current_question()
        most_common = current_question.get_most_common_answer()
        winners = self.game.score_current_question()
        
        print("\n" + "*" * 50)
        print("Results:")
        print("*" * 50)
        
        print(f"\nThe most common answer was: \"{most_common}\"")
        print(f"Players with this answer: {', '.join(winners)}")
        
        print("\nAll answers:")
        for player, answer in sorted(current_question.answers.items()):
            print(f"{player}: \"{answer}\"")
        
        print("\nCurrent scores:")
        for player, score in sorted(self.game.get_scores().items()):
            print(f"{player}: {score} points")
    
    def play_round(self):
        """
        Play a single round of the game
        """
        self.display_question()
        self.collect_answers()
        self.display_results()
        self.game.next_question()
    
    def play_game(self, num_rounds: int = None):
        """
        Play the full game
        """
        self.display_welcome_message()
        self.setup_players()
        
        if not self.game.players:
            print("No players added. Exiting game.")
            return
        
        if num_rounds is None:
            num_rounds = int(input("\nHow many rounds would you like to play? "))
        
        for round_num in range(1, num_rounds + 1):
            print(f"\n\nRound {round_num} of {num_rounds}")
            self.play_round()
        
        self.display_final_results()
    
    def display_final_results(self):
        """
        Display the final results of the game
        """
        print("\n" + "=" * 50)
        print("Final Results")
        print("=" * 50)
        
        scores = self.game.get_scores()
        winner_score = max(scores.values()) if scores else 0
        winners = [player for player, score in scores.items() if score == winner_score]
        
        print("\nFinal scores:")
        for player, score in sorted(scores.items(), key=lambda x: x[1], reverse=True):
            print(f"{player}: {score} points")
        
        if winners:
            if len(winners) == 1:
                print(f"\nThe winner is {winners[0]} with {winner_score} points!")
            else:
                print(f"\nIt's a tie! The winners are {', '.join(winners)} with {winner_score} points each!")

def main():
    game = Game("questions.txt")
    game.load_questions()
    cli = GameCLI(game)
    cli.play_game()

if __name__ == "__main__":
    main()
