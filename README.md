# Deep Packet Inspection (DPI) & MERN Dashboard 🚀

Welcome to the **DPI Web Application & Engine** repository! This project combines a high-performance **C++ Deep Packet Inspection (DPI) Engine** with a modern, responsive **MERN Stack Dashboard** to analyze, visualize, and selectively block network traffic.

---

## 🎯 What Does This Do?

- **Real-Time DPI Analytics:** The C++ DPI Core parses offline `.pcap` files, deeply inspects TLS handshakes (uncovering Server Name Indications (SNIs) like `youtube.com`), and enforces traffic rules at the packet layer without expensive network overlays.
- **Node.js Gateway:** The backend intercepts engine outputs and organizes your network security rules (IP bans, Application blocks, Domain blocks) in MongoDB.
- **Vite/React Dashboard:** An aesthetically sleek interface tailored to monitor blocked apps, read capture summaries, and interact with the backend in real-time.

---

## 📂 Architecture

We've organized the repository to decouple the backend APIs, the frontend UI, and the C++ Engine logic. 

```text
/
├── backend/            # Express.js Server & MongoDB Handlers
├── frontend/           # React 19 / Vite / TailwindCSS 4 Dashboard 
├── CORE_ENGINE.md      # Detailed C++ DPI Engine Developer Manual
└── ...                 # Scripts, Configs, and Dependencies
```

> **Curious about how the C++ Packet Analyser tracks 5-tuples and SNIs?** 
> 👉 Read the comprehensive guide in [`CORE_ENGINE.md`](./CORE_ENGINE.md).

---

## 🚀 Quick Start Guide

You will need **Node.js** (v18+) and **MongoDB** (local or Atlas string) installed on your machine.

### 1. Launch the Backend Server
```bash
cd backend
npm install
npm run dev
```
Runs the Express application on **http://localhost:5000** (or customized `.env` `PORT`).

### 2. Launch the Frontend UI
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your web browser to enter the DPI Dashboard.

---

## 🌐 Hosting & Deployment Strategy

To share your dashboard publicly, we recommend separating your environments:

1. **Frontend (Dashboard):** Host for free on **Vercel** or **Cloudflare Pages**. They natively support React + Vite builds.
2. **Backend (API):** Host using a Node.js runtime on **Render** (Free tier), **Heroku**, or inside a Docker container on an **AWS EC2** instance. Ensure CORS is configured properly in `server/app.ts`!
3. **Database:** Use **MongoDB Atlas** for secure, cloud-hosted NoSQL data.

---

## 🔧 Core Tech Stack

- **Dashboard:** React 19, Vite, TailwindCSS (v4), Framer Motion, Recharts.
- **Backend API:** Node.js, Express, TypeScript, Mongoose, Multer (PCAP Uploads).
- **DPI C++ Engine:** Multi-threaded C++17 (Zero-dependencies: manual protocol layer decoding).

Happy Analyzing! 🛡️
