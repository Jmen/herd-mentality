# Simple script to test the Vercel setup locally

import sys
import os

# Add the project root to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the app from the Vercel handler
from api.index import app

if __name__ == '__main__':
    print("Testing Vercel setup locally...")
    print("Open http://127.0.0.1:5001 in your browser")
    app.run(debug=True, port=5001)
