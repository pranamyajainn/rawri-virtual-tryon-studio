import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, ArrowRight, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRODUCTS = [
  {
    id: "1",
    name: "DENIM MELT",
    price: "₹7,200",
    category: "tops",
    garment_description: "heavy washed denim jacket with melt-effect panels, raw edges, and oversized structured silhouette",
    imageUrl: "https://rawri.in/cdn/shop/files/Untitleddesign_9.jpg?v=1754477862&width=1500",
    url: "https://rawri.in/products/denim-melt"
  },
  {
    id: "2",
    name: "MIDNIGHT HUES",
    price: "₹6,660",
    category: "tops",
    garment_description: "dark tonal denim jacket with contrast panel construction and structured collar",
    imageUrl: "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01275.jpg?v=1754476507&width=1500",
    url: "https://rawri.in/products/midnight-hues"
  },
  {
    id: "3",
    name: "DUNGEON BAY",
    price: "₹7,200",
    category: "tops",
    garment_description: "heavy washed dark denim jacket with structured silhouette, raw edges, and oversized fit",
    imageUrl: "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01025.jpg?v=1754477680&width=1500",
    url: "https://rawri.in/products/dungeon-bay"
  },
  {
    id: "4",
    name: "HALTER EGO",
    price: "₹1,800",
    category: "tops",
    garment_description: "denim halter crop top with patchwork panels, hardware buckle details, and lace-up back",
    imageUrl: "https://rawri.in/cdn/shop/files/Untitleddesign_13.jpg?v=1754479052&width=1500",
    url: "https://rawri.in/products/halter-ego"
  },
  {
    id: "5",
    name: "LOOPED IN",
    price: "₹2,700",
    category: "tops",
    garment_description: "denim corset-style crop top with loop hardware detailing, patchwork construction, and structured boning",
    imageUrl: "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01273.jpg?v=1754478667&width=1500",
    url: "https://rawri.in/products/looped-in"
  },
  {
    id: "6",
    name: "FRINGE",
    price: "₹10,800",
    category: "tops",
    garment_description: "dramatic oversized denim jacket entirely covered in long fringe strips cut from raw denim, chaotic layered texture",
    imageUrl: "https://rawri.in/cdn/shop/files/16.jpg?v=1754477373&width=1500",
    url: "https://rawri.in/products/fringe"
  },
  {
    id: "7",
    name: "BASEMENT ISSUE",
    price: "₹7,650",
    category: "tops",
    garment_description: "dark washed oversized denim jacket with heavy distressing, raw hem, and boxy structured silhouette",
    imageUrl: "https://rawri.in/cdn/shop/files/Untitleddesign_11.jpg?v=1754478354&width=1500",
    url: "https://rawri.in/products/basement-issue"
  },
  {
    id: "8",
    name: "FRAYPLAY",
    price: "₹1,800",
    category: "tops",
    garment_description: "denim crop top with heavy fray detailing across the chest and raw cut edges",
    imageUrl: "https://rawri.in/cdn/shop/files/24.jpg?v=1754479555&width=1500",
    url: "https://rawri.in/products/frayplay"
  },
  {
    id: "9",
    name: "BURNING PADDED VEST",
    price: "₹6,300",
    category: "tops",
    garment_description: "structured padded denim vest with quilted panels, raw edges, and boxy oversized fit",
    imageUrl: "https://rawri.in/cdn/shop/files/Untitleddesign_10.jpg?v=1754478175&width=1500",
    url: "https://rawri.in/products/burning-padded-vest"
  }
];

async function fetchImageAsBase64(url: string): Promise<string> {
  const fetchWithTimeout = async (resource: string, timeoutMs: number) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(resource, { signal: controller.signal });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  };

  try {
    const response = await fetchWithTimeout(url, 8000);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Direct fetch failed (likely CORS or timeout), trying proxy...", error);
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetchWithTimeout(proxyUrl, 15000);
    if (!response.ok) throw new Error(`Proxy HTTP error! status: ${response.status}`);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export default function App() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'TOPS & JACKETS'>('ALL');
  const [loadingMessage, setLoadingMessage] = useState<string>("CONSTRUCTING YOUR LOOK...");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 3 && loadingMessage.includes("GENERATING")) {
      setProgress(0);
      setTimeLeft(25);
      const startTime = Date.now();
      const duration = 25000; // Estimate 25 seconds

      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 95); // Cap at 95% until complete
        setProgress(newProgress);
        setTimeLeft(Math.max(Math.ceil((duration - elapsed) / 1000), 1));
      }, 100);
    } else if (step !== 3) {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [step, loadingMessage]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const newPhotos: string[] = [];
      let loadedCount = 0;

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPhotos.push(reader.result as string);
          loadedCount++;
          if (loadedCount === files.length) {
            setUserPhotos((prev) => [...prev, ...newPhotos]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTryOn = async (product: typeof PRODUCTS[0]) => {
    if (userPhotos.length === 0) return;

    setErrorMessage(null);
    setSelectedProduct(product);
    setLoadingMessage("FETCHING GARMENT IMAGES...");
    setStep(3);

    try {
      const garmentBase64Str = await fetchImageAsBase64(product.imageUrl);
      const garmentBase64 = garmentBase64Str.split(',')[1];
      
      console.log("Starting Gemini call", { 
        userImagesCount: userPhotos.length,
        productName: product.name 
      });

      const prompt = `A photorealistic full-body fashion photograph. 
The person in the reference photos is wearing the rawri garment 
shown in the other reference images. 

Preserve this person's exact face, skin tone, dark hair, smile and 
facial features precisely — they must be immediately recognizable.

The garment is a ${product.name}: ${product.garment_description}. 
Show it exactly as it appears in the garment reference images.

Shot on 35mm, ultra sharp, photorealistic.`;

      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const userPhotoParts = [{
        inlineData: {
          data: userPhotos[0].split(',')[1],
          mimeType: userPhotos[0].split(';')[0].split(':')[1],
        }
      }];

      setLoadingMessage("GENERATING AI IMAGE (THIS MAY TAKE A MINUTE)...");

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            ...userPhotoParts,
            { inlineData: { data: garmentBase64, mimeType: 'image/jpeg' } },
            { text: prompt }
          ],
        },
        config: {
          // @ts-ignore
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "2K"
          }
        }
      });

      console.log("Gemini response received", response);
      console.log("Full response content:", JSON.stringify(response.candidates?.[0]?.content));

      let generatedImageUrl = null;
      let textResponse = "";

      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        
        // Check if the response was blocked by safety filters
        if (candidate.finishReason === 'SAFETY') {
          throw new Error("Generation blocked by safety filters. Please try a different photo.");
        }
        
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              generatedImageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
              break;
            } else if (part.text) {
              textResponse += part.text + " ";
            }
          }
        }
      }

      if (generatedImageUrl) {
        setResultImage(generatedImageUrl);
        setStep(4);
      } else {
        throw new Error(textResponse ? `Model replied: "${textResponse.trim()}"` : "Model returned no image and no text.");
      }
    } catch (error: any) {
      console.error("Gemini call failed", error);
      setErrorMessage(`FAILED TO GENERATE IMAGE: ${error?.message || error}`);
      setStep(2); // Reset to allow retry
    }
  };

  const handleUploadClick = () => {
    const hasSeenModal = sessionStorage.getItem('rawri_upload_modal_seen');
    if (hasSeenModal === 'true') {
      fileInputRef.current?.click();
    } else {
      setShowUploadModal(true);
    }
  };

  const handleModalConfirm = () => {
    sessionStorage.setItem('rawri_upload_modal_seen', 'true');
    setShowUploadModal(false);
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-rawri-black text-rawri-white font-sans overflow-hidden relative">
      {/* Upload Modal Overlay */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0D0D0D] border border-white/20 p-6 w-full max-w-[320px] relative"
            >
              <button 
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              
              <h3 className="font-sans font-bold text-white uppercase text-xl mb-4 pr-6">
                BEFORE YOU UPLOAD
              </h3>
              
              <p className="font-mono text-xs text-white/70 leading-relaxed mb-6">
                Clear face. Good lighting. Plain background. No glasses, masks, or obstructions.
                Poor photo = poor result.
              </p>
              
              <button 
                onClick={handleModalConfirm}
                className="w-full bg-[#F0EDE8] text-[#0D0D0D] font-sans font-bold uppercase py-3 transition-opacity hover:opacity-90"
              >
                GOT IT, UPLOAD
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      {step > 0 && (
        <div className="fixed top-0 left-0 right-0 p-6 flex justify-center z-50 pointer-events-none">
          <div className="font-mono text-xs tracking-[0.2em] flex gap-4">
            <span className={step === 1 ? "text-rawri-white" : "text-rawri-white/30"}>01</span>
            <span className="text-rawri-white/30">—</span>
            <span className={step === 2 ? "text-rawri-white" : "text-rawri-white/30"}>02</span>
            <span className="text-rawri-white/30">—</span>
            <span className={step === 3 ? "text-rawri-white" : "text-rawri-white/30"}>03</span>
            <span className="text-rawri-white/30">—</span>
            <span className={step === 4 ? "text-rawri-white" : "text-rawri-white/30"}>04</span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full min-h-screen bg-rawri-black px-4 py-6 md:p-12"
          >
            <div className="w-full flex justify-start mb-16 md:mb-24">
              <h1 className="font-sans font-bold text-rawri-white text-2xl lowercase">rawri</h1>
            </div>

            <div className="flex flex-col items-center text-center mb-16 md:mb-24">
              <h2 className="font-sans font-black text-rawri-white uppercase leading-none mb-6" style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}>
                WEAR IT BEFORE YOU BUY IT
              </h2>
              <p className="font-mono text-xs text-rawri-white/50 tracking-widest uppercase">
                UPLOAD YOUR PHOTO. PICK A PIECE. SEE YOURSELF IN IT.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-0 w-full max-w-7xl mx-auto mb-16 md:mb-24">
              {[
                "https://rawri.in/cdn/shop/files/Untitleddesign_13.jpg?v=1754479052&width=1500", // Halter Ego (Female Front)
                "https://rawri.in/cdn/shop/files/Untitleddesign_11.jpg?v=1754478354&width=1500", // Basement Issue (Male Front)
                "https://rawri.in/cdn/shop/files/16.jpg?v=1754477373&width=1500", // Fringe (Female Front)
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01025.jpg?v=1754477680&width=1500", // Dungeon Bay (Male Front)
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01273.jpg?v=1754478667&width=1500", // Looped In (Female Front)
                "https://rawri.in/cdn/shop/files/Untitleddesign_9.jpg?v=1754477862&width=1500" // Denim Melt (Male Front)
              ].map((src, i) => (
                <div key={i} className="aspect-[3/4] w-full overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Rawri Look ${i + 1}`} 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center w-full max-w-md mx-auto mb-16 md:mb-24">
              <button 
                onClick={() => setStep(1)}
                className="w-full bg-rawri-white text-rawri-black font-sans font-bold uppercase py-4 px-12 hover:bg-rawri-white/90 transition-colors flex items-center justify-center gap-2"
              >
                START TRYING ON <ArrowRight size={20} />
              </button>
            </div>

            <div className="mt-auto w-full flex justify-center pb-6">
              <p className="font-mono text-xs text-rawri-white/30 tracking-widest uppercase text-center">
                RAWRI VIRTUAL STUDIO — POWERED BY AI
              </p>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-start w-full max-w-md mx-auto min-h-[100dvh] pt-[120px] pb-24 px-4 overflow-y-auto"
          >
            <p className="font-mono text-xs tracking-widest text-rawri-orange mb-[16px]">STEP 01</p>
            <h2 className="font-sans font-bold text-rawri-white text-3xl mb-[24px] text-center">UPLOAD YOUR PHOTO</h2>
            
            <p className="font-mono text-xs text-rawri-white/50 text-center mb-[32px] max-w-xs leading-relaxed">
              UPLOAD 1 PHOTO FOR BEST RESULTS. STAND AGAINST A PLAIN WALL. GOOD LIGHTING. FRONT FACING.
            </p>

            <div 
              className="w-full min-h-[400px] border-2 border-dashed border-rawri-white/20 bg-rawri-black flex flex-col items-center justify-center relative cursor-pointer group overflow-hidden"
              onClick={handleUploadClick}
            >
              {userPhotos.length > 0 ? (
                <div className="absolute inset-0 p-1">
                  <img src={userPhotos[0]} alt="Upload" className="w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-rawri-black/80 px-3 py-2 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-rawri-white flex items-center justify-center">
                      <Check size={10} className="text-rawri-black" strokeWidth={3} />
                    </div>
                    <span className="font-mono text-xs text-rawri-white uppercase">PHOTO READY</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-rawri-white/50 group-hover:text-rawri-white transition-colors">
                  <Upload size={32} className="mb-4" />
                  <span className="font-mono text-sm uppercase">TAP TO UPLOAD</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />

            {userPhotos.length > 0 && (
              <div className="w-full flex flex-col items-center mt-6 gap-6">
                <div className="flex gap-4">
                  <button 
                    onClick={handleUploadClick}
                    className="font-mono text-xs text-rawri-white/50 uppercase hover:text-rawri-white transition-colors"
                  >
                    ADD MORE PHOTOS
                  </button>
                  <button 
                    onClick={() => setUserPhotos([])}
                    className="font-mono text-xs text-rawri-white/50 uppercase hover:text-rawri-white transition-colors"
                  >
                    CLEAR ALL
                  </button>
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full bg-rawri-white text-rawri-black font-sans font-bold uppercase py-4 px-6 hover:bg-rawri-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  PICK YOUR PIECE <ArrowRight size={20} />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full h-screen overflow-hidden pt-[120px] pb-0 px-4 md:px-8 max-w-7xl mx-auto relative"
          >
            {userPhotos.length > 0 && (
              <div className="absolute top-[120px] left-6 w-12 h-16 border border-rawri-white/20 overflow-hidden hidden md:block z-40 cursor-pointer" onClick={() => setStep(1)} title="Change Photo">
                <img src={userPhotos[0]} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex flex-col items-center mb-8 shrink-0">
              <p className="font-mono text-xs tracking-widest text-rawri-orange mb-2">STEP 02</p>
              <h2 className="font-sans font-bold text-rawri-white text-3xl mb-6 text-center">PICK YOUR PIECE</h2>
              
              <div className="flex flex-wrap justify-center gap-2">
                {(['ALL', 'TOPS & JACKETS'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`font-mono text-xs uppercase px-4 py-2 transition-colors border ${
                      filter === f 
                        ? 'bg-rawri-white text-rawri-black border-rawri-white' 
                        : 'bg-transparent text-rawri-white border-rawri-white hover:bg-rawri-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-grow overflow-y-auto min-h-0 pb-20 md:pb-8 custom-scrollbar">
              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 mb-6 text-center font-mono text-sm">
                  {errorMessage}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {PRODUCTS.filter(product => {
                  if (filter === 'ALL') return true;
                  if (filter === 'TOPS & JACKETS') return product.category === 'tops';
                  return true;
                }).map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => handleTryOn(product)}
                    className="bg-rawri-black border border-rawri-white/10 flex flex-col group cursor-pointer hover:border-rawri-white hover:bg-rawri-white/5 transition-all duration-300"
                  >
                    <div className="aspect-[3/4] overflow-hidden border-b border-rawri-white/20 relative">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                    <div className="p-6 flex flex-col items-center text-center">
                      <h4 className="font-sans font-bold text-rawri-white uppercase text-xl mb-2">
                        {product.name}
                      </h4>
                      <p className="font-mono text-sm text-rawri-white/80 mb-6">{product.price}</p>
                      
                      <button 
                        className="w-full border border-rawri-white text-rawri-white font-sans font-bold uppercase py-3 px-4 group-hover:bg-rawri-white group-hover:text-rawri-black transition-colors"
                      >
                        TRY IT ON
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[100dvh] pt-[120px] pb-12 px-4 w-full max-w-md mx-auto"
          >
            <h1 className="font-sans font-bold text-rawri-white text-4xl lowercase mb-12">rawri</h1>
            <div className="w-12 h-12 border-2 border-rawri-white/20 border-t-rawri-white rounded-full animate-spin mb-8"></div>
            <h2 className="font-sans italic text-rawri-white text-xl mb-4 text-center">{loadingMessage}</h2>
            
            {loadingMessage.includes("GENERATING") && (
              <div className="w-full mb-8">
                <div className="flex justify-between font-mono text-xs text-rawri-white/50 mb-2">
                  <span>{Math.round(progress)}%</span>
                  <span>~{timeLeft}s REMAINING</span>
                </div>
                <div className="w-full h-1 bg-rawri-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-rawri-white transition-all duration-100 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            <p className="font-mono text-xs text-rawri-orange tracking-widest uppercase text-center mt-4">RAWRI VIRTUAL STUDIO</p>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row w-full relative"
          >
            <div className="w-full md:w-[60%] md:max-h-screen md:overflow-y-auto bg-rawri-black border-b md:border-b-0 md:border-r border-rawri-white/20 custom-scrollbar">
              {resultImage && (
                <img 
                  src={resultImage} 
                  alt="Virtual Try-On Result" 
                  className="w-full h-auto object-contain object-top"
                />
              )}
            </div>
            
            <div className="w-full md:w-[40%] md:h-screen md:sticky md:top-0 flex flex-col justify-center p-6 md:p-12 overflow-y-auto custom-scrollbar">
              <p className="font-mono text-xs tracking-widest text-rawri-orange mb-4">YOUR LOOK</p>
              <h2 className="font-sans font-bold text-3xl md:text-5xl text-rawri-white uppercase mb-4">
                {selectedProduct?.name}
              </h2>
              <p className="font-mono text-xl text-rawri-white/70 mb-12">{selectedProduct?.price}</p>
              
              <div className="flex flex-col gap-4 w-full mt-auto md:mt-0">
                <a 
                  href={selectedProduct?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-rawri-white text-rawri-black font-sans font-bold uppercase py-4 px-6 text-center hover:bg-rawri-white/90 transition-colors"
                >
                  SHOP THIS LOOK
                </a>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full border border-rawri-white text-rawri-white font-sans font-bold uppercase py-4 px-6 text-center hover:bg-rawri-white hover:text-rawri-black transition-colors"
                >
                  TRY ANOTHER PIECE
                </button>
                <button 
                  onClick={() => {
                    setUserPhotos([]);
                    setResultImage(null);
                    setSelectedProduct(null);
                    setStep(0);
                  }}
                  className="mt-4 font-mono text-xs text-rawri-white/50 uppercase hover:text-rawri-white transition-colors text-center"
                >
                  START OVER
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
