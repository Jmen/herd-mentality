from flask import Flask, Response
from api.index import app

def handler(request, response):
    """
    Simple handler for Vercel serverless functions
    """
    return app
