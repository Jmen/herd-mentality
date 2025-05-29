import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Add the api directory to the path so we can import the handler
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'api')))

class TestVercelDeployment(unittest.TestCase):
    def setUp(self):
        self.app = None
        
    def test_api_handler_exists(self):
        # Test that the handler function exists in the API module
        try:
            from api.index import handler
            self.assertTrue(callable(handler))
        except ImportError:
            self.fail("Failed to import handler from api.index")
    
    def test_vercel_json_exists(self):
        # Test that vercel.json exists and has the correct structure
        import json
        try:
            with open('vercel.json', 'r') as f:
                config = json.load(f)
                
            self.assertIn('version', config)
            self.assertIn('builds', config)
            self.assertIn('routes', config)
            
            # Check that the builds section points to the correct file
            builds = config['builds']
            self.assertTrue(any(build.get('src') == 'api/index.py' for build in builds))
            
            # Check that routes are configured correctly
            routes = config['routes']
            self.assertTrue(any(route.get('dest') == 'api/index.py' for route in routes))
            
        except FileNotFoundError:
            self.fail("vercel.json file not found")
        except json.JSONDecodeError:
            self.fail("vercel.json is not valid JSON")
    
    def test_questions_data_access(self):
        # Test that questions can be accessed in a serverless environment
        from api.data import get_questions
        questions = get_questions()
        self.assertGreater(len(questions), 0)
        self.assertTrue(all(isinstance(q, str) for q in questions))

if __name__ == '__main__':
    unittest.main()
