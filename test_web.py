import unittest
from unittest.mock import patch, MagicMock
import web
from web import app, GameSession
from game import Game, Question

class TestWebApp(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        self.client = app.test_client()
        # Reset the global game session for each test
        web.game_session = GameSession()
        
    def test_home_page(self):
        # Act
        response = self.client.get('/')
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Programming Herd Mentality', response.data)
    
    def test_setup_game(self):
        # Arrange
        player_names = ['Alice', 'Bob', 'Charlie']
        num_rounds = 3
        
        # Act
        response = self.client.post('/setup', data={
            'player_names': '\n'.join(player_names),
            'num_rounds': num_rounds
        }, follow_redirects=True)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Round 1', response.data)
        self.assertEqual(len(web.game_session.game.players), 3)
        
    def test_submit_answers(self):
        # Arrange
        web.game_session.setup_game(['Alice', 'Bob'], 2)
        
        # Act
        response = self.client.post('/submit_answers', data={
            'Alice': 'Python',
            'Bob': 'JavaScript'
        }, follow_redirects=True)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Results', response.data)
        
    def test_next_round(self):
        # Arrange
        web.game_session.setup_game(['Alice', 'Bob'], 2)
        web.game_session.submit_answers({'Alice': 'Python', 'Bob': 'JavaScript'})
        
        # Act
        response = self.client.get('/next_round', follow_redirects=True)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Round 2', response.data)
        
    def test_game_over(self):
        # Arrange
        web.game_session.setup_game(['Alice', 'Bob'], 1)
        web.game_session.submit_answers({'Alice': 'Python', 'Bob': 'JavaScript'})
        web.game_session.next_round()
        
        # Act
        response = self.client.get('/next_round', follow_redirects=True)
        
        # Assert
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Final Results', response.data)

if __name__ == '__main__':
    unittest.main()
