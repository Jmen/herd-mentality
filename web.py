from flask import Flask, render_template, request, redirect, url_for, session, flash
from game import Game, Question
import os
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

class GameSession:
    def __init__(self):
        self.game = None
        self.current_round = 0
        self.total_rounds = 0
        self.results = None
    
    def setup_game(self, player_names, num_rounds):
        self.game = Game("questions.txt")
        self.game.load_questions()
        
        for player in player_names:
            if player.strip():
                self.game.add_player(player.strip())
        
        self.current_round = 1
        self.total_rounds = num_rounds
    
    def submit_answers(self, answers):
        for player, answer in answers.items():
            if player in self.game.players and answer.strip():
                self.game.submit_answer(player, answer.strip())
        
        current_question = self.game.get_current_question()
        most_common = current_question.get_most_common_answer()
        winners = self.game.score_current_question()
        
        self.results = {
            'question': current_question.text,
            'most_common': most_common,
            'winners': winners,
            'all_answers': current_question.answers,
            'scores': self.game.get_scores()
        }
    
    def next_round(self):
        self.game.next_question()
        self.current_round += 1
        self.results = None
    
    def is_game_over(self):
        return self.current_round > self.total_rounds
    
    def get_final_results(self):
        scores = self.game.get_scores()
        winner_score = max(scores.values()) if scores else 0
        winners = [player for player, score in scores.items() if score == winner_score]
        
        return {
            'scores': scores,
            'winners': winners,
            'winner_score': winner_score
        }

# Create a global game session
game_session = GameSession()

@app.route('/')
def home():
    # Reset the game session
    global game_session
    game_session = GameSession()
    return render_template('index.html')

@app.route('/setup', methods=['POST'])
def setup():
    player_names = request.form.get('player_names', '').split('\n')
    num_rounds = int(request.form.get('num_rounds', 3))
    
    game_session.setup_game(player_names, num_rounds)
    
    return redirect(url_for('play'))

@app.route('/play')
def play():
    if game_session.game is None:
        flash('Please set up the game first!')
        return redirect(url_for('home'))
    
    if game_session.is_game_over():
        return redirect(url_for('game_over'))
    
    question = game_session.game.get_current_question()
    return render_template('play.html', 
                           question=question.text, 
                           players=sorted(game_session.game.players),
                           current_round=game_session.current_round,
                           total_rounds=game_session.total_rounds)

@app.route('/submit_answers', methods=['POST'])
def submit_answers():
    if game_session.game is None:
        flash('Please set up the game first!')
        return redirect(url_for('home'))
    
    answers = {player: request.form.get(player, '') 
               for player in game_session.game.players}
    
    game_session.submit_answers(answers)
    
    return redirect(url_for('results'))

@app.route('/results')
def results():
    if game_session.game is None or game_session.results is None:
        flash('Please set up the game first!')
        return redirect(url_for('home'))
    
    return render_template('results.html', 
                           results=game_session.results,
                           current_round=game_session.current_round,
                           total_rounds=game_session.total_rounds,
                           is_last_round=game_session.current_round >= game_session.total_rounds)

@app.route('/next_round')
def next_round():
    if game_session.game is None:
        flash('Please set up the game first!')
        return redirect(url_for('home'))
    
    game_session.next_round()
    
    if game_session.is_game_over():
        return redirect(url_for('game_over'))
    
    return redirect(url_for('play'))

@app.route('/game_over')
def game_over():
    if game_session.game is None:
        flash('Please set up the game first!')
        return redirect(url_for('home'))
    
    final_results = game_session.get_final_results()
    
    return render_template('game_over.html', results=final_results)

if __name__ == '__main__':
    app.run(debug=True)
