import React, { useState, useRef, useEffect } from 'react';
import { Upload, RotateCw, FlipHorizontal, FlipVertical, Type, Crop, Download, Move, Undo, Redo } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [filters, setFilters] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    sepia: 0,
    hueRotate: 0,
    invert: 0
  });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [texts, setTexts] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(24);
  const [canvasColor, setCanvasColor] = useState('#ffffff');
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [isReduxImage, setIsReduxImage] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const renderRequestRef = useRef(null);
  const location = useLocation();
  const editorImage = useSelector((state) => state.editor.image);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editorImage && editorImage.url) {
      loadImageFromUrl(editorImage.url);
    }
  }, [editorImage]);

  useEffect(() => {
    if (currentImage) {
      renderImage();
    }
  }, [rotation, flipH, flipV, texts, canvasColor, imagePosition, currentImage, canvasWidth, canvasHeight]);

  useEffect(() => {
    if (currentImage) {
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
      renderRequestRef.current = requestAnimationFrame(() => {
        renderImage();
        renderRequestRef.current = null;
      });
    }
    return () => {
      if (renderRequestRef.current) {
        cancelAnimationFrame(renderRequestRef.current);
      }
    };
  }, [filters]);

  const loadImageFromUrl = (url) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; 
    img.onload = () => {
      setImage(img);
      setCurrentImage(img);
      setCanvasWidth(img.width);
      setCanvasHeight(img.height);
      resetFilters();
      setIsReduxImage(true); 
      saveToHistory();
    };
    img.onerror = () => {
      console.error('Failed to load image from URL');
    };
    img.src = url;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          setCurrentImage(img);
          setCanvasWidth(img.width);
          setCanvasHeight(img.height);
          resetFilters();
          setIsReduxImage(false); 
          saveToHistory();
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      invert: 0
    });
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setTexts([]);
    setImagePosition({ x: 0, y: 0 });
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const currentState = {
      imageData: canvas.toDataURL(),
      filters: { ...filters },
      rotation,
      flipH,
      flipV,
      texts: [...texts],
      canvasColor,
      canvasWidth,
      canvasHeight,
      imagePosition: { ...imagePosition }
    };

    const newHistory = history.slice(0, historyIndex + 1);
    
    newHistory.push(currentState);
    
    if (newHistory.length > 4) {
      newHistory.shift();
    } else {
      setHistoryIndex(historyIndex + 1);
    }
    
    setHistory(newHistory);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreState(history[newIndex]);
    }
  };

  const restoreState = (state) => {
    const img = new Image();
    img.onload = () => {
      setCurrentImage(img);
      setFilters(state.filters);
      setRotation(state.rotation);
      setFlipH(state.flipH);
      setFlipV(state.flipV);
      setTexts(state.texts);
      setCanvasColor(state.canvasColor);
      setCanvasWidth(state.canvasWidth);
      setCanvasHeight(state.canvasHeight);
      setImagePosition(state.imagePosition);
    };
    img.src = state.imageData;
  };

  const renderImage = () => {
    if (!currentImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = currentImage;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (canvasColor !== 'transparent') {
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();

    let centerX = canvas.width / 2 + imagePosition.x;
    let centerY = canvas.height / 2 + imagePosition.y;

    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const filterString = `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
    `;
    ctx.filter = filterString;

    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
    ctx.restore();

    texts.forEach(text => {
      ctx.font = `${text.size}px Arial`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.content, text.x, text.y);
    });
  };

  const handleRotate = () => {
    setRotation((rotation + 90) % 360);
    setTimeout(() => saveToHistory(), 100);
  };

  const handleFlipH = () => {
    setFlipH(!flipH);
    setTimeout(() => saveToHistory(), 100);
  };

  const handleFlipV = () => {
    setFlipV(!flipV);
    setTimeout(() => saveToHistory(), 100);
  };

  const toggleCropMode = () => {
    setCropMode(!cropMode);
    setTextMode(false);
    setMoveMode(false);
  };

  const toggleTextMode = () => {
    setTextMode(!textMode);
    setCropMode(false);
    setMoveMode(false);
  };

  const toggleMoveMode = () => {
    setMoveMode(!moveMode);
    setCropMode(false);
    setTextMode(false);
  };

  const handleCanvasClick = (e) => {
    if (textMode && currentText.trim()) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTexts([...texts, { content: currentText, x, y, color: textColor, size: fontSize }]);
      setCurrentText('');
      setTimeout(() => saveToHistory(), 100);
    }
  };

  const handleCanvasMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (moveMode) {
      setIsDragging(true);
      setDragStart({ x: x - imagePosition.x, y: y - imagePosition.y });
    } else if (cropMode) {
      setCropStart({ x, y });
    }
  };

  const handleCanvasMouseMove = (e) => {
    if (moveMode && isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setImagePosition({ x: x - dragStart.x, y: y - dragStart.y });
    } else if (cropMode && cropStart && e.buttons === 1) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCropEnd({ x, y });
    }
  };

  const handleCanvasMouseUp = () => {
    if (moveMode && isDragging) {
      setIsDragging(false);
      setTimeout(() => saveToHistory(), 100);
    } else if (cropMode && cropStart && cropEnd) {
      applyCrop();
    }
  };

  const applyCrop = () => {
    if (!cropStart || !cropEnd) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const x = Math.min(cropStart.x, cropEnd.x);
    const y = Math.min(cropStart.y, cropEnd.y);
    const width = Math.abs(cropEnd.x - cropStart.x);
    const height = Math.abs(cropEnd.y - cropStart.y);

    if (width > 0 && height > 0) {
      const imageData = ctx.getImageData(x, y, width, height);

      const newCanvas = document.createElement('canvas');
      newCanvas.width = width;
      newCanvas.height = height;
      const newCtx = newCanvas.getContext('2d');
      newCtx.putImageData(imageData, 0, 0);

      const croppedImg = new Image();
      croppedImg.onload = () => {
        setCurrentImage(croppedImg);
        setCanvasWidth(width);
        setCanvasHeight(height);
        setCropStart(null);
        setCropEnd(null);
        setCropMode(false);
        setTimeout(() => saveToHistory(), 100);
      };
      croppedImg.src = newCanvas.toDataURL();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    const filename = (editorImage?.title && isReduxImage)
      ? `${editorImage.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
      : 'centrau-edited-image.png';
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  };

  const applyCanvasSize = () => {
    renderImage();
    setTimeout(() => saveToHistory(), 100);
  };

  const resetImagePosition = () => {
    setImagePosition({ x: 0, y: 0 });
    setTimeout(() => saveToHistory(), 100);
  };

  const FilterSlider = ({ label, name, min, max, step = 1, unit = '' }) => {
    return (
      <div className="mb-5">
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-neutral-400">{label}</span>
          <span className="text-white font-medium">{filters[name]}{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={filters[name]}
          onInput={(e) => {
            const value = parseFloat(e.target.value);
            setFilters(prev => ({ ...prev, [name]: value }));
          }}
          onMouseUp={() => setTimeout(() => saveToHistory(), 100)}
          onTouchEnd={() => setTimeout(() => saveToHistory(), 100)}
          className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer slider"
          style={{ WebkitAppearance: 'none' }}
        />
      </div>
    );
  };

  return (
    <>
      <section className="editor-layout flex w-full" style={{ height: 'calc(100vh - 85px)' }}>
        <div className="editor-canvas w-[72%] flex items-center justify-center p-5 overflow-auto">
          <div className="bg-neutral-800 relative rounded-lg overflow-hidden flex items-center justify-center" style={{ boxShadow: '0px 0px 25px rgba(0, 0, 0, 0.5)' }}>
            {!image ? (
              <div className="p-16 text-center text-neutral-600">
                <Upload size={80} className="mx-auto mb-5 opacity-50" />
                <p className="text-lg mb-2">Upload an image to start editing</p>
                {editorImage && (
                  <p className="text-sm text-neutral-500">Or the image from your collection will load automatically</p>
                )}
              </div>
            ) : (
              <div className="relative inline-block">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  className="max-w-full block rounded"
                  style={{
                    maxHeight: '70vh',
                    cursor: moveMode ? (isDragging ? 'grabbing' : 'move') : cropMode ? 'crosshair' : textMode ? 'text' : 'default'
                  }}
                />
                {cropMode && cropStart && cropEnd && (
                  <div
                    className="absolute border-2 border-dashed border-[#ef6c00] pointer-events-none"
                    style={{
                      left: Math.min(cropStart.x, cropEnd.x),
                      top: Math.min(cropStart.y, cropEnd.y),
                      width: Math.abs(cropEnd.x - cropStart.x),
                      height: Math.abs(cropEnd.y - cropStart.y),
                      background: 'rgba(239, 108, 0, 0.1)'
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="editor-controls w-[28%] h-full bg-neutral-800 overflow-y-auto border-l border-[#202020]">
          <div className="w-full p-5">
            {editorImage && isReduxImage && (
              <div className="mb-8 p-4 bg-neutral-900 rounded-lg border border-neutral-700">
                <h3 className="text-sm sm:text-base mb-2 text-neutral-400 uppercase font-medium tracking-wider">Image Info</h3>
                <p className="text-sm text-white mb-1 truncate">{editorImage.title || 'Untitled'}</p>
                {editorImage.photographer && (
                  <p className="text-xs text-neutral-500">by {editorImage.photographer}</p>
                )}
              </div>
            )}

            {image && (
              <div className="mb-8">
                <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">History</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleUndo}
                    disabled={historyIndex <= 0}
                    className={`py-2 sm:py-3 px-4 sm:px-5 ${historyIndex <= 0 ? 'bg-neutral-700 opacity-50 cursor-not-allowed' : 'bg-neutral-700 hover:bg-neutral-600'} border border-neutral-600 text-white rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 duration-200`}
                  >
                    <Undo size={16} />
                    Undo
                  </button>

                  <button
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    className={`py-2 sm:py-3 px-4 sm:px-5 ${historyIndex >= history.length - 1 ? 'bg-neutral-700 opacity-50 cursor-not-allowed' : 'bg-neutral-700 hover:bg-neutral-600'} border border-neutral-600 text-white rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 duration-200`}
                  >
                    <Redo size={16} />
                    Redo
                  </button>
                </div>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Canvas Size</h3>
              <div className="flex gap-2 justify-center items-center text-base sm:text-lg mb-5">
                <input
                  type="number"
                  value={canvasWidth}
                  onChange={(e) => setCanvasWidth(parseInt(e.target.value) || 100)}
                  min="100"
                  max="2000"
                  className="bg-neutral-900 w-24 text-sm sm:text-lg text-center h-10 sm:h-11 text-white rounded-lg border border-neutral-700 focus:border-[#ef6c00] outline-none"
                />
                <span>X</span>
                <input
                  type="number"
                  value={canvasHeight}
                  onChange={(e) => setCanvasHeight(parseInt(e.target.value) || 100)}
                  min="100"
                  max="2000"
                  className="bg-neutral-900 w-24 text-sm sm:text-lg text-center h-10 sm:h-11 text-white rounded-lg border border-neutral-700 focus:border-[#ef6c00] outline-none"
                />
              </div>
              <button
                onClick={applyCanvasSize}
                className="w-full py-2 sm:py-3 px-4 sm:px-5 bg-neutral-700 border border-neutral-600 text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
                Apply Size
              </button>
            </div>

            <div className="mb-8">
              <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Canvas Background</h3>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {[
                  { color: '#ffffff', label: 'White' },
                  { color: '#000000', label: 'Black' },
                  { color: '#f0f0f0', label: 'Light Gray' },
                  { color: '#262626', label: 'Dark Gray' },
                  { color: 'transparent', label: 'Transparent' }
                ].map((preset) => (
                  <div
                    key={preset.color}
                    onClick={() => {
                      setCanvasColor(preset.color);
                      setTimeout(() => saveToHistory(), 100);
                    }}
                    className={`w-full aspect-square rounded-md cursor-pointer duration-200 hover:scale-110 ${canvasColor === preset.color ? 'border-2 border-[#ef6c00]' : 'border-2 border-neutral-700'
                      }`}
                    style={{
                      background: preset.color === 'transparent' ? 'transparent' : preset.color,
                      border: preset.color === 'transparent' ? '2px dashed #666' : canvasColor === preset.color ? '2px solid #ef6c00' : '2px solid #404040',
                      boxShadow: canvasColor === preset.color ? '0 0 10px rgba(239, 108, 0, 0.5)' : 'none'
                    }}
                  />
                ))}
              </div>
              <div className="mt-4">
                <label className="text-xs text-neutral-400 mb-1 block">Custom Color:</label>
                <input
                  type="color"
                  value={canvasColor === 'transparent' ? '#ffffff' : canvasColor}
                  onChange={(e) => {
                    setCanvasColor(e.target.value);
                    setTimeout(() => saveToHistory(), 100);
                  }}
                  className="w-full h-10 cursor-pointer rounded-md border border-neutral-700"
                />
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Upload</h3>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-2 sm:py-3 px-4 sm:px-5 bg-[#ef6c00] border border-[#ef6c00] text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#ff7a1a] duration-200"
              >
                <Upload size={16} />
                {editorImage ? 'Upload Different Image' : 'Upload Image'}
              </button>
            </div>

            {image && (
              <>
                <div className="mb-8">
                  <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Transform</h3>

                  <button
                    onClick={toggleMoveMode}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-5 ${moveMode ? 'bg-[#ef6c00] border-[#ef6c00]' : 'bg-neutral-700 border-neutral-600'} border text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200 mb-2`}
                  >
                    <Move size={16} />
                    Move Image
                  </button>

                  <button
                    onClick={resetImagePosition}
                    className="w-full py-2 px-4 bg-neutral-700 border border-neutral-600 text-white rounded-lg cursor-pointer text-xs mb-2 hover:bg-neutral-600 duration-200"
                  >
                    Reset Position
                  </button>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                    onClick={handleRotate}
                      className="py-2 sm:py-3 px-4 sm:px-5 bg-neutral-700 border border-neutral-600 text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200"
                    >
                      <RotateCw size={16} />
                      Rotate
                    </button>

                    <button
                      onClick={handleFlipH}
                      className={`py-2 sm:py-3 px-4 sm:px-5 ${flipH ? 'bg-[#ef6c00] border-[#ef6c00]' : 'bg-neutral-700 border-neutral-600'} border text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200`}
                    >
                      <FlipHorizontal size={16} />
                      Flip H
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={handleFlipV}
                      className={`py-2 sm:py-3 px-4 sm:px-5 ${flipV ? 'bg-[#ef6c00] border-[#ef6c00]' : 'bg-neutral-700 border-neutral-600'} border text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200`}
                    >
                      <FlipVertical size={16} />
                      Flip V
                    </button>

                    <button
                      onClick={toggleCropMode}
                      className={`py-2 sm:py-3 px-4 sm:px-5 ${cropMode ? 'bg-[#ef6c00] border-[#ef6c00]' : 'bg-neutral-700 border-neutral-600'} border text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200`}
                    >
                      <Crop size={16} />
                      Crop
                    </button>
                  </div>

                  <button
                    onClick={toggleTextMode}
                    className={`w-full py-2 sm:py-3 px-4 sm:px-5 ${textMode ? 'bg-[#ef6c00] border-[#ef6c00]' : 'bg-neutral-700 border-neutral-600'} border text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-neutral-600 duration-200 mb-2`}
                  >
                    <Type size={16} />
                    Add Text
                  </button>

                  {textMode && (
                    <div className="bg-neutral-900 p-4 rounded-lg border border-neutral-700">
                      <input
                        type="text"
                        placeholder="Enter text..."
                        value={currentText}
                        onChange={(e) => setCurrentText(e.target.value)}
                        className="w-full bg-neutral-950 border border-neutral-700 text-white p-2.5 rounded-md mb-2 text-sm outline-none focus:border-[#ef6c00]"
                      />
                      <div className="flex gap-2 mb-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-10 border border-neutral-700 bg-neutral-950 rounded-md cursor-pointer"
                        />
                        <input
                          type="number"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          min="10"
                          max="100"
                          className="flex-1 bg-neutral-950 border border-neutral-700 text-white p-2.5 rounded-md text-sm outline-none focus:border-[#ef6c00]"
                        />
                      </div>
                      <p className="text-xs text-neutral-500">Click on canvas to add text</p>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Filters</h3>
                  <FilterSlider label="Brightness" name="brightness" min={0} max={200} unit="%" />
                  <FilterSlider label="Contrast" name="contrast" min={0} max={200} unit="%" />
                  <FilterSlider label="Saturation" name="saturation" min={0} max={200} unit="%" />
                  <FilterSlider label="Blur" name="blur" min={0} max={10} step={0.1} unit="px" />
                  <FilterSlider label="Grayscale" name="grayscale" min={0} max={100} unit="%" />
                  <FilterSlider label="Sepia" name="sepia" min={0} max={100} unit="%" />
                  <FilterSlider label="Hue Rotate" name="hueRotate" min={0} max={360} unit="°" />
                  <FilterSlider label="Invert" name="invert" min={0} max={100} unit="%" />
                </div>

                <div className="mb-8">
                  <h3 className="text-sm sm:text-base mb-4 text-neutral-400 uppercase font-medium tracking-wider">Export</h3>
                  <button
                    onClick={handleDownload}
                    className="w-full py-2 sm:py-3 px-4 sm:px-5 bg-[#ef6c00] border border-[#ef6c00] text-white rounded-lg cursor-pointer text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-[#ff7a1a] duration-200"
                  >
                    <Download size={16} />
                    Download Image
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ef6c00;
          border-radius: 50%;
          cursor: pointer;
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ef6c00;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        @media screen and (max-width: 1024px) {
          .editor-layout {
            flex-direction: column;
          }
          .editor-canvas {
            width: 100% !important;
            height: 60vh !important;
          }
          .editor-controls {
            width: 100% !important;
            height: 40vh !important;
            border-left: 0;
            border-top: 1px solid #202020;
          }
        }
      `}</style>
    </>
  );
};

export default ImageEditor;
