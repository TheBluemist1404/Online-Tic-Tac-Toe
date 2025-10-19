# 🎮 Odd-Even Tic-Tac-Toe
This assignment demo a lite implementation of Odd-Even Tic-Tac-Toe on a 5x5 board

# Techstack
Frontend runs on default template of Vite Tanstack Router + TailwindCSS and deployed to Vercel at https://online-tic-tac-toe-kappa.vercel.app. Implementing Socket.IO at both ends for smooth state transmission between server-clients.

Backend runs on Express TypeScript, start with nodemon with restart convenience. It is deployed on Render. Here is the repo if you want to check it out: https://github.com/TheBluemist1404/tic-tac-toe-server

# 🚦 Rules
On the 5x5 board, players will click on the cell to increment the value of the cell by 1 (cells are initialized with 0 at the beginning). There is nothing as turn, just click until there is a line that sum up correspond to your role (E.g, if you are Even player, then you will win when there exists a line of non-zeros which sum up to an even number).

# 🎲 Feature
- You can play it with friend when join the same room ID. Odd/Even Role will be determined when you access the room. Each room max capacity is 2, so when you entered the room but then being kicked out immediately dont be to surprised 😃. Also game is playable when there is exactly 2 players in the room and it is not over (means no winner is determined yet).
- You can either join an existing room with provided ID, or create one and share the ID with friends
- If you opponent disconnect from server, the game would be automatically reset and wait for the new opponent (or maybe for your friend to reconnect). If you were the Player 2 (Even), your role would be reassigned as Player 1 (Odd) for the resume.
- When game over, you can click `Replay` to start a new game

# 👨‍🎓 What have I achieved/learnt ?
- My biggest achievement doing this assingment is how to properly handle React states, alongside with the sockets' events.
- It is also my first time building a server (simple enough to work) and deploy it
- Another interesting experience is to integrate Codex into my IDE and work with this AI assistant. Although it makes quite a few mistakes, I see a lot potential of AI Agent with devs work in the future (the UI that Codex generated for me was actually insane )

# 🪜 What to improve ?
The exam is next week so I dont have much time. So there are a lot of things I left undone for the moment
- At the moment rooms are not mananged by the server at all, which means that we can just start a random room that is not actually connected to server.
- Quick start: Let people play with randoms. This would be differentiated with private rooms (which has been implemented already)
- Handle reconnection: Maybe let people reconnect and continue their game
- Add authentication: I believe this is a crucial part for the game experience, as we can track player status, and handle reconnect properly (with token)
- Delay from server: Like you click too fast and instead of game over at `1 1 1 1 1`, is stops at `1 1 1 1 2` where the winner is `Odd`. Still have no clue how to fix this, but hopefully some day I might come up with a solution, since I am not experienced with backend at all.
