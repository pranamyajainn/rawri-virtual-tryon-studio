import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Upload, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const PRODUCTS = [
  {
    "id": 1,
    "name": "DENIM MELT",
    "price": "₹ 7,200.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/Untitleddesign_9.jpg?v=1754477862&width=1500",
    "url": "https://rawri.in/products/denim-melt",
    "description": "rawri upper body garment: denim melt"
  },
  {
    "id": 2,
    "name": "MIDNIGHT HUES",
    "price": "₹ 6,660.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01275.jpg?v=1754476507&width=1500",
    "url": "https://rawri.in/products/midnight-hues",
    "description": "rawri upper body garment: midnight hues"
  },
  {
    "id": 3,
    "name": "DUNGEON BAY",
    "price": "₹ 7,200.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01025.jpg?v=1754477680&width=1500",
    "url": "https://rawri.in/products/dungeon-bay",
    "description": "rawri upper body garment: dungeon bay"
  },
  {
    "id": 4,
    "name": "HALTER EGO",
    "price": "₹ 1,800.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/Untitleddesign_13.jpg?v=1754479052&width=1500",
    "url": "https://rawri.in/products/halter-ego",
    "description": "rawri upper body garment: halter ego"
  },
  {
    "id": 5,
    "name": "LOOPED IN",
    "price": "₹ 2,700.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01273.jpg?v=1754478667&width=1500",
    "url": "https://rawri.in/products/looped-in",
    "description": "rawri upper body garment: looped in"
  },
  {
    "id": 6,
    "name": "FRINGE",
    "price": "₹ 10,800.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/16.jpg?v=1754477373&width=1500",
    "url": "https://rawri.in/products/fringe",
    "description": "rawri upper body garment: fringe"
  },
  {
    "id": 7,
    "name": "BASEMENT ISSUE",
    "price": "₹ 7,650.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/Untitleddesign_11.jpg?v=1754478354&width=1500",
    "url": "https://rawri.in/products/basement-issue",
    "description": "rawri upper body garment: basement issue"
  },
  {
    "id": 8,
    "name": "FRAYPLAY",
    "price": "₹ 1,800.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/24.jpg?v=1754479555&width=1500",
    "url": "https://rawri.in/products/frayplay",
    "description": "rawri upper body garment: frayplay"
  },
  {
    "id": 9,
    "name": "BURNING PADDED VEST",
    "price": "₹ 6,300.00",
    "category": "upper_body",
    "img": "https://rawri.in/cdn/shop/files/Untitleddesign_10.jpg?v=1754478175&width=1500",
    "url": "https://rawri.in/products/burning-padded-vest",
    "description": "rawri upper body garment: burning padded vest"
  },
  {
    "id": 10,
    "name": "SEA WAYS",
    "price": "₹ 3,600.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01415.jpg?v=1754465026&width=1500",
    "url": "https://rawri.in/products/sea-ways",
    "description": "rawri lower body garment: sea ways"
  },
  {
    "id": 11,
    "name": "STRIPS AND STRAPS",
    "price": "₹ 8,100.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01246.jpg?v=1754463492&width=1500",
    "url": "https://rawri.in/products/strips-and-straps",
    "description": "rawri lower body garment: strips and straps"
  },
  {
    "id": 12,
    "name": "SHATTERED",
    "price": "₹ 4,500.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01395.jpg?v=1754462420&width=1500",
    "url": "https://rawri.in/products/scattered-way",
    "description": "rawri lower body garment: shattered"
  },
  {
    "id": 13,
    "name": "SLICED OUT",
    "price": "₹ 4,500.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01292.jpg?v=1754464257&width=1500",
    "url": "https://rawri.in/products/sliced-out",
    "description": "rawri lower body garment: sliced out"
  },
  {
    "id": 14,
    "name": "UNCIRCLED",
    "price": "₹ 4,500.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01437.jpg?v=1754463985&width=1500",
    "url": "https://rawri.in/products/uncircled",
    "description": "rawri lower body garment: uncircled"
  },
  {
    "id": 15,
    "name": "THUNDER SKIRT",
    "price": "₹ 2,700.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/27.jpg?v=1754480111&width=1500",
    "url": "https://rawri.in/products/thunder-skirt",
    "description": "rawri lower body garment: thunder skirt"
  },
  {
    "id": 16,
    "name": "PANELLING MY INNER PEACE",
    "price": "₹ 6,300.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01317.jpg?v=1754464722&width=1500",
    "url": "https://rawri.in/products/panelling-my-inner-peace",
    "description": "rawri lower body garment: panelling my inner peace"
  },
  {
    "id": 17,
    "name": "CHAOTIC FUSION",
    "price": "₹ 4,500.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01374.jpg?v=1754462873&width=1500",
    "url": "https://rawri.in/products/chaotic-fusion",
    "description": "rawri lower body garment: chaotic fusion"
  },
  {
    "id": 18,
    "name": "FLANELLED",
    "price": "₹ 5,400.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01079.jpg?v=1754461515&width=1500",
    "url": "https://rawri.in/products/flanelled",
    "description": "rawri lower body garment: flanelled"
  },
  {
    "id": 19,
    "name": "DRIPPING BLOOD",
    "price": "₹ 8,100.00",
    "category": "lower_body",
    "img": "https://rawri.in/cdn/shop/files/15.jpg?v=1754476803&width=1500",
    "url": "https://rawri.in/products/dripping-blood",
    "description": "rawri lower body garment: dripping blood"
  }
];

async function fetchImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("No 2d context");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

export default function App() {
  const [step, setStep] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0] | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'TOPS & JACKETS' | 'BOTTOMS'>('ALL');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async (product: typeof PRODUCTS[0]) => {
    if (!userPhoto) return;

    // Check for API key selection
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
    }

    setSelectedProduct(product);
    setStep(3);

    try {
      try {
        const garmentResponse = await fetch(product.img);
        if (!garmentResponse.ok) throw new Error('Garment fetch failed');
        console.log("Garment image fetched successfully");
      } catch(e) {
        console.error("Garment fetch error", e);
      }

      const productImgBase64 = await fetchImageAsBase64(product.img);
      
      console.log("Starting Gemini call", { 
        userImageSize: userPhoto?.length,
        garmentUrl: product.img,
        productName: product.name 
      });

      const prompt = `You are given two images. The first is a photo of a person. 
The second is a garment from rawri — an Indian streetwear 
and denim brand. Generate a single high-quality image of 
the person wearing exactly that garment. Preserve the 
garment's exact texture, wash, color, distressing, hardware 
details, and silhouette with complete fidelity — do not 
simplify or alter any detail. Maintain the person's exact 
face, skin tone, hair, and body proportions. Background 
should be a clean dark urban environment — concrete wall 
or plain dark backdrop. The overall image should feel 
editorial, raw, and streetwear-ready. 
The garment is specifically: ${product.description}. 
Reproduce this exactly.
Generate a FULL BODY image showing the person 
from head to toe. Do not crop or cut off any part 
of the body or the garment. The complete outfit 
must be visible in the frame. Ensure the entire 
garment from collar to hem is fully shown.`;

      // Create a new GoogleGenAI instance right before making an API call
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: userPhoto.split(',')[1],
                mimeType: userPhoto.split(';')[0].split(':')[1],
              },
            },
            {
              inlineData: {
                data: productImgBase64.split(',')[1],
                mimeType: productImgBase64.split(';')[0].split(':')[1],
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          // responseModalities is not needed/supported for this model and may cause issues
        }
      });

      console.log("Gemini response received", response);
      console.log("Full response content:", JSON.stringify(response.candidates?.[0]?.content));

      let generatedImageUrl = null;
      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/jpeg'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        setResultImage(generatedImageUrl);
        setStep(4);
      } else {
        throw new Error("No image generated by the model.");
      }
    } catch (error: any) {
      console.error("Gemini call failed", error);
      
      if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("PERMISSION_DENIED") || error?.message?.includes("The caller does not have permission")) {
        alert("API Key error. Please select a valid API key with billing enabled.");
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
        }
      } else {
        alert("FAILED TO GENERATE IMAGE. PLEASE TRY AGAIN.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-rawri-black text-rawri-white font-sans overflow-hidden relative">
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
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01364_27345cbb-efa0-4378-be9d-a68f4da15117.jpg?v=1754479051&width=1500",
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01220.jpg?v=1754478393&width=1500",
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01206.jpg?v=1754477404&width=1500",
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01025.jpg?v=1754477680&width=1500",
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01268.jpg?v=1754478667&width=1500",
                "https://rawri.in/cdn/shop/files/PhotosbyAbhisoriginals-01243.jpg?v=1754477862&width=1500"
              ].map((src, i) => (
                <div key={i} className="aspect-[3/4] w-full overflow-hidden">
                  <img 
                    src={src} 
                    alt={`Rawri Look ${i + 1}`} 
                    className="w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-all duration-300"
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
            className="flex flex-col items-center justify-center w-full max-w-md mx-auto min-h-screen py-24 px-4"
          >
            <p className="font-mono text-xs tracking-widest text-rawri-orange mb-4">STEP 01</p>
            <h2 className="font-sans font-bold text-rawri-white text-3xl mb-2 text-center">UPLOAD YOUR PHOTO</h2>
            <p className="font-mono text-xs text-rawri-white/50 text-center mb-8 max-w-xs leading-relaxed">
              STAND AGAINST A PLAIN WALL. GOOD LIGHTING. FRONT FACING.
            </p>

            <div 
              className="w-full min-h-[400px] border-2 border-dashed border-rawri-white/20 bg-rawri-black flex flex-col items-center justify-center relative cursor-pointer group overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              {userPhoto ? (
                <>
                  <img src={userPhoto} alt="Upload" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute bottom-4 left-4 bg-rawri-black/80 px-3 py-2 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-rawri-white flex items-center justify-center">
                      <Check size={10} className="text-rawri-black" strokeWidth={3} />
                    </div>
                    <span className="font-mono text-xs text-rawri-white uppercase">PHOTO READY</span>
                  </div>
                </>
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

            {userPhoto && (
              <div className="w-full flex flex-col items-center mt-6 gap-6">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono text-xs text-rawri-white/50 uppercase hover:text-rawri-white transition-colors"
                >
                  CHANGE PHOTO
                </button>
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
            className="flex flex-col w-full h-screen overflow-hidden pt-20 pb-0 px-4 md:px-8 max-w-7xl mx-auto relative"
          >
            {userPhoto && (
              <div className="absolute top-6 left-6 w-12 h-16 border border-rawri-white/20 overflow-hidden hidden md:block z-40 cursor-pointer" onClick={() => setStep(1)} title="Change Photo">
                <img src={userPhoto} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex flex-col items-center mb-8 shrink-0">
              <p className="font-mono text-xs tracking-widest text-rawri-orange mb-2">STEP 02</p>
              <h2 className="font-sans font-bold text-rawri-white text-3xl mb-6 text-center">PICK YOUR PIECE</h2>
              
              <div className="flex flex-wrap justify-center gap-2">
                {(['ALL', 'TOPS & JACKETS', 'BOTTOMS'] as const).map((f) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {PRODUCTS.filter(product => {
                  if (filter === 'ALL') return true;
                  if (filter === 'TOPS & JACKETS') return product.category === 'upper_body';
                  if (filter === 'BOTTOMS') return product.category === 'lower_body';
                  return true;
                }).map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => handleTryOn(product)}
                    className="bg-rawri-black border border-rawri-white/10 flex flex-col group cursor-pointer hover:border-rawri-white hover:bg-rawri-white/5 transition-all duration-300"
                  >
                    <div className="aspect-[3/4] overflow-hidden border-b border-rawri-white/20 relative">
                      <img 
                        src={product.img} 
                        alt={product.name}
                        crossOrigin="anonymous"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
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
            className="flex flex-col items-center justify-center min-h-screen p-4"
          >
            <h1 className="font-sans font-bold text-rawri-white text-4xl lowercase mb-12">rawri</h1>
            <div className="w-12 h-12 border-2 border-rawri-white/20 border-t-rawri-white rounded-full animate-spin mb-8"></div>
            <h2 className="font-sans italic text-rawri-white text-2xl mb-4 text-center">CONSTRUCTING YOUR LOOK...</h2>
            <p className="font-mono text-xs text-rawri-orange tracking-widest uppercase text-center">RAWRI VIRTUAL STUDIO</p>
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
                    setUserPhoto(null);
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
