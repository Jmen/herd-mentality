import unittest
from game import Game, Question

class TestGame(unittest.TestCase):
    def test_load_questions_from_file(self):
        # Arrange
        game = Game("questions.txt")
        
        # Act
        questions = game.load_questions()
        
        # Assert
        self.assertGreater(len(questions), 0)
        self.assertIsInstance(questions[0], Question)
    
    def test_question_has_correct_attributes(self):
        # Arrange
        question_text = "What's your favorite programming language?"
        
        # Act
        question = Question(question_text)
        
        # Assert
        self.assertEqual(question.text, question_text)
        self.assertEqual(question.answers, {})
    
    def test_add_player_answer(self):
        # Arrange
        question = Question("What's your favorite programming language?")
        player_name = "Alice"
        answer = "Python"
        
        # Act
        question.add_answer(player_name, answer)
        
        # Assert
        self.assertEqual(question.answers[player_name], answer)
    
    def test_get_most_common_answer(self):
        # Arrange
        question = Question("What's your favorite programming language?")
        question.add_answer("Alice", "Python")
        question.add_answer("Bob", "JavaScript")
        question.add_answer("Charlie", "Python")
        question.add_answer("Dave", "Java")
        
        # Act
        most_common = question.get_most_common_answer()
        
        # Assert
        self.assertEqual(most_common, "Python")
    
    def test_get_players_with_most_common_answer(self):
        # Arrange
        question = Question("What's your favorite programming language?")
        question.add_answer("Alice", "Python")
        question.add_answer("Bob", "JavaScript")
        question.add_answer("Charlie", "Python")
        question.add_answer("Dave", "Java")
        
        # Act
        players = question.get_players_with_most_common_answer()
        
        # Assert
        self.assertEqual(set(players), {"Alice", "Charlie"})

if __name__ == "__main__":
    unittest.main()
