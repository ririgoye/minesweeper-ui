# Minesweeper-UI for API challenge

There is an api implementation of the classic game of [Minesweeper](https://en.wikipedia.org/wiki/Minesweeper_(video_game))
This project is the user interface for that project

# Platform considerations
I wanted to create a user interface that could be use in most platforms. I thought a web application wold be ideal for that and Node.js/React.js are one of the best options right now
The project will be hosted in heroku next to the API.

# Running locally
To run locally you will need to create an .env file in the root of the project and add following line:
REACT_APP_API_HOST=http://localhost:8080

To deploy it you will have to include that environment variable in the hosting. 

# Deployment
Deployment will be done connecting heroku to the github repository, and configuring the credentials and other parameters using environment variables.
CI/CD: The host is connected to the git repository, any commit to master branch would be deployed.

# Design
The initial requirement is to create an API client, since this is a game, a user interface was the optimal client
There is no processing on the client side. All game information and actions are performer on the API side.

This project would only get the data from the API and present it in a "graphical" way.

The game and API are user based. Meaning the user will need to Login before playing a game. Basic user / password information would be requested before starting a game.

# Board considerations
The concept is as simple as possible. The purpose of this project is to create a minimalistic api client. Because of that (and for licensing issues) the user interface contains no images, only text.

## Buttons meaning

### Game display
    - + = Create new game
    - << = Restart game
    - N = Pause game
    - > = Resume game

### Game board
    - . = unselected cell
    - F = flag
    - X = explosion
    - Blank = empty cell
    - 0-8 = number of bombs arround that cell
