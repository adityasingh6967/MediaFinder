# 🎨 Image Discovery & Editor App (Pinterest-like)

A full-featured **Pinterest-style image discovery platform** built with **React + Redux**, integrated with multiple image APIs and a **Canva-like image editor**. This is my **first large-scale project**, focused on real-world features, clean state management, and hands-on frontend architecture.

---

## 🚀 Features

### 🔍 Image Discovery

* Search images from:

  * **Unsplash API**
  * **Pexels API**
  * **Tenor API (GIFs)**
* Fast search with Redux-managed state
* Unified results from multiple APIs

⚠️ **Note:** Infinite scrolling is **not implemented yet**. Results are currently loaded per search/page and rendered on scroll without auto-fetching more data.

---

### 📌 Collections & Favorites

* Save images to favorites
* Organize images into collections
* Redux-powered global state

---

### 🖼️ Built-in Image Editor (Canva-like)

The editor supports **two different image sources**:

* Images clicked from APIs (Unsplash / Pexels / Tenor)
* **Images uploaded directly from your PC**

#### Editor Tools:

* Crop
* Rotate / Flip
* Image filters
* Resize canvas
* Undo / Redo
* Non-destructive editing

Clicking **Edit** on any image opens the editor with the image pre-loaded, or users can start editing by uploading a local image.

---

## 🧠 Tech Stack

* **React**
* **Redux / Redux Toolkit**
* **HTML Canvas**
* **CSS / Tailwind (if used)**
* **Unsplash API**
* **Pexels API**
* **Tenor API**

---

## 📦 Project Structure (High Level)

```
/src
 ├─ components
 ├─ pages
 ├─ redux
 │   ├─ slices
 │   └─ store.js
 ├─ editor
 │   ├─ canvas
 │   ├─ tools
 │   └─ history
 └─ utils
```

---

## 🎯 Learning Goals & Outcomes

* Managing complex global state with Redux
* Working with multiple third-party APIs
* Building a custom image editor using HTML Canvas
* Implementing undo/redo logic
* Structuring a scalable React project

---

## 🚧 Limitations / Future Improvements

* Infinite scrolling for image search
* User authentication
* Cloud saving for edited images
* Performance optimizations for large images
* Mobile & touch gesture support

---

## 🧑‍💻 Author

**Ethan**

This project represents my first major step into building complex frontend applications with real-world features.

---

⭐ If you like this project, feel free to star the repo and share feedback!
