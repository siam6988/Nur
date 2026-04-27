import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { BlogPost, BlogComment } from '../types';
import { Mail, Phone, MapPin, DollarSign, Users, Gift, ShieldCheck, Target, Truck, Clock, Map, Lock, FileText, AlertCircle, ShoppingBag, Star, Heart, ArrowRight, Loader2, UserPlus, Link as LinkIcon, ArrowLeft, ThumbsUp, MessageSquare, Send } from 'lucide-react';
import { Button, BlogCardSkeleton } from '../components/UIComponents';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useSEO } from '../hooks/useSEO';
import { useStore } from '../context/StoreContext';

export const About: React.FC = () => {
  useSEO({ 
    title: 'আমাদের গল্প (About Us)', 
    description: 'NUR - বাংলাদেশের একটি প্রিমিয়াম লাইফস্টাইল ই-কমার্স প্ল্যাটফর্ম। আমাদের লক্ষ্য এবং গল্প জানুন। Premium retail and wholesale clothing.' 
  });

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold mb-6 text-primary dark:text-white"
          >
            আমাদের সম্পর্কে
          </motion.h1>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            NUR বাংলাদেশের অন্যতম দ্রুত বর্ধনশীল প্রিমিয়াম ই-কমার্স প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো দেশের প্রতিটি প্রান্তে বিশ্বমানের স্মার্ট শপিং অভিজ্ঞতা পৌঁছে দেওয়া।
          </p>
        </div>

        <div className="bg-white dark:bg-darkCard rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-darkBorder">
          <div className="md:flex">
            <div className="md:w-1/2 bg-primary p-10 text-white flex flex-col justify-center">
              <ShieldCheck size={48} className="text-accent mb-6" />
              <h2 className="text-3xl font-bold mb-4">আমাদের প্রতিজ্ঞা</h2>
              <p className="text-primary-foreground/80 leading-relaxed text-lg">
                আমরা বিশ্বাস করি সততা, বিশ্বস্ততা এবং গুণগত মানে। ২০২৪ সালে প্রতিষ্ঠিত NUR শুরু থেকেই গ্রাহকদের আস্থা অর্জন করে আসছে। সস্তায় নয়, আপনার হাতে সেরা জিনিসটি তোলাই আমাদের ব্রত।
              </p>
            </div>
            <div className="md:w-1/2 p-10 bg-gray-50 dark:bg-darkBg flex flex-col justify-center">
               <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-primary dark:text-accent">
                     <Target size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg dark:text-white mb-1">সঠিক পণ্য, সঠিক সময়ে</h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">ডেলিভারির ক্ষেত্রে আমরা কখনোই আপোষ করি না। আমাদের নিজস্ব ডেলিভারি নেটওয়ার্ক আছে।</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-primary dark:text-accent">
                     <Heart size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg dark:text-white mb-1">গ্রাহক সন্তুষ্টি</h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">আমাদের ২৪/৭ এআই চ্যাটবট এবং ডেডিকেটেড সাপোর্ট টিম সব সময় আপনার সেবায় নিয়োজিত।</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full text-primary dark:text-accent">
                     <Star size={24} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg dark:text-white mb-1">অরিজিনাল প্রোডাক্ট</h3>
                     <p className="text-gray-600 dark:text-gray-400 text-sm">আমরা শতভাগ জেনুইন এবং অথেনটিক ব্র্যান্ডের প্রোডাক্ট সরবারহ করে থাকি।</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[
            { number: "১০০%", text: "অথেনটিক প্রোডাক্ট", icon: <ShieldCheck /> },
            { number: "৫০০০+", text: "হ্যাপি কাস্টমার", icon: <Users /> },
            { number: "৬৪", text: "জেলায় ডেলিভারি", icon: <Map /> },
            { number: "২৪/৭", text: "সাপোর্ট", icon: <Clock /> }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="text-center p-6 bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder group"
            >
              <div className="text-gray-300 dark:text-gray-600 flex justify-center mb-3 group-hover:text-accent transition-colors group-hover:scale-110 transform">
                {stat.icon}
              </div>
              <h3 className="font-black text-2xl text-primary dark:text-white mb-1">{stat.number}</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{stat.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export const Contact: React.FC = () => {
  useSEO({ 
    title: 'যোগাযোগ (Contact Us)', 
    description: 'NUR এর সাথে যোগাযোগ করুন। আমাদের কাস্টমার সাপোর্ট টিম সবসময় আপনার পাশে আছে। ইমেইল, ফোন এবং ঠিকানার বিস্তারিত। Contact the NUR support team.' 
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-darkCard p-8 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder">
          <h1 className="text-2xl font-bold mb-6 dark:text-white">যোগাযোগ করুন</h1>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">আপনার নাম</label>
              <input type="text" className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ইমেইল</label>
              <input type="email" className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">মেসেজ</label>
              <textarea rows={4} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 focus:ring-primary focus:border-primary"></textarea>
            </div>
            <button className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-800 transition">পাঠিয়ে দিন</button>
          </form>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder">
             <div className="flex items-start gap-4">
               <div className="bg-blue-50 dark:bg-white/10 p-3 rounded-full text-primary dark:text-white"><MapPin /></div>
               <div>
                 <h3 className="font-bold text-lg dark:text-white">অফিস ঠিকানা</h3>
                 <p className="text-gray-600 dark:text-gray-300">Hocker's Market, Bondor Bazar,<br/>Sylhet, Bangladesh</p>
               </div>
             </div>
          </div>
          <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder">
             <div className="flex items-start gap-4">
               <div className="bg-blue-50 dark:bg-white/10 p-3 rounded-full text-primary dark:text-white"><Phone /></div>
               <div>
                 <h3 className="font-bold text-lg dark:text-white">হটলাইন</h3>
                 <p className="text-gray-600 dark:text-gray-300 font-bold">+880 1736118083</p>
                 <p className="text-xs text-gray-400">সকাল ১০টা - রাত ১০টা</p>
               </div>
             </div>
          </div>
          <div className="bg-white dark:bg-darkCard p-6 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder">
             <div className="flex items-start gap-4">
               <div className="bg-blue-50 dark:bg-white/10 p-3 rounded-full text-primary dark:text-white"><Mail /></div>
               <div>
                 <h3 className="font-bold text-lg dark:text-white">ইমেইল</h3>
                 <p className="text-gray-600 dark:text-gray-300">support@nur.com.bd</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Policy: React.FC = () => {
  useSEO({ 
    title: 'আমাদের পলিসি (Privacy & Refund)', 
    description: 'NUR এর প্রাইভেসি পলিসি, রিফান্ড পলিসি এবং রিটার্ন নিয়মাবলী সম্পর্কে বিস্তারিত জানুন। Privacy standards and reliable return policies.' 
  });

  const [activeTab, setActiveTab] = useState<'privacy' | 'refund'>('privacy');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto bg-white dark:bg-darkCard rounded-xl shadow-sm border border-gray-100 dark:border-darkBorder overflow-hidden">
        {/* Tabs */}
        <div className="flex flex-col md:flex-row border-b border-gray-100 dark:border-darkBorder">
           <button
             className={`flex-1 py-4 md:py-6 text-sm md:text-base font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === 'privacy' ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-darkBg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
             onClick={() => setActiveTab('privacy')}
           >
             <Lock size={18} /> Privacy Policy
           </button>
           <button
             className={`flex-1 py-4 md:py-6 text-sm md:text-base font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${activeTab === 'refund' ? 'bg-primary text-white' : 'bg-gray-50 dark:bg-darkBg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
             onClick={() => setActiveTab('refund')}
           >
             <FileText size={18} /> Refund & Return Policy
           </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-10 text-gray-700 dark:text-gray-300 leading-relaxed">
           <AnimatePresence mode="wait">
             {activeTab === 'privacy' ? (
               <motion.div 
                 key="privacy"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
                 className="space-y-8"
               >
                 <section>
                   <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
                   <p className="text-sm text-gray-500 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                   <p>
                     Welcome to NUR ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>nur.com.bd</strong> and use our services.
                   </p>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. Information We Collect</h3>
                   <div className="pl-4 border-l-2 border-primary/20 space-y-3">
                     <p><strong>Personal Information:</strong> We collect personally identifiable information, such as your name, shipping address, email address, and telephone number, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</p>
                     <p><strong>Payment Information:</strong> Financial information is processed by our third-party payment processor, SSLCOMMERZ. We do not store full credit card numbers or sensitive banking credentials on our servers.</p>
                     <p><strong>Device & Usage Data:</strong> We may automatically collect information such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the Site.</p>
                   </div>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. How We Use Information</h3>
                   <ul className="list-disc pl-5 space-y-2">
                     <li>Processing and delivering your orders.</li>
                     <li>Managing your account and loyalty points system.</li>
                     <li>Communicating with you regarding order updates and support.</li>
                     <li>Fraud monitoring and prevention.</li>
                     <li>Improving our website functionality and user experience.</li>
                   </ul>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. Payment Security & Data Protection</h3>
                   <p className="mb-2">We use administrative, technical, and physical security measures to help protect your personal information. All online transactions are secured using SSL encryption technology.</p>
                   <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website (e.g., Firebase, SSLCOMMERZ), so long as those parties agree to keep this information confidential.</p>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">4. Cookies Policy</h3>
                   <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
                 </section>

                 <section className="bg-red-50 dark:bg-red-900/10 p-5 rounded-lg border border-red-100 dark:border-red-900/30">
                   <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                     <AlertCircle size={20} /> Limitation of Liability
                   </h3>
                   <p className="text-red-900 dark:text-red-300 italic text-sm font-medium">
                     “NUR shall not be responsible for any indirect, incidental, consequential, or financial losses arising from the use of the platform, payment gateway interruptions, delivery delays, third-party service failures, or user negligence.”
                   </p>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. User Rights & Account Termination</h3>
                   <p className="mb-2">You have the right to request access to the personal information we hold about you. You may also request corrections or deletion of your data.</p>
                   <p>We reserve the right to terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                 </section>

                 <section>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">6. Contact Information</h3>
                   <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
                   <p className="font-bold mt-2">Email: support@nur.com.bd</p>
                   <p className="font-bold">Address: Hocker's Market, Bondor Bazar, Sylhet</p>
                 </section>
               </motion.div>
             ) : (
               <motion.div 
                 key="refund"
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 transition={{ duration: 0.3 }}
                 className="space-y-8"
               >
               <section>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Refund & Return Policy</h2>
                 <p>
                   At NUR, we strive to ensure your complete satisfaction with every purchase. If you are not entirely satisfied with your purchase, we're here to help.
                 </p>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">1. Eligibility for Return</h3>
                 <ul className="list-disc pl-5 space-y-2">
                   <li><strong>Time Limit:</strong> You have <strong>3 to 7 calendar days</strong> to return an item from the date you received it.</li>
                   <li><strong>Condition:</strong> To be eligible for a return, your item must be unused and in the same condition that you received it.</li>
                   <li><strong>Packaging:</strong> Your item must be in the original packaging.</li>
                   <li><strong>Proof of Purchase:</strong> Your item must have the receipt or proof of purchase (Invoice).</li>
                 </ul>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">2. Non-Returnable Items</h3>
                 <p>Certain items are non-returnable, including but not limited to:</p>
                 <ul className="list-disc pl-5 space-y-1 mt-2">
                   <li>Perishable goods (e.g., food, flowers).</li>
                   <li>Intimate or sanitary goods.</li>
                   <li>Custom-made or personalized products.</li>
                   <li>Gift cards and downloadable software products.</li>
                 </ul>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">3. Refund Process</h3>
                 <p className="mb-2">Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item.</p>
                 <p className="mb-2">If your return is approved, we will initiate a refund to your original method of payment (or via Bkash/Nogod for COD orders).</p>
                 <p><strong>Refund Timeline:</strong> You will receive the credit within <strong>7-10 working days</strong>, depending on your card issuer's policies.</p>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">4. Shipping Charges</h3>
                 <p>You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.</p>
                 <p>If you receive a refund, the cost of return shipping will be deducted from your refund. However, if the return is due to our error (e.g., wrong or damaged product), we will bear the shipping cost.</p>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">5. Damaged or Wrong Product</h3>
                 <p>If you receive a damaged or incorrect product, please notify us immediately (within 24 hours of delivery). We will arrange for a replacement or a full refund including shipping charges.</p>
               </section>

               <section className="bg-red-50 dark:bg-red-900/10 p-5 rounded-lg border border-red-100 dark:border-red-900/30">
                 <h3 className="text-lg font-bold text-red-800 dark:text-red-400 mb-3 flex items-center gap-2">
                   <AlertCircle size={20} /> Financial Liability & Force Majeure
                 </h3>
                 <p className="text-red-900 dark:text-red-300 italic text-sm font-medium mb-3">
                   “NUR shall not be liable for any financial loss, banking charges, payment gateway delays, or indirect damages arising from transactions made through third-party payment providers.”
                 </p>
                 <p className="text-gray-600 dark:text-gray-400 text-xs">
                   <strong>Force Majeure:</strong> NUR shall not be liable for any delay or failure in performance caused by circumstances beyond its reasonable control, including but not limited to acts of God, war, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
                 </p>
               </section>

               <section>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">6. Contact Us</h3>
                 <p>If you have any questions on how to return your item to us, contact us at:</p>
                 <p className="font-bold mt-2">Hotline: +880 1736118083</p>
                 <p className="font-bold">Email: support@nur.com.bd</p>
               </section>
             </motion.div>
           )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicy: React.FC = () => {
  useSEO({ 
    title: 'ডেলিভারি পলিসি (Shipping Policy)', 
    description: 'NUR ই-কমার্স থেকে কীভাবে আপনার প্রোডাক্ট দ্রুত এবং নিরাপদে ডেলিভারি পাবেন, তার বিস্তারিত নিয়মকানুন। Our standard delivery times and charges.' 
  });

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white dark:bg-darkCard p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-darkBorder text-gray-700 dark:text-gray-300"
      >
        <h1 className="text-3xl font-bold mb-8 text-primary dark:text-white flex items-center gap-3 border-b dark:border-darkBorder pb-4">
          <Truck className="text-accent" size={32} /> শিপিং পলিসি (Shipping)
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed">
            <motion.section 
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-gray-50 dark:bg-darkBg p-6 rounded-xl border border-gray-100 dark:border-darkBorder hover:shadow-md transition-shadow"
            >
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Map size={24} className="text-primary dark:text-accent" /> ১. ডেলিভারি এলাকা
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-400">আমরা সমগ্র বাংলাদেশে হোম ডেলিভারি সুবিধা প্রদান করে থাকি। সুন্দরবন কুরিয়ার, এস.এ পরিবহন, এবং পাঠাও কুরিয়ারের মাধ্যমে আমরা পণ্য পাঠিয়ে থাকি। দেশের যেকোনো প্রান্তে আমরা পণ্য পৌঁছে দিতে বদ্ধপরিকর।</p>
            </motion.section>

            <motion.section 
               initial={{ opacity: 0, x: 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-gray-50 dark:bg-darkBg p-6 rounded-xl border border-gray-100 dark:border-darkBorder hover:shadow-md transition-shadow"
            >
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                   <Clock size={24} className="text-primary dark:text-accent" /> ২. ডেলিভারি সময়সীমা
                </h3>
                <ul className="space-y-3 text-base">
                    <li className="flex justify-between items-center border-b border-gray-200 dark:border-darkBorder pb-3">
                      <span className="text-gray-600 dark:text-gray-400">সিলেট শহরের ভিতরে</span>
                      <span className="font-bold text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 px-3 py-1 rounded-full">১-২ কর্মদিবস</span>
                    </li>
                    <li className="flex justify-between items-center pt-2 pb-1">
                      <span className="text-gray-600 dark:text-gray-400">সিলেটের বাইরে (সারাদেশে)</span>
                      <span className="font-bold text-primary dark:text-accent bg-primary/10 dark:bg-accent/10 px-3 py-1 rounded-full">৩-৫ কর্মদিবস</span>
                    </li>
                </ul>
                <p className="mt-4 text-xs text-gray-400 italic">নোট: প্রাকৃতিক দুর্যোগ, রাজনৈতিক অস্থিরতা বা অনিবার্য কারণে ডেলিভারি সময় কিছুটা পরিবর্তন হতে পারে।</p>
            </motion.section>

             <motion.section 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="bg-gray-50 dark:bg-darkBg p-6 rounded-xl border border-gray-100 dark:border-darkBorder hover:shadow-md transition-shadow"
            >
                <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <DollarSign size={24} className="text-primary dark:text-accent" /> ৩. ডেলিভারি চার্জ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white dark:bg-darkCard rounded-xl border border-gray-100 dark:border-darkBorder shadow-sm">
                    <p className="text-sm text-gray-500 mb-1 font-medium">সিলেট সিটি</p>
                    <p className="font-black text-2xl text-primary dark:text-white">৮০ ৳</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-darkCard rounded-xl border border-gray-100 dark:border-darkBorder shadow-sm">
                    <p className="text-sm text-gray-500 mb-1 font-medium">সারাদেশে</p>
                    <p className="font-black text-2xl text-primary dark:text-white">১২০ ৳</p>
                  </div>
                  <div className="text-center p-4 bg-white dark:bg-darkCard rounded-xl border border-success/30 shadow-sm bg-success/5 dark:bg-success/5">
                    <p className="text-sm text-success mb-1 font-medium">৫০০০+ টাকার অর্ডারে</p>
                    <p className="font-black text-2xl text-success">ফ্রি</p>
                  </div>
                </div>
            </motion.section>
        </div>
      </motion.div>
    </div>
  );
};

export const Terms: React.FC = () => {
  useSEO({ 
    title: 'শর্তাবলী (Terms and Conditions)', 
    description: 'NUR এর সাথে কেনাকাটা এবং প্ল্যাটফর্ম ব্যবহারের সকল শর্ত এবং নিয়মাবলী (Terms and Conditions)।' 
  });

  return (
    <div className="container mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white dark:bg-darkCard p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 dark:border-darkBorder text-gray-700 dark:text-gray-300"
      >
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-white flex items-center gap-3 border-b dark:border-darkBorder pb-4">
          <FileText className="text-accent" size={32} /> শর্তাবলী (Terms & Conditions)
        </h1>
        <div className="space-y-6 text-base leading-relaxed mt-8">
          <p className="font-medium text-lg">NUR ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি আমাদের এই সকল শর্তাবলীর সাথে সম্মত হচ্ছেন।</p>
          <ul className="list-disc pl-5 space-y-4 marker:text-primary">
            <li>পণ্যের মূল্য এবং স্টক ওয়েবসাইট পরিচালনার সুবিধার্থে যেকোনো সময় পরিবর্তন হতে পারে।</li>
            <li>অর্ডার কনফার্ম করার পর ডেলিভারি ৩-৫ কর্মদিবসের মধ্যে সম্পন্ন হবে, তবে বিশেষ ক্ষেত্রে তা বিলম্বিত হতে পারে।</li>
            <li>যেকোনো প্রকার স্প্যাম বা সাইটের অপব্যবহার বা প্রতারণামূলক কার্যকলাপের জন্য ইউজারের অ্যাকাউন্ট বিনা নোটিশে বাতিল করার অধিকার আমরা সংরক্ষণ করি।</li>
            <li>আমাদের পেমেন্ট মেথড হিসেবে বিকাশ, নগদ এবং ক্যাশ অন ডেলিভারি (COD) ব্যবহার করা যাবে।</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export const Affiliate: React.FC = () => {
  useSEO({ 
    title: 'অ্যাফিলিয়েট প্রোগ্রাম (Affiliate)', 
    description: 'NUR এর অ্যাফিলিয়েট প্রোগ্রামে যুক্ত হয়ে আয় করুন। আমাদের প্রিমিয়াম প্রোডাক্ট প্রোমোট করে প্রতিটি সেলে কমিশন বুঝে নিন।' 
  });

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-accent/20 text-accent font-bold px-4 py-1.5 rounded-full text-sm mb-4"
          >
            অ্যাফিলিয়েট প্রোগ্রাম
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-extrabold mb-4 text-primary dark:text-white"
          >
            NUR <span className="text-accent underline decoration-accent/30">অ্যাফিলিয়েট</span>
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">আমাদের সাথে যুক্ত হোন এবং আপনার রেফারেন্স থেকে আসা প্রতিটি অর্ডারের উপর আকর্ষণীয় কমিশন আয় করুন।</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <UserPlus size={32} />
            </div>
            <h3 className="font-bold text-xl mb-4 dark:text-white">অ্যাকাউন্ট খুলুন</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">অ্যাফিলিয়েট ড্যাশবোর্ডে গিয়ে আপনার প্রয়োজনীয় তথ্য দিয়ে ফ্রিতে অ্যাকাউন্ট তৈরি করুন।</p>
          </div>
          
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center relative">
            <div className="hidden md:block absolute top-1/2 -left-4 w-8 h-8 bg-gray-50 dark:bg-darkBg rounded-full -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8 bg-gray-50 dark:bg-darkBg rounded-full -translate-y-1/2"></div>
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <LinkIcon size={32} />
            </div>
            <h3 className="font-bold text-xl mb-4 dark:text-white">লিংক শেয়ার করুন</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">আপনার ড্যাশবোর্ড থেকে প্রোডাক্টের অ্যাফিলিয়েট লিংক তৈরি করুন এবং বন্ধু বা সোশ্যাল মিডিয়ায় শেয়ার করুন।</p>
          </div>
          
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="font-bold text-xl mb-4 dark:text-white">কমিশন আয়</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">আপনার লিংকের মাধ্যমে অর্ডার সম্পন্ন হলেই মূল্যের ৫% কমিশন আপনার ওয়ালেটে জমা হবে।</p>
          </div>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 dark:text-white">
                <Target className="text-accent" /> কেন আমাদের অ্যাফিলিয়েট জয়েন করবেন?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex-shrink-0 mt-1 flex items-center justify-center text-accent text-[10px] font-bold">✓</div>
                  <p className="text-gray-700 dark:text-gray-300">প্রতিটি বিক্রয়ে ফিক্সড ৫% কমিশন - বাজারে সর্বোচ্চ হারের মধ্যে একটি।</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex-shrink-0 mt-1 flex items-center justify-center text-accent text-[10px] font-bold">✓</div>
                  <p className="text-gray-700 dark:text-gray-300">বিকাশ বা নগদে সরাসরি পেমেন্ট সুবিধা।</p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex-shrink-0 mt-1 flex items-center justify-center text-accent text-[10px] font-bold">✓</div>
                  <p className="text-gray-700 dark:text-gray-300">২৪/৭ কাস্টমার সাপোর্ট এবং সেলস ট্র্যাকিং ড্যাশবোর্ড।</p>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3 bg-white dark:bg-darkCard p-6 rounded-2xl shadow-sm text-center">
              <p className="text-sm text-gray-400 uppercase font-bold mb-2">যোগাযোগ করুন</p>
              <p className="text-2xl font-bold text-primary dark:text-white mb-4">+880 1736118083</p>
              <Link to="/contact">
                <Button className="w-full">কথা বলুন আমাদের সাথে</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Blogs: React.FC = () => {
  useSEO({ 
    title: 'ফ্যাশন ব্লগ এবং টিপস (Blogs)', 
    description: 'NUR ফ্যাশন ব্লগ - পোশাক, স্টাইল, স্মার্ট শপিং গাইড, গ্রীষ্ম এবং শীতের সেরা ফ্যাশন ট্রেন্ড। Fashion tips, style guides and more.' 
  });

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBlogs: BlogPost[] = [];
        const partialMocks: Record<string, any> = {};
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.title) {
            fetchedBlogs.push({ id: doc.id, ...data } as BlogPost);
          } else {
            partialMocks[doc.id] = data;
          }
        });
        
        // If there are no full blogs in Firestore, fallback to mock data temporarily for the preview
        if (fetchedBlogs.length === 0) {
          setBlogs([
            {
              id: "1",
              title: "স্মার্ট শপিং এর ১০টি কার্যকরী টিপস",
              category: "Shopping",
              date: "May 10, 2024",
              image: "https://picsum.photos/seed/shopping/800/500",
              excerpt: "অনলাইনে কেনাকাটা করার আগে কোন বিষয়গুলো খেয়াল রাখবেন? কীভাবে সেরা ডিল খুঁজে পাবেন? জেনে নিন আমাদের স্মার্ট শপিং গাইড থেকে।",
              content: "",
              createdAt: new Date().toISOString(),
              ...partialMocks["1"]
            },
            {
              id: "2",
              title: "কীভাবে আসল প্রোডাক্ট চিনবেন?",
              category: "Guide",
              date: "May 12, 2024",
              image: "https://picsum.photos/seed/quality/800/500",
              excerpt: "নকল প্রোডাক্ট চেনা অনেক সময়ই কঠিন হয়ে যায়। তবে কিছু সাধারণ কৌশল জানা থাকলে আপনি খুব সহজেই আসল প্রোডাক্ট বাছাই করতে পারবেন।",
              content: "",
              createdAt: new Date().toISOString(),
              ...partialMocks["2"]
            },
            {
              id: "3",
              title: "গ্রীষ্মের সেরা ফ্যাশন ট্রেন্ড",
              category: "Fashion",
              date: "May 15, 2024",
              image: "https://picsum.photos/seed/fashion/800/500",
              excerpt: "এই গ্রীষ্মে কোন ধরনের পোশাক পরলে আরাম পাবেন এবং একই সাথে স্টাইলিশ দেখতে পারবেন? জেনে নিন আমাদের ফ্যাশন এক্সপার্টদের পরামর্শ।",
              content: "",
              createdAt: new Date().toISOString(),
              ...partialMocks["3"]
            }
          ]);
        } else {
          // Filter to only show active blogs if 'isActive' property exists
          const activeBlogs = fetchedBlogs.filter(b => b.isActive !== false);
          setBlogs(activeBlogs);
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-extrabold mb-4 text-primary dark:text-white"
        >
          NUR <span className="text-accent underline decoration-accent/30">ব্লগ</span>
        </motion.h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          রেগুলার আপডেট, শপিং গাইড এবং ফ্যাশন টিপস পেতে আমাদের ব্লগ পড়ুন।
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Array.from({ length: 3 }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-gray-400">
          <p className="text-xl font-bold">এখনও কোনো ব্লগ প্রকাশিত হয়নি।</p>
          <p>খুব শীঘ্রই নতুন ব্লগ আসছে, আমাদের সাথেই থাকুন!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {blogs.map((blog, i) => (
            <motion.article 
               key={blog.id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1, duration: 0.5 }}
               className="bg-white dark:bg-darkCard rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
               <div className="relative overflow-hidden h-60">
                 <img 
                   src={blog.image} 
                   alt={blog.title} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 bg-gray-100 dark:bg-gray-800"
                   referrerPolicy="no-referrer"
                 />
                 <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm dark:bg-darkBg/90 px-3 py-1 rounded-full text-xs font-bold text-primary dark:text-accent shadow-sm">
                   {blog.category}
                 </div>
               </div>
               
               <div className="p-6">
                 <div className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                   {blog.date} {blog.createdAt ? `• ${new Date(blog.createdAt).toLocaleDateString('bn-BD')}` : ''}
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-primary dark:group-hover:text-accent transition-colors">
                   {blog.title}
                 </h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                   {blog.excerpt}
                 </p>
                 <Link to={`/blogs/${blog.id}`} className="flex items-center gap-2 text-primary dark:text-accent font-bold hover:gap-4 transition-all uppercase text-sm tracking-wider">
                   আরও পড়ুন <ArrowRight size={18} />
                 </Link>
               </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export const BlogDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, showToast } = useStore();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);

  useSEO({ 
    title: blog ? blog.title : 'Blog Details', 
    description: blog ? blog.excerpt : 'Read full blog details at NUR.',
    image: blog ? blog.image : undefined,
    url: typeof window !== 'undefined' ? window.location.href : '',
    type: 'article',
    schema: blog ? {
      "@context": "https://schema.org/",
      "@type": "Article",
      "headline": blog.title,
      "image": [
        blog.image
      ],
      "author": {
        "@type": "Organization",
        "name": "NUR"
      },
      "datePublished": blog.createdAt,
      "description": blog.excerpt
    } : undefined
  });

  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      const mockBlogs = [
        {
          id: "1",
          title: "স্মার্ট শপিং এর ১০টি কার্যকরী টিপস",
          category: "Shopping",
          date: "May 10, 2024",
          image: "https://picsum.photos/seed/shopping/800/500",
          excerpt: "অনলাইনে কেনাকাটা করার আগে কোন বিষয়গুলো খেয়াল রাখবেন? কীভাবে সেরা ডিল খুঁজে পাবেন? জেনে নিন আমাদের স্মার্ট শপিং গাইড থেকে।",
          content: "This is a detailed article about smart shopping...",
          createdAt: new Date().toISOString(),
          likes: 5,
          likedBy: [],
          comments: [],
          ratings: [],
          averageRating: 0
        },
        {
          id: "2",
          title: "কীভাবে আসল প্রোডাক্ট চিনবেন?",
          category: "Guide",
          date: "May 12, 2024",
          image: "https://picsum.photos/seed/quality/800/500",
          excerpt: "নকল প্রোডাক্ট চেনা অনেক সময়ই কঠিন হয়ে যায়। তবে কিছু সাধারণ কৌশল জানা থাকলে আপনি খুব সহজেই আসল প্রোডাক্ট বাছাই করতে পারবেন।",
          content: "This is a detailed article about how to identify authentic products...",
          createdAt: new Date().toISOString(),
          likes: 2,
          likedBy: [],
          comments: [],
          ratings: [],
          averageRating: 0
        },
        {
          id: "3",
          title: "গ্রীষ্মের সেরা ফ্যাশন ট্রেন্ড",
          category: "Fashion",
          date: "May 15, 2024",
          image: "https://picsum.photos/seed/fashion/800/500",
          excerpt: "এই গ্রীষ্মে কোন ধরনের পোশাক পরলে আরাম পাবেন এবং একই সাথে স্টাইলিশ দেখতে পারবেন? জেনে নিন আমাদের ফ্যাশন এক্সপার্টদের পরামর্শ।",
          content: "This is a detailed article about summer fashion...",
          createdAt: new Date().toISOString(),
          likes: 12,
          likedBy: [],
          comments: [],
          ratings: [],
          averageRating: 0
        }
      ];

      const loadMock = (mergedData: any = {}) => {
        const mockBlog = mockBlogs.find(b => b.id === id);
        if (mockBlog) setBlog({ ...mockBlog, ...mergedData } as BlogPost);
      };

      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.title) {
            loadMock(data);
          } else {
            setBlog({ id: docSnap.id, ...data } as BlogPost);
          }
        } else {
          loadMock();
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        loadMock();
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    if (!user) return showToast("দয়া করে লাইক করতে লগইন করুন", "error");
    if (!blog || !id) return;

    const liked = blog.likedBy?.includes(user.id);
    const newLikedBy = liked 
      ? (blog.likedBy || []).filter(uid => uid !== user.id)
      : [...(blog.likedBy || []), user.id];
      
    const newLikes = liked ? Math.max(0, (blog.likes || 1) - 1) : (blog.likes || 0) + 1;

    // Optimistic UI update
    setBlog({ ...blog, likes: newLikes, likedBy: newLikedBy });

    try {
      await setDoc(doc(db, 'blogs', id), {
        likes: newLikes,
        likedBy: newLikedBy
      }, { merge: true });
    } catch (e) {
      console.error(e);
      // Revert if error occurs, ignoring offline errors intentionally for smooth UI
    }
  };

  const handleRating = async (rating: number) => {
    if (!user) return showToast("দয়া করে রেটিং দিতে লগইন করুন", "error");
    if (!blog || !id) return;

    setUserRating(rating);
    const existingRatings = blog.ratings || [];
    const otherRatings = existingRatings.filter(r => r.userId !== user.id);
    const newRatings = [...otherRatings, { userId: user.id, rating }];
    
    const avgRating = newRatings.reduce((acc, curr) => acc + curr.rating, 0) / newRatings.length;

    setBlog({ ...blog, ratings: newRatings, averageRating: avgRating });

    try {
      await setDoc(doc(db, 'blogs', id), {
        ratings: newRatings,
        averageRating: avgRating
      }, { merge: true });
      showToast("রেটিং যুক্ত হয়েছে!", "success");
    } catch (e) {
      console.error(e);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return showToast("দয়া করে কমেন্ট করতে লগইন করুন", "error");
    if (!blog || !id || !commentText.trim()) return;

    const newComment: BlogComment = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name || 'Anonymous User',
      text: commentText.trim(),
      date: new Date().toISOString() // Or specific format
    };

    const newComments = [...(blog.comments || []), newComment];
    setBlog({ ...blog, comments: newComments });
    setCommentText('');

    try {
      await setDoc(doc(db, 'blogs', id), {
        comments: newComments
      }, { merge: true });
      showToast("কমেন্ট যুক্ত হয়েছে!", "success");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center flex-col items-center py-32 space-y-4">
        <Loader2 size={48} className="animate-spin text-primary dark:text-accent" />
        <p className="text-gray-500 animate-pulse">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-3xl tracking-tight font-extrabold text-gray-900 dark:text-white mb-4">Article Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-lg mx-auto">We're sorry, we couldn't find the blog post you were looking for. It might have been removed or the URL may be incorrect.</p>
        <Link to="/blogs" className="text-primary font-medium hover:underline inline-flex items-center gap-2"><ArrowLeft size={16} /> Back to Blogs</Link>
      </div>
    );
  }

  const hasLiked = user ? blog.likedBy?.includes(user.id) : false;
  const currUserRating = user ? blog.ratings?.find(r => r.userId === user.id)?.rating || userRating : 0;

  return (
    <div className="bg-gray-50 dark:bg-darkBg py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-primary dark:text-accent hover:underline font-medium mb-8">
          <ArrowLeft size={18} /> Back to Blogs
        </Link>
        <article className="bg-white dark:bg-darkCard rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-darkBorder">
          <div className="relative h-64 md:h-96 w-full">
            <img 
              src={blog.image} 
              alt={blog.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white w-full">
              <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold shadow-md inline-block mb-4">
                {blog.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight drop-shadow-md">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium text-gray-200 flex-wrap">
                <span>{blog.date}</span>
                {blog.createdAt && (
                   <>
                     <span>•</span>
                     <span>{new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric'})}</span>
                   </>
                )}
                {blog.averageRating! > 0 && (
                   <span className="flex items-center gap-1 text-yellow-400">
                     • <Star size={14} className="fill-yellow-400" /> {blog.averageRating?.toFixed(1)}
                   </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 md:p-12">
            <div className="prose prose-lg prose-blue dark:prose-invert max-w-none markdown-body text-gray-800 dark:text-gray-200 mb-12">
              <Markdown>{blog.content || ''}</Markdown>
            </div>

            {/* Interaction Section */}
            <div className="border-t dark:border-darkBorder pt-8 mt-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
                <button 
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                    hasLiked 
                     ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                     : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-darkBg dark:text-gray-300 dark:hover:bg-gray-800'
                  }`}
                >
                  <ThumbsUp size={20} className={hasLiked ? "fill-blue-600 dark:fill-blue-400" : ""} />
                  {hasLiked ? 'Liked' : 'Like'} ({blog.likes || 0})
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Rate this article:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={24} 
                        className={`${
                          star <= currUserRating 
                           ? 'text-yellow-400 fill-yellow-400' 
                           : 'text-gray-300 dark:text-gray-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold dark:text-white mb-6 flex items-center gap-2">
                  <MessageSquare size={24} /> Comments ({(blog.comments || []).length})
                </h3>

                <form onSubmit={handleComment} className="mb-10 flex gap-3 relative">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 bg-gray-50 dark:bg-darkBg/50 border dark:border-darkBorder dark:text-white rounded-xl py-4 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button 
                    type="submit"
                    disabled={!commentText.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-blue-700 text-white p-2 w-12 rounded-lg flex items-center justify-center disabled:opacity-50 transition-all"
                  >
                    <Send size={18} />
                  </button>
                </form>

                <div className="space-y-6">
                  {(!blog.comments || blog.comments.length === 0) ? (
                    <p className="text-gray-500 italic text-center py-6">No comments yet. Be the first to comment!</p>
                  ) : (
                    blog.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 dark:bg-darkBg p-5 rounded-2xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-gray-900 dark:text-white">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};