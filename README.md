# 🏙️ Continuous Schelling Segregation Model

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Algorithm](https://img.shields.io/badge/Algorithm-KD--Tree-green.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

> **A high-performance web simulation bringing Thomas Schelling's classic  
> Segregation Model from discrete grid constraints into continuous  
> 2D space ($\mathbb{R}^2$).**

---

## 📖 Overview

The classic Schelling Segregation Model demonstrates how micro-motives  
can lead to macro-behavior. However, the original discrete grid  
model suffers from severe geometric constraints and *gridlock*  
at high population densities (>85%).

This project completely rebuilds the model in **continuous space**.  
By removing fixed grid cells, agents gain infinite degrees of freedom,  
allowing for organic, isotropic boundary formations.

---

## ✨ Key Algorithmic Innovations

### 1️⃣ Spatial Optimization with KD-Tree

A naive brute-force approach to find neighbors for $N$ agents  
takes **$O(N^2)$** time.

- **Solution:** Integrated a **KD-Tree** spatial partitioning method.
- **Performance:** Reduced complexity to **$O(N \log N)$**.
- **Scale:** Handles **10,000+ agents** at 60 FPS in real-time.

---

### 2️⃣ Oscillation Detection

In discrete models, agents often get trapped in infinite *limit cycles*.

- **Solution:** Implemented a state-history tracking algorithm.
- **Result:** Detects cyclic patterns in "unhappy agent" counts  
  and automatically stabilizes the simulation.

---

## 🚀 Live Demo

Experience the real-time simulation here:

👉 **[Schelling Simulation](https://Schelling-zeta.vercel.app)**

---

## 🛠️ Tech Stack

- **Backend:** Python (FastAPI, NumPy, SciPy)
- **Algorithm:** `scipy.spatial.KDTree`
- **Frontend:** HTML5 Canvas API (high-performance rendering)

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/continuous-schelling.git
cd continuous-schelling
```

### 2️⃣ Install dependencies & run

```bash
pip install -r requirements.txt
python main.py
```

---

## 👨‍💻 Author

**TontonYuta (Hoàng)**  
🎓 3rd-year Math & Informatics Student at HUST  
💡 Passionate about ABM, Algorithms, and Web Development  
