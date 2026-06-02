import { useState, useRef, useMemo, useCallback } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import DraggableElement from '../components/DraggableElement';
import { compressImage } from '../utils/imageCompression';
import { Upload, Type, RotateCw, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// T-shirt mockup URLs for all colors
const TSHIRT_MOCKUPS = {
  white: {
    front: 'https://via.placeholder.com/600x700/FFFFFF/CCCCCC?text=White+Front',
    back: 'https://via.placeholder.com/600x700/FFFFFF/CCCCCC?text=White+Back',
  },
  black: {
    front: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/jxsocm1f_black-front.png',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/kd6axr3b_black-back.png',
  },
  green: {
    front: 'https://via.placeholder.com/600x700/22C55E/FFFFFF?text=Green+Front',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/g6j2ihxi_green-back.png',
  },
  blue: {
    front: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/2d3ttvin_blue-front.png',
    back: 'https://customer-assets.emergentagent.com/job_zuro-premium/artifacts/xk880w9l_blue-back.png',
  },
  red: {
    front: 'https://via.placeholder.com/600x700/EF4444/FFFFFF?text=Red+Front',
    back: 'https://via.placeholder.com/600x700/EF4444/FFFFFF?text=Red+Back',
  },
  yellow: {
    front: 'https://via.placeholder.com/600x700/FACC15/333333?text=Yellow+Front',
    back: 'https://via.placeholder.com/600x700/FACC15/333333?text=Yellow+Back',
  },
  lavender: {
    front: 'https://via.placeholder.com/600x700/C4B5FD/FFFFFF?text=Lavender+Front',
    back: 'https://via.placeholder.com/600x700/C4B5FD/FFFFFF?text=Lavender+Back',
  },
  orange: {
    front: 'https://via.placeholder.com/600x700/FB923C/FFFFFF?text=Orange+Front',
    back: 'https://via.placeholder.com/600x700/FB923C/FFFFFF?text=Orange+Back',
  },
};

const COLORS = [
  { name: 'White', value: 'white', hex: '#FFFFFF' },
  { name: 'Black', value: 'black', hex: '#000000' },
  { name: 'Green', value: 'green', hex: '#22C55E' },
  { name: 'Blue', value: 'blue', hex: '#3B82F6' },
  { name: 'Red', value: 'red', hex: '#EF4444' },
  { name: 'Yellow', value: 'yellow', hex: '#FACC15' },
  { name: 'Lavender', value: 'lavender', hex: '#C4B5FD' },
  { name: 'Orange', value: 'orange', hex: '#FB923C' },
];

const CustomBuilderContent = () => {
  const [tshirtColor, setTshirtColor] = useState('black');
  const [side, setSide] = useState('front');
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Stable callback for position changes
  const handlePositionChange = useCallback((id, position) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x: position.x, y: position.y } : el))
    );
  }, []);

  // Stable callback for element selection
  const handleElementSelect = useCallback((id) => {
    setSelectedElement(id);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploading(true);
    try {
      // Compress image client-side for better performance
      const compressed = await compressImage(file, 1200, 0.85).catch(() => file);

      const formData = new FormData();
      formData.append('file', compressed);

      const { data } = await axios.post(`${API}/storage/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      const newElement = {
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'image',
        src: `${BACKEND_URL}${data.url}`,
        x: 0,
        y: 0,
        width: 150,
        height: 150,
        rotation: 0,
        side,
      };

      // Preload the image before adding to canvas to ensure it renders correctly
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setElements((prev) => [...prev, newElement]);
        setSelectedElement(newElement.id);
        toast.success('Image added!');
      };
      img.onerror = () => {
        toast.error('Image failed to load');
      };
      img.src = newElement.src;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
      // Reset input so same file can be uploaded again
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const addText = () => {
    const newElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      content: 'Your Text Here',
      x: 0,
      y: 0,
      fontSize: 24,
      color: '#FFFFFF',
      rotation: 0,
      side,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateElement = (id, updates) => {
    setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)));
  };

  const deleteElement = (id) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedElement === id) setSelectedElement(null);
  };

  const rotateElement = (id) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, rotation: ((el.rotation || 0) + 45) % 360 } : el))
    );
  };

  const resizeElement = (id, delta) => {
    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;
        if (el.type === 'image') {
          const newWidth = Math.max(40, Math.min(400, (el.width || 150) + delta));
          const newHeight = Math.max(40, Math.min(400, (el.height || 150) + delta));
          return { ...el, width: newWidth, height: newHeight };
        }
        if (el.type === 'text') {
          const newSize = Math.max(12, Math.min(96, (el.fontSize || 24) + delta / 4));
          return { ...el, fontSize: newSize };
        }
        return el;
      })
    );
  };

  const calculatePrice = () => {
    const basePrice = 499;
    const printPrice = elements.filter((el) => el.side === 'front').length > 0 ? 200 : 0;
    const backPrintPrice = elements.filter((el) => el.side === 'back').length > 0 ? 150 : 0;
    return basePrice + printPrice + backPrintPrice;
  };

  // Memoize visible elements to prevent unnecessary rerenders
  const visibleElements = useMemo(
    () => elements.filter((el) => el.side === side),
    [elements, side]
  );

  const selectedEl = elements.find((el) => el.id === selectedElement);

  return (
    <div className="min-h-screen bg-[#050505]">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl tracking-tight uppercase font-bold text-white mb-8">
            CUSTOM T-SHIRT BUILDER
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Canvas Area */}
            <div className="lg:col-span-2">
              <div
                className="bg-[#111111] border border-white/10 p-8 aspect-square flex items-center justify-center relative overflow-hidden"
                onClick={(e) => {
                  // Deselect when clicking outside elements
                  if (e.target === e.currentTarget) {
                    setSelectedElement(null);
                  }
                }}
              >
                <img
                  src={TSHIRT_MOCKUPS[tshirtColor][side]}
                  alt={`${tshirtColor} ${side}`}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                  draggable={false}
                />

                {/* Design area overlay */}
                <div className="relative w-[60%] h-[70%] border-2 border-dashed border-white/20">
                  {visibleElements.map((element) => (
                    <DraggableElement
                      key={element.id}
                      element={element}
                      isSelected={selectedElement === element.id}
                      onSelect={handleElementSelect}
                      onPositionChange={handlePositionChange}
                      bounds="parent"
                    />
                  ))}
                </div>

                {/* Loading overlay */}
                {uploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-3" />
                      <p className="text-white text-sm uppercase tracking-widest">Uploading...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Side Toggle */}
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setSide('front')}
                  data-testid="builder-side-front"
                  className={`flex-1 px-6 py-3 border ${
                    side === 'front'
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-transparent text-white hover:border-white/50'
                  } transition-colors uppercase text-sm font-bold`}
                >
                  FRONT
                </button>
                <button
                  onClick={() => setSide('back')}
                  data-testid="builder-side-back"
                  className={`flex-1 px-6 py-3 border ${
                    side === 'back'
                      ? 'border-white bg-white text-black'
                      : 'border-white/20 bg-transparent text-white hover:border-white/50'
                  } transition-colors uppercase text-sm font-bold`}
                >
                  BACK
                </button>
              </div>
            </div>

            {/* Controls Panel */}
            <div className="space-y-6">
              {/* Color Selection */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">T-SHIRT COLOR</h2>
                <div className="grid grid-cols-4 gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setTshirtColor(color.value)}
                      data-testid={`builder-color-${color.value}`}
                      className={`w-full aspect-square border-2 ${
                        tshirtColor === color.value ? 'border-white' : 'border-transparent'
                      } hover:border-white/50 transition-colors relative`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {tshirtColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Elements */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">ADD ELEMENTS</h2>
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    data-testid="builder-upload-image-button"
                    className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        UPLOADING...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        UPLOAD IMAGE
                      </>
                    )}
                  </button>
                  <button
                    onClick={addText}
                    disabled={uploading}
                    data-testid="builder-add-text-button"
                    className="w-full px-4 py-3 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors uppercase text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Type className="w-4 h-4" />
                    ADD TEXT
                  </button>
                </div>
              </div>

              {/* Element Controls */}
              {selectedEl && (
                <div className="bg-[#111111] border border-white/10 p-6">
                  <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">EDIT ELEMENT</h2>
                  <div className="space-y-3">
                    {selectedEl.type === 'text' && (
                      <>
                        <input
                          type="text"
                          value={selectedEl.content}
                          onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                          placeholder="Enter text"
                          className="w-full bg-[#1A1A1A] border border-white/10 rounded-none px-4 py-2 text-white focus:border-white focus:outline-none"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          {['#FFFFFF', '#000000', '#E60000'].map((c) => (
                            <button
                              key={c}
                              onClick={() => updateElement(selectedEl.id, { color: c })}
                              className={`aspect-square border-2 ${
                                selectedEl.color === c ? 'border-white' : 'border-white/20'
                              }`}
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => resizeElement(selectedEl.id, -20)}
                        data-testid="builder-resize-smaller"
                        className="px-3 py-2 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors text-xs uppercase font-bold"
                      >
                        SMALLER
                      </button>
                      <button
                        onClick={() => resizeElement(selectedEl.id, 20)}
                        data-testid="builder-resize-larger"
                        className="px-3 py-2 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors text-xs uppercase font-bold"
                      >
                        LARGER
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => rotateElement(selectedEl.id)}
                        data-testid="builder-rotate-button"
                        className="flex-1 px-4 py-2 border border-white/20 bg-transparent text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <RotateCw className="w-4 h-4" />
                        ROTATE
                      </button>
                      <button
                        onClick={() => deleteElement(selectedEl.id)}
                        data-testid="builder-delete-button"
                        className="flex-1 px-4 py-2 border border-[#E60000]/50 bg-transparent text-[#E60000] hover:bg-[#E60000]/10 transition-colors flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Details */}
              <div className="bg-[#111111] border border-white/10 p-6">
                <h2 className="text-xs uppercase tracking-[0.2em] text-white font-bold mb-4">PRICE DETAILS</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">Base Price</span>
                    <span className="text-white">₹499</span>
                  </div>
                  {elements.filter((el) => el.side === 'front').length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Front Print</span>
                      <span className="text-white">₹200</span>
                    </div>
                  )}
                  {elements.filter((el) => el.side === 'back').length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Back Print</span>
                      <span className="text-white">₹150</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-lg">₹{calculatePrice()}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-full bg-white text-black rounded-none hover:bg-gray-200 transition-colors uppercase tracking-widest font-bold text-sm px-8 py-4"
                onClick={() => toast.success('Custom design saved!')}
              >
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const CustomBuilderPage = () => {
  return (
    <ErrorBoundary>
      <CustomBuilderContent />
    </ErrorBoundary>
  );
};

export default CustomBuilderPage;
