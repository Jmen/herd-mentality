from collections import Counter
from typing import Dict, List, Set

class Question:
    def __init__(self, text: str):
        self.text = text
        self.answers: Dict[str, str] = {}
    
    def add_answer(self, player_name: str, answer: str):
        """
        Add a player's answer to the question
        """
        self.answers[player_name] = answer
    
    def get_most_common_answer(self) -> str:
        """
        Return the most common answer among all players
        """
        if not self.answers:
            return ""
        
        counter = Counter(self.answers.values())
        return counter.most_common(1)[0][0]
    
    def get_players_with_most_common_answer(self) -> List[str]:
        """
        Return a list of players who gave the most common answer
        """
        if not self.answers:
            return []
        
        most_common = self.get_most_common_answer()
        return [player for player, answer in self.answers.items() if answer == most_common]

class Game:
    def __init__(self, questions_file: str):
        self.questions_file = questions_file
        self.questions: List[Question] = []
        self.current_question_index = 0
        self.players: Set[str] = set()
        self.scores: Dict[str, int] = {}
    
    def load_questions(self) -> List[Question]:
        """
        Load questions from the text file
        """
        with open(self.questions_file, 'r') as file:
            questions = [Question(line.strip()) for line in file if line.strip()]
        
        self.questions = questions
        return questions
    
    def add_player(self, player_name: str):
        """
        Add a player to the game
        """
        self.players.add(player_name)
        self.scores[player_name] = 0
    
    def get_current_question(self) -> Question:
        """
        Get the current question
        """
        if not self.questions:
            self.load_questions()
        
        return self.questions[self.current_question_index]
    
    def submit_answer(self, player_name: str, answer: str):
        """
        Submit a player's answer for the current question
        """
        if player_name not in self.players:
            raise ValueError(f"Player {player_name} is not in the game")
        
        current_question = self.get_current_question()
        current_question.add_answer(player_name, answer)
    
    def next_question(self):
        """
        Move to the next question
        """
        if not self.questions:
            self.load_questions()
        
        self.current_question_index = (self.current_question_index + 1) % len(self.questions)
    
    def score_current_question(self):
        """
        Score the current question and update player scores
        """
        current_question = self.get_current_question()
        players_with_most_common = current_question.get_players_with_most_common_answer()
        
        # Award 1 point to players who gave the most common answer
        for player in players_with_most_common:
            self.scores[player] += 1
        
        return players_with_most_common
    
    def get_scores(self) -> Dict[str, int]:
        """
        Get the current scores for all players
        """
        return self.scores
