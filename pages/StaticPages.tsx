import React, { useState } from 'react';
import { Mail, Phone, MapPin, DollarSign, Users, Gift, ShieldCheck, Target, Truck, Clock, Map, Lock, FileText, AlertCircle } from 'lucide-react';
import { Button } from '../components/UIComponents';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-darkCard p-8 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder">
        <h1 className="text-3xl font-bold mb-6 text-primary dark:text-white">আমাদের সম্পর্কে</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          NUR বাংলাদেশের অন্যতম দ্রুত বর্ধনশীল ই-কমার্স প্ল্যাটফর্ম। আমাদের লক্ষ্য হলো দেশের প্রতিটি প্রান্তে বিশ্বমানের শপিং অভিজ্ঞতা পৌঁছে দেওয়া। আমরা বিশ্বাস করি সততা এবং গুণগত মানে।
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          ২০২৪ সালে প্রতিষ্ঠিত, NUR শুরু থেকেই গ্রাহকদের আস্থা অর্জন করে আসছে। আমাদের আছে নিজস্ব ডেলিভারি নেটওয়ার্ক এবং ২৪/৭ কাস্টমার সাপোর্ট টিম।
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded">
            <h3 className="font-bold text-xl text-accent mb-2">১০০%</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">অথেনটিক প্রোডাক্ট</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded">
            <h3 className="font-bold text-xl text-accent mb-2">৫০০০+</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">হ্যাপি কাস্টমার</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-white/5 rounded">
            <h3 className="font-bold text-xl text-accent mb-2">৬৪</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">জেলায় ডেলিভারি</p>
          </div>
        </div>
      </div>
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
           {activeTab === 'privacy' ? (
             <div className="space-y-8 animate-[slideUp_0.3s_ease-out]">
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
             </div>
           ) : (
             <div className="space-y-8 animate-[slideUp_0.3s_ease-out]">
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
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export const ShippingPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-darkCard p-8 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder text-gray-700 dark:text-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white flex items-center gap-2">
          <Truck className="text-accent" /> শিপিং পলিসি (Shipping Policy)
        </h1>
        
        <div className="space-y-8 text-sm leading-relaxed">
            <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-darkBorder">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <Map size={20} className="text-primary dark:text-accent" /> ১. ডেলিভারি এলাকা
                </h3>
                <p>আমরা সমগ্র বাংলাদেশে হোম ডেলিভারি সুবিধা প্রদান করে থাকি। সুন্দরবন কুরিয়ার, এস.এ পরিবহন, এবং পাঠাও কুরিয়ারের মাধ্যমে আমরা পণ্য পাঠিয়ে থাকি। দেশের যেকোনো প্রান্তে আমরা পণ্য পৌঁছে দিতে বদ্ধপরিকর।</p>
            </section>

            <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-darkBorder">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                   <Clock size={20} className="text-primary dark:text-accent" /> ২. ডেলিভারি সময়সীমা
                </h3>
                <ul className="space-y-2">
                    <li className="flex justify-between items-center border-b dark:border-gray-700 pb-2">
                      <span>সিলেট শহরের ভিতরে</span>
                      <span className="font-bold text-gray-900 dark:text-white">১-২ কর্মদিবস</span>
                    </li>
                    <li className="flex justify-between items-center pt-2">
                      <span>সিলেটের বাইরে (সারাদেশে)</span>
                      <span className="font-bold text-gray-900 dark:text-white">৩-৫ কর্মদিবস</span>
                    </li>
                </ul>
                <p className="mt-3 text-xs text-gray-500 italic">নোট: প্রাকৃতিক দুর্যোগ, রাজনৈতিক অস্থিরতা বা অনিবার্য কারণে ডেলিভারি সময় কিছুটা পরিবর্তন হতে পারে।</p>
            </section>

             <section className="bg-gray-50 dark:bg-white/5 p-6 rounded-xl border border-gray-100 dark:border-darkBorder">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <DollarSign size={20} className="text-primary dark:text-accent" /> ৩. ডেলিভারি চার্জ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white dark:bg-darkBg rounded border dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">সিলেট সিটি</p>
                    <p className="font-bold text-xl text-primary dark:text-white">৮০ টাকা</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-darkBg rounded border dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">সারাদেশে</p>
                    <p className="font-bold text-xl text-primary dark:text-white">১২০ টাকা</p>
                  </div>
                  <div className="text-center p-3 bg-white dark:bg-darkBg rounded border dark:border-gray-700">
                    <p className="text-xs text-gray-500 mb-1">৫০০০+ টাকার অর্ডারে</p>
                    <p className="font-bold text-xl text-success">ফ্রি</p>
                  </div>
                </div>
            </section>

            <section>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">৪. অর্ডার ট্র্যাকিং</h3>
                <p>অর্ডার কনফার্ম করার পর আপনি একটি ট্র্যাকিং আইডি পাবেন (যদি কুরিয়ার সার্ভিস প্রদান করে)। এছাড়া আমাদের ওয়েবসাইটে লগইন করে আপনার প্রোফাইল থেকে <strong>'অর্ডার'</strong> সেকশনে গিয়ে বর্তমান স্ট্যাটাস দেখতে পারবেন।</p>
            </section>

            <section>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-2">৫. পণ্য গ্রহণ ও পরিদর্শন</h3>
                <p>ডেলিভারি ম্যানের সামনেই পণ্য চেক করে নেওয়া উত্তম। যদি পণ্যে কোনো সমস্যা থাকে, তবে সাথে সাথে আমাদের হটলাইনে যোগাযোগ করুন এবং পণ্য ফেরত দিন। কুরিয়ার ম্যান চলে আসার পর কোনো অভিযোগ গ্রহণযোগ্য হবে না।</p>
            </section>
        </div>
      </div>
    </div>
  );
};

export const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white dark:bg-darkCard p-8 rounded-lg shadow-sm border border-gray-100 dark:border-darkBorder text-gray-700 dark:text-gray-300">
        <h1 className="text-2xl font-bold mb-6 text-primary dark:text-white">শর্তাবলী (Terms & Conditions)</h1>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>NUR ওয়েবসাইট ব্যবহার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মত হচ্ছেন।</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>পণ্যের মূল্য এবং স্টক পরিবর্তন হতে পারে।</li>
            <li>অর্ডার কনফার্ম করার পর ডেলিভারি ৩-৫ কর্মদিবসের মধ্যে সম্পন্ন হবে।</li>
            <li>যেকোনো প্রতারণামূলক কার্যকলাপের জন্য অ্যাকাউন্ট বাতিল করার অধিকার আমরা সংরক্ষণ করি।</li>
            <li>পেমেন্ট মেথড হিসেবে বিকাশ, নগদ এবং ক্যাশ অন ডেলিভারি (COD) গ্রহণ করা হয়।</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const Affiliate: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-primary rounded-3xl p-8 md:p-16 text-white relative overflow-hidden mb-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">আমাদের সাথে আয় করুন <span className="text-accent underline decoration-white/30 italic">সহজে</span></h1>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              NUR অ্যাফিলিয়েট প্রোগ্রামে যোগ দিন এবং প্রতিটি সফল রেফারেল অর্ডারে জিতে নিন ফিক্সড <span className="bg-accent text-primary px-3 py-1 rounded-lg font-black text-2xl">৫%</span> কমিশন!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button className="bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent hover:text-white transition-all transform hover:scale-105 shadow-xl">
                  এখনই রেজিস্ট্রেশন করুন
                </Button>
              </Link>
              <button className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 backdrop-blur-sm transition-all">
                ডিটেইলস দেখুন
              </button>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>
          <DollarSign className="absolute -bottom-10 right-10 text-white/5 w-64 h-64 rotate-12" />
        </div>

        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">কিভাবে কাজ করে?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary dark:text-white">
              <Users size={32} />
            </div>
            <h3 className="font-bold text-xl mb-4 dark:text-white">রেজিস্ট্রেশন</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">আমাদের সাপোর্টে যোগাযোগ করে আপনার ইউনিক অ্যাফিলিয়েট অ্যাকাউন্ট এবং ট্র্যাকিং আইডি সংগ্রহ করুন।</p>
          </div>
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary dark:text-white">
              <Gift size={32} />
            </div>
            <h3 className="font-bold text-xl mb-4 dark:text-white">প্রচার করুন</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">আপনার ইউনিক লিংকটি সোশ্যাল মিডিয়ায় শেয়ার করুন অথবা বন্ধুদের আমাদের পণ্য সম্পর্কে জানান।</p>
          </div>
          <div className="bg-white dark:bg-darkCard p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-darkBorder text-center hover:shadow-md transition">
            <div className="w-16 h-16 bg-blue-50 dark:bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary dark:text-white">
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