# 📊 Database Republic

### Tracking stock and ETF changes on Trade Republic, so you don't have to.

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)

A live, automated dashboard that monitors the official Trade Republic instrument list, providing a clear view of all securities that are added or removed from the platform.


![Screenshot_2025-09-24_161619](https://github.com/user-attachments/assets/364fc0e7-1a6e-4608-969c-91905e10c7b2)


---

## 🚀 About The Project

Staying updated with the ever-changing universe of tradable stocks on platforms like Trade Republic can be challenging. This project automates the process by regularly checking the official instrument list and presenting the changes in a clean, user-friendly interface.

Key features include:
* **Automated Tracking:** A script runs every 6 hours to check for updates.
* **Clear Visualization:** Separate, scrollable columns for added and removed stocks.
* **Community Insight:** Integrated Reddit posts from relevant financial communities.
* **Modern Tech Stack:** Built with the latest in web and automation technologies.

---

## 🛠️ How It Works

This project uses a serverless, automated architecture to function without manual intervention.

1.  A **GitHub Action** is scheduled to run a **Python script** every 6 hours.
2.  The Python script downloads and parses the latest official **Trade Republic PDF document**.
3.  It compares the new list against a master CSV stored in the repository, identifying any new or missing stocks.
4.  If changes are found, it updates `added.json` and `removed.json` data files and commits them back to the repository.
5.  A **Cloudflare Worker** acts as a secure API proxy. It uses a secret token to fetch the JSON data from the **private GitHub repository**.
6.  The **Next.js & Tailwind CSS frontend** calls the Cloudflare Worker API to get the data and displays it to the user.

---

## 💻 Tech Stack

* **Frontend:** Next.js, React, TypeScript, Tailwind CSS
* **Backend & Automation:** Python, Cloudflare Workers, GitHub Actions
* **Hosting:** Cloudflare Pages

---

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or later)
* [Python](https://www.python.org/downloads/) (v3.8 or later)
* `npm` (comes with Node.js)

### Installation & Setup

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/nadelritter/database-republic.git](https://github.com/nadelritter/database-republic.git)
    cd database-republic
    ```
2.  **Install frontend dependencies**
    ```sh
    npm install
    ```
3.  **Install backend dependencies**
    ```sh
    pip install -r scripts/requirements.txt
    ```
4.  **Run the development server**
    ```sh
    npm run dev
    ```
5.  Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🌐 Deployment

This site is automatically deployed via **Cloudflare Pages**. A new deployment is triggered on every push to the `master` branch. The live data is provided by a **Cloudflare Worker** that securely accesses this repository's data files.
