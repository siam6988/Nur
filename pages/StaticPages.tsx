import React, { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase-config';
import { BlogPost } from '../types';
import { Mail, Phone, MapPin, DollarSign, Users, Gift, ShieldCheck, Target, Truck, Clock, Map, Lock, FileText, AlertCircle, ShoppingBag, Star, Heart, ArrowRight, Loader2, UserPlus, Link as LinkIcon } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export const About: React.FC = () => {
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
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedBlogs: BlogPost[] = [];
        querySnapshot.forEach((doc) => {
          fetchedBlogs.push({ id: doc.id, ...doc.data() } as BlogPost);
        });
        
        // If there are no blogs in Firestore, fallback to mock data temporarily for the preview
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
              createdAt: new Date().toISOString()
            },
            {
              id: "2",
              title: "কীভাবে আসল প্রোডাক্ট চিনবেন?",
              category: "Guide",
              date: "May 12, 2024",
              image: "https://picsum.photos/seed/quality/800/500",
              excerpt: "নকল প্রোডাক্ট চেনা অনেক সময়ই কঠিন হয়ে যায়। তবে কিছু সাধারণ কৌশল জানা থাকলে আপনি খুব সহজেই আসল প্রোডাক্ট বাছাই করতে পারবেন।",
              content: "",
              createdAt: new Date().toISOString()
            },
            {
              id: "3",
              title: "গ্রীষ্মের সেরা ফ্যাশন ট্রেন্ড",
              category: "Fashion",
              date: "May 15, 2024",
              image: "https://picsum.photos/seed/fashion/800/500",
              excerpt: "এই গ্রীষ্মে কোন ধরনের পোশাক পরলে আরাম পাবেন এবং একই সাথে স্টাইলিশ দেখতে পারবেন? জেনে নিন আমাদের ফ্যাশন এক্সপার্টদের পরামর্শ।",
              content: "",
              createdAt: new Date().toISOString()
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
        <div className="flex justify-center items-center py-20">
          <Loader2 size={48} className="animate-spin text-primary dark:text-accent" />
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
                 <button className="flex items-center gap-2 text-primary dark:text-accent font-bold hover:gap-4 transition-all uppercase text-sm tracking-wider">
                   আরও পড়ুন <ArrowRight size={18} />
                 </button>
               </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};