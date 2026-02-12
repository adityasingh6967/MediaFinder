# MediaFinder 🎨🔎

MediaFinder is a React-based web application that allows users to search for images using external media APIs and edit them directly in a built-in canvas editor.

The project combines API integration with a custom-built image editor powered by the HTML5 Canvas API — built without external editing libraries.

---

## 🚀 Features

### 🔎 Media Search
- Search images using external APIs (e.g., Pexels / Unsplash)
- Fetch high-quality images dynamically
- Select an image and send it directly to the editor

### 🖼️ Canvas Image Editor (Built with HTML5 Canvas)
- Rotate image (90° increments)
- Flip horizontally / vertically
- Drag & reposition image
- Crop selected area
- Adjust canvas size
- Change canvas background color (including transparent)
- Add custom text with:
  - Adjustable font size
  - Custom text color
- Apply filters:
  - Brightness
  - Contrast
  - Saturation
  - Blur
  - Grayscale
  - Sepia
  - Hue Rotate
  - Invert
- Undo / Redo history (state-based)
- Export edited image as PNG

---

## 🛠 Tech Stack

- React (Vite)
- HTML5 Canvas API (no external editing libraries)
- Redux (for image state management)
- React Router
- Tailwind CSS
- Lucide Icons
- External Image APIs (Pexels / Unsplash)

---

## 🧠 Architecture Highlights

- Custom rendering pipeline using `canvas.getContext("2d")`
- Transformation handling with:
  - `translate()`
  - `rotate()`
  - `scale()`
- Dynamic filter generation using `ctx.filter`
- Cropping implemented using `getImageData()` and offscreen canvas
- Performance optimization using `requestAnimationFrame`
- State history stack for Undo/Redo functionality

---

## 📦 Installation

```bash
git clone https://github.com/YOUR_USERNAME/MediaFinder.git
cd MediaFinder
npm install
npm run dev
