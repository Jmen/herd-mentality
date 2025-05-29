import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
from cli import GameCLI
from game import Game

class TestGameCLI(unittest.TestCase):
    def setUp(self):
        self.game = Game("questions.txt")
        self.game.load_questions()
        self.cli = GameCLI(self.game)
    
    @patch('sys.stdout', new_callable=StringIO)
    def test_display_welcome_message(self, mock_stdout):
        # Act
        self.cli.display_welcome_message()
        
        # Assert
        output = mock_stdout.getvalue()
        self.assertIn("Welcome to Programming Herd Mentality!", output)
    
    @patch('builtins.input', side_effect=['Alice', 'Bob', 'Charlie', ''])
    def test_setup_players(self, mock_input):
        # Act
        self.cli.setup_players()
        
        # Assert
        self.assertEqual(len(self.game.players), 3)
        self.assertIn('Alice', self.game.players)
        self.assertIn('Bob', self.game.players)
        self.assertIn('Charlie', self.game.players)
    
    @patch('sys.stdout', new_callable=StringIO)
    def test_display_question(self, mock_stdout):
        # Arrange
        current_question = self.game.get_current_question()
        
        # Act
        self.cli.display_question()
        
        # Assert
        output = mock_stdout.getvalue()
        self.assertIn(current_question.text, output)
    
    @patch('builtins.input', return_value='Python')
    def test_collect_answers(self, mock_input):
        # Arrange
        self.game.add_player('Alice')
        
        # Act
        self.cli.collect_answers()
        
        # Assert
        current_question = self.game.get_current_question()
        self.assertEqual(current_question.answers['Alice'], 'Python')

if __name__ == "__main__":
    unittest.main()
