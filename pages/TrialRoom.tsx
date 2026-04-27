import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { useSearchParams, Link } from 'react-router-dom';
import { Card, Button } from '../components/UIComponents';
import { Upload, Sparkles, Image as ImageIcon, ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Shirt } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const TrialRoom: React.FC = () => {
  const { products, language, formatPrice } = useStore();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');
  
  const initialProduct = products.find(p => p.id === productId) || products[0];
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  
  const [userImage, setUserImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!userImage || !selectedProduct) return;
    
    setIsProcessing(true);
    setProgress(0);
    setResultImage(null);
    setStatusText('Analyzing body proportions...');
    
    // Simulate AI processing steps
    let currentStep = 0;
    const steps = [
      'Scanning subject...',
      'Analyzing body proportions...',
      'Mapping garment to 3D model...',
      'Adjusting lighting and shadows...',
      'Rendering final output...'
    ];

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        if (next % 20 === 0 && currentStep < steps.length - 1) {
          currentStep++;
          setStatusText(steps[currentStep]);
        }
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 60);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setIsProcessing(false);
      // Mock result by returning the product image, as a real VTON API is required for actual image generation
      setResultImage(selectedProduct?.images[0] || null); 
    }, 3500);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-10">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4"
        >
          <Sparkles size={28} />
        </motion.div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 dark:text-white tracking-tight">
          AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Virtual Try-On</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Experience our garments instantly. Upload a front-facing photo and let our advanced AI map the clothing directly to your body.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Selection */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
            <Shirt size={20} /> Select Item
          </h3>
          <div className="h-[600px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
            {products.filter(p => !p.isWholesale).map(product => (
              <div 
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border-2 ${selectedProduct?.id === product.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-white dark:bg-darkCard hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'}`}
              >
                <img src={product.images[0]} alt={product.name_en} className="w-20 h-24 object-cover rounded-lg" />
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold dark:text-white line-clamp-2">{language === 'bn' ? (product.name_bn || product.name_en) : product.name_en}</h4>
                  <p className="text-sm text-gray-500 font-medium mt-1">{formatPrice(product.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right Column: Workspace */}
        <div className="lg:col-span-9 bg-white dark:bg-darkCard rounded-3xl shadow-xl border border-gray-100 dark:border-darkBorder overflow-hidden flex flex-col md:flex-row">
          
          {/* User Photo Input */}
          <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-100 dark:border-darkBorder flex flex-col items-center justify-center min-h-[400px] relative">
            <h3 className="text-lg font-semibold mb-6 absolute top-6 left-6 dark:text-white">Your Photo</h3>
            
            {userImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img src={userImage} alt="User" className="max-w-full max-h-[400px] object-contain rounded-lg shadow-md" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-darkBg/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  Change Photo
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-sm aspect-[3/4] border-3 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-all">
                  <Upload size={28} className="text-gray-400 group-hover:text-blue-500" />
                </div>
                <p className="font-semibold text-gray-700 dark:text-gray-300">Upload a Photo</p>
                <p className="text-sm text-gray-500 text-center mt-2 px-6">For best results, use a well-lit, front-facing photo against a plain background.</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>

          {/* AI Result */}
          <div className="flex-1 p-8 bg-gray-50 dark:bg-darkBg flex flex-col items-center justify-center min-h-[400px] relative">
            <h3 className="text-lg font-semibold mb-6 absolute top-6 left-6 dark:text-white text-center w-full md:w-auto md:text-left">Result</h3>
            
            {!userImage ? (
              <div className="text-center opacity-50 flex flex-col items-center">
                <ImageIcon size={48} className="text-gray-400 mb-4" />
                <p className="text-gray-500">Upload a photo to see the magic</p>
              </div>
            ) : isProcessing ? (
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="relative w-32 h-32 mb-8">
                  <svg className="animate-spin w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200 dark:text-gray-700 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                    <circle className="text-blue-500 stroke-current" strokeWidth="8" strokeLinecap="round" cx="50" cy="50" r="40" fill="transparent" strokeDasharray="250" strokeDashoffset={250 - (250 * progress) / 100}></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
                  </div>
                </div>
                <h4 className="font-bold text-lg dark:text-white mb-2">{statusText}</h4>
                <p className="text-sm text-gray-500 text-center">Using deep learning to wrap fabrics dynamically.</p>
              </div>
            ) : resultImage ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full h-full flex flex-col items-center justify-center"
              >
                {/* Simulated blend: User image underneath, product over top */}
                <div className="relative group max-w-full max-h-[400px] rounded-lg shadow-xl overflow-hidden bg-white dark:bg-darkCard">
                   <img src={userImage} alt="Background" className="w-auto h-[400px] object-cover" />
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 0.9 }}
                     transition={{ duration: 1 }}
                     className="absolute inset-0 flex items-center justify-center mix-blend-multiply dark:mix-blend-normal"
                   >
                     <img src={resultImage} alt="Product Overlay" className="w-auto h-[400px] object-cover" />
                   </motion.div>
                </div>
                
                <div className="mt-8 flex gap-4">
                  <Button onClick={() => setResultImage(null)} variant="outline" className="gap-2">
                     <RefreshCw size={16} /> Retake
                  </Button>
                  <Link to={`/product/${selectedProduct?.id}`}>
                    <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                      Buy This Look <ArrowRight size={16} />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center h-full">
                <Button 
                  onClick={handleGenerate} 
                  className="py-4 px-8 text-lg rounded-full shadow-xl shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 transition-transform hover:scale-105"
                >
                  <Sparkles size={20} className="mr-2" /> Generate Try-On
                </Button>
                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-lg">
                   <AlertCircle size={16} className="text-blue-500" />
                   <span>Generates instantly. Private and secure.</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
