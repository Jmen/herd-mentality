# Programming Herd Mentality

A programming-themed version of the popular party game Herd Mentality, where players try to match their answers with the majority of the group.

## Game Rules

1. Players are asked programming-related questions.
2. Each player provides their own answer.
3. Points are awarded to players who give the same answer as the majority.
4. The player with the most points at the end wins!

## Features

- 40 programming-themed questions
- Command-line interface for easy play
- Support for any number of players
- Customizable number of rounds

## Requirements

- Python 3.6 or higher

## How to Play

1. Clone this repository
2. Run the game:

```bash
python cli.py
```

3. Follow the prompts to set up players and play the game

## Customizing Questions

You can add your own programming-themed questions by editing the `questions.txt` file. Each question should be on a new line.

## Development

This project follows Test-Driven Development (TDD) principles. To run the tests:

```bash
python test_game.py
python test_cli.py
```

## Project Structure

- `game.py`: Core game logic
- `cli.py`: Command-line interface
- `questions.txt`: Programming-themed questions
- `test_game.py`: Tests for game logic
- `test_cli.py`: Tests for CLI

## License

MIT
