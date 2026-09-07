# 🌍 Antipode Chat

A real-time web application that anonymously connects you with someone located on the exact opposite side of the Earth (your geographic antipode).

🌐 **Live Demo:** [https://antipode-chat.onrender.com](https://antipode-chat.onrender.com)

## ✨ Features

- **Precision Antipode Calculation:** Uses browser GPS geolocation to mathematically calculate the diametrically opposite point on the globe.
- **Automatic Country Detection:** Analyzes the IP address server-side to display the corresponding national flag.
- **Interactive 3D Globe:** An animated background 3D sphere powered by *Three.js* featuring a modern *glassmorphism* design.
- **Automatic Multilingual Support:** Dynamically adapts interface text to French or English based on the user's browser language.
- **Robust Chat Management:** Session tracking via unique connection IDs (`socket.id`) to prevent conflicts with duplicate usernames, complete with real-time partner disconnection notifications.

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, Socket.io
- **Geolocation:** `geoip-lite`
- **Frontend:** HTML5, CSS3 (Modern UI), Three.js (3D Animation)
- **Deployment:** Render

## 🚀 Local Installation & Setup

1. Clone the repository to your machine:
   ```bash
   git clone [https://github.com/your-username/antipode-chat.git](https://github.com/your-username/antipode-chat.git)
   cd antipode-chat
-----------------------------------------------------------------------
1. Install dependencies:
   npm install
2. Start the server:
npm start
3. Open your browser and navigate to: http://localhost:3000
------------------------------------------------------------------------
📦 Deployment
The project is configured for easy deployment on Render (Free Tier):

Start Command: node server.js

The server automatically handles proxy headers (trust proxy) for accurate IP detection.

Created with passion to connect the whole world.

-----------------------------------------------------------------------

   _____                              __               __            .__                         .___     
  /  _  \     _____________  ____    |__| ____   _____/  |_     _____|__| ____   ____   ____   __| _/  /\ 
 /  /_\  \    \____ \_  __ \/  _ \   |  |/ __ \_/ ___\   __\   /  ___/  |/ ___\ /    \_/ __ \ / __ |   \/ 
/    |    \   |  |_> >  | \(  <_> )  |  \  ___/\  \___|  |     \___ \|  / /_/  >   |  \  ___// /_/ |   /\ 
\____|__  /   |   __/|__|   \____/\__|  |\___  >\___  >__|    /____  >__\___  /|___|  /\___  >____ |   \/ 
        \/    |__|               \______|    \/     \/             \/  /_____/      \/     \/     \/    
 ____              __      _____ 
/_   | __________ |  | ___/ ____\
 |   |/  ___/  _ \|  |/ /\   __\ 
 |   |\___ (  <_> )    <  |  |   
 |___/____  >____/|__|_ \ |__|   
          \/           \/    
