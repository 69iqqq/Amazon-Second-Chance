# Amazon Second Chance ♻️

**An AI-powered circular commerce ecosystem that transforms product returns, unused inventory, and customer-owned products into valuable second-life opportunities.**

![Amazon Second Chance Banner](https://images.unsplash.com/photo-1611288875783-c2428587d6e4?auto=format&fit=crop&q=80&w=2000&h=600)

### 🌍 Live Demo
**[Visit Amazon Second Chance](https://web-seven-drab-37.vercel.app/)**

---

## 📖 The Vision

Instead of products ending their lifecycle after a return, Amazon Second Chance uses artificial intelligence to determine the optimal next action: **Resell, Refurbish, Donate, Recycle, or Exchange.** 

Our goal is to dramatically reduce reverse logistics costs, minimize environmental waste, and create customer trust in a seamless, "second-life" circular economy.

---

## ⚡ Core Features

1. **AI Disposition Engine:** Automatically determines the optimal next destination for products using an optimized routing algorithm.
2. **Smart Quality Grading:** Uses Google Gemini Multimodal AI to evaluate product condition, assess damage, and output confidence scores purely from user-uploaded images and videos.
3. **Certified Refurbished Marketplace:** Customers can purchase quality-assured refurbished products with transparent inspection reports.
4. **Peer-to-Peer Resale:** Empower customers to resell owned products directly within the ecosystem.
5. **Predictive Return Prevention:** Uses machine learning models to identify high-risk returns before checkout and suggest better alternatives.
6. **Green Credits Economy:** Incentivizes sustainable choices by rewarding users with "Green Credits" for donations, recycling, and purchasing refurbished goods.

---

## 🛠️ Tech Architecture & Stack

Our platform is built on an enterprise-grade, **Event-Driven Modular Monolith**, meticulously designed for global scalability (1000x growth), leveraging a Serverless "Backend-as-a-Service" (BaaS) approach.

### The Stack

* **Frontend:** [Next.js](https://nextjs.org/) + [React 19](https://react.dev/) + [TailwindCSS](https://tailwindcss.com/)
* **Backend:** [NestJS](https://nestjs.com/) (Stateless, DDD & Clean Architecture)
* **Database:** [Neon Serverless PostgreSQL](https://neon.tech/) + [Prisma ORM](https://www.prisma.io/)
* **Authentication:** [Clerk](https://clerk.com/) (Edge-based Identity & RBAC)
* **Media Processing:** [Cloudinary](https://cloudinary.com/)
* **AI Intelligence:** [Google Gemini API](https://deepmind.google/technologies/gemini/)
* **Hosting:** [Vercel](https://vercel.com/) (Global Edge Network)

### Why This Stack?
* **Zero DevOps Overhead:** By using serverless database (Neon) and edge rendering (Vercel), we achieve instant global scalability.
* **Separation of Concerns:** Heavy media payloads are offloaded directly to Cloudinary, completely bypassing and protecting our API. Auth is entirely managed at the edge by Clerk.
* **Deep Interconnectedness:** We utilize Webhooks and event-driven patterns to trigger asynchronous AI grading, preventing blocking operations and keeping the UI blazing fast.

---

## 🚀 Getting Started Locally

### Prerequisites
* Node.js (v20+)
* npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/amahawk.git
   cd amahawk
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Duplicate `.env.example` to `.env` and fill in your keys (Clerk, Neon, Cloudinary, Gemini).

4. **Initialize the Database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

5. **Run the Development Servers:**
   The project is structured as a monorepo containing both the `web` and `api`.
   ```bash
   # Run frontend and backend concurrently
   npm run dev
   ```

6. **Open the App:**
   Visit `http://localhost:3000` to view the frontend.

---

## 🧠 Key Algorithms

* **AI Disposition Decision Engine:** `O(R + D log D)` algorithm evaluating routing constraints and historical demand to pinpoint the optimal next step for a return.
* **Smart Computer Vision Grading:** `O(P)` algorithm utilizing deep Convolutional Neural Networks (via Gemini) to grade products from raw pixels in < 5 seconds.
* **Predictive Risk Assessment:** `O(F)` inference model running before checkout to dynamically score return probabilities based on user and metadata features.

---
*Built with ❤️ for a sustainable future.*
