import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, User, Ruler, Weight, Globe, Calendar, RefreshCcw, ArrowRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Button, LoadingSpinner, ProductCard } from '../components/UIComponents';
import { Product } from '../types';

export const TrialRoom: React.FC = () => {
  const { products, formatPrice, t, language, showToast } = useStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');

  const selectedProduct = products.find(p => p.id === productId) || null;

  const [step, setStep] = useState<number>(selectedProduct ? 2 : 1);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    height: '',
    weight: '',
    country: '',
    age: ''
  });
  
  const [generating, setGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserPhoto(url);
    }
  };

  const handleGenerate = () => {
    if (!userPhoto || !formData.height || !formData.weight || !formData.age || !selectedProduct) {
      showToast('Please fill all fields and upload a photo', 'error');
      return;
    }

    setGenerating(true);
    setResultImage(null);
    
    // Simulate very fast AI generation process
    const messages = [
      "Analyzing body proportions...",
      "Mapping physical dimensions...",
      "Applying 3D fabric physics...",
      "Adjusting lighting and shadows...",
      "Finalizing composite..."
    ];
    
    let msgIndex = 0;
    setProgressMsg(messages[0]);
    
    const interval = setInterval(() => {
      msgIndex++;
      if (msgIndex < messages.length) {
        setProgressMsg(messages[msgIndex]);
      } else {
        clearInterval(interval);
        setGenerating(false);
        // We simulate the output using the user's photo with a magical filter overlay styling
        setResultImage(userPhoto);
      }
    }, 600); // 3 seconds total
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-darkBg pt-10 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4"
          >
            <Sparkles size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-white tracking-tight mb-4">
            AI Trial Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            See how it looks on you before buying. Upload your photo and let our fast AI magic do the rest.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel - Product Selection/Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder">
              <h2 className="font-bold text-lg text-primary dark:text-white mb-4 flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                Selected Product
              </h2>
              
              {selectedProduct ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 aspect-[4/5]">
                    <img src={selectedProduct.images[0]} alt="Product" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { navigate('/shop'); }}
                      className="absolute top-2 right-2 bg-white/90 text-primary p-2 flex items-center gap-1 text-xs font-bold rounded-lg shadow"
                    >
                      <RefreshCcw size={14} /> Change
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2">
                      {language === 'bn' ? (selectedProduct.name_bn || selectedProduct.name_en) : selectedProduct.name_en}
                    </h3>
                    <p className="text-primary dark:text-accent font-bold mt-1">{formatPrice(selectedProduct.price)}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-darkBorder rounded-xl">
                  <ShoppingBag size={48} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500 mb-4">No product selected</p>
                  <Button onClick={() => navigate('/shop')} variant="outline" className="w-full">
                    Browse Shop
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right panel - User Input & Generation */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-darkCard p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder relative overflow-hidden">
              
              {/* If step 1 (Needs Product) */}
              {!selectedProduct && (
                <div className="absolute inset-0 z-10 bg-white/50 dark:bg-darkCard/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-white dark:bg-darkCard p-6 rounded-xl shadow-xl border border-gray-200 dark:border-darkBorder text-center max-w-sm">
                    <p className="font-bold text-lg mb-2 dark:text-white">Select a Product First</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">You need to select a product from the shop to try it on.</p>
                    <Button onClick={() => navigate('/shop')} className="w-full">Go to Shop</Button>
                  </div>
                </div>
              )}

              <h2 className="font-bold text-lg text-primary dark:text-white mb-6 flex items-center gap-2">
                <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                Your Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Photo Upload area */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Your Full Body Photo
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center relative overflow-hidden transition-colors ${userPhoto ? 'border-primary/50' : 'border-gray-300 dark:border-darkBorder hover:border-primary'}`}
                  >
                    {userPhoto ? (
                      <>
                        <img src={userPhoto} alt="User" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 mx-auto"
                          >
                            <Camera size={14} /> Retake
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-4" onClick={() => fileInputRef.current?.click()}>
                        <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Click to upload photo</p>
                        <p className="text-xs text-gray-400">Clear, well-lit, front-facing</p>
                        <Button type="button" variant="outline" className="mt-4 px-6 h-8 text-xs rounded-full">Browse</Button>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handlePhotoUpload}
                    />
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Ruler size={14} /> Height (cm/ft)
                    </label>
                    <input 
                      type="text" 
                      value={formData.height}
                      onChange={(e) => setFormData({...formData, height: e.target.value})}
                      placeholder="e.g. 175cm or 5'9" 
                      className="w-full border dark:border-darkBorder bg-gray-50 dark:bg-darkBg dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Weight size={14} /> Weight (kg)
                    </label>
                    <input 
                      type="text" 
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      placeholder="e.g. 70kg" 
                      className="w-full border dark:border-darkBorder bg-gray-50 dark:bg-darkBg dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Calendar size={14} /> Age
                      </label>
                      <input 
                        type="number" 
                        value={formData.age}
                        onChange={(e) => setFormData({...formData, age: e.target.value})}
                        placeholder="e.g. 25" 
                        className="w-full border dark:border-darkBorder bg-gray-50 dark:bg-darkBg dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Globe size={14} /> Country
                      </label>
                      <input 
                        type="text" 
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        placeholder="e.g. BD" 
                        className="w-full border dark:border-darkBorder bg-gray-50 dark:bg-darkBg dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition" 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-500/20 group overflow-hidden relative"
                      disabled={generating}
                    >
                      {generating ? (
                        <div className="flex items-center justify-center gap-3">
                          <Loader2 size={20} className="animate-spin" /> 
                          <span className="text-sm relative z-10">{progressMsg}</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 relative z-10">
                          <Sparkles size={20} className="group-hover:animate-ping" /> Generate Try-On
                        </div>
                      )}
                      {/* Magical glow effect behind button */}
                      <div className="absolute inset-0 block bg-gradient-to-r from-blue-600 via-accent to-blue-600 opacity-0 group-hover:opacity-100 bg-[length:200%_auto] animate-gradient z-0 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-primary opacity-100 group-hover:opacity-0 z-0 transition-opacity duration-300"></div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Result Area */}
            <AnimatePresence>
              {resultImage && selectedProduct && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white dark:bg-darkCard rounded-2xl shadow-xl shadow-accent/5 border-2 border-accent p-6 overflow-hidden relative"
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-extrabold text-2xl bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent dark:text-white flex items-center gap-2">
                      <Sparkles className="text-accent" /> AI Generation Success
                    </h2>
                  </div>

                  <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-xl overflow-hidden bg-gray-900 group">
                    {/* Fake Composite rendering for fast visually pleasing UI */}
                    <img src={resultImage} alt="User Base" className="w-full h-full object-cover filter brightness-90 saturate-110" />
                    <img 
                      src={selectedProduct.images[0]} 
                      alt="Product Overlay" 
                      className="absolute inset-0 w-full h-full object-contain object-bottom opacity-90 drop-shadow-2xl mix-blend-normal"
                      style={{ transform: 'scale(0.85) translateY(10%)' }}
                    />
                    
                    {/* Scanning styling effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/20 to-transparent w-full h-[20%] animate-scan pointer-events-none mix-blend-overlay"></div>
                    
                    <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/20">
                      NUR AI Engine
                    </div>

                    <div className="absolute bottom-4 inset-x-4 flex justify-between">
                      <div className="bg-black/50 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white w-2/3">
                        <p className="text-xs text-gray-300 mb-1">Generated Product:</p>
                        <p className="font-bold text-sm truncate">{selectedProduct.name_en}</p>
                      </div>
                      <Button onClick={() => navigate(`/checkout`)} className="bg-accent text-primary hover:bg-yellow-400 font-bold whitespace-nowrap shadow-xl">
                        Buy Now <ArrowRight size={16} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </div>

      </div>
    </div>
  );
};
