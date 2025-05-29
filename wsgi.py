# wsgi.py - Entry point for WSGI servers

from api.index import app

if __name__ == "__main__":
    app.run()
