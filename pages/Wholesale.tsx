import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { ProductCard, Card, LoadingSpinner } from "../components/UIComponents";
import {
  Package,
  Search,
  X,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Clock,
  Upload,
  Lock,
} from "lucide-react";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { motion } from "motion/react";

export const Wholesale: React.FC = () => {
  const { products, isLoading, t, language, user, showToast } = useStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");

  const [isApplying, setIsApplying] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    description: "",
    phone: "",
    address: "",
    visitingCardImage: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  const resizeAndConvertImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          // Scale down if too large
          if (width > 800) {
            height = Math.round((height * 800) / width);
            width = 800;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImg(true);
    try {
      // 1. Resize/Compress image using canvas
      const base64Data = await resizeAndConvertImage(file);
      const pureBase64 = base64Data.split(",")[1];

      // 2. Upload to ImgBB
      const formDataToSend = new FormData();
      formDataToSend.append("image", pureBase64);
      
      const apiKey = import.meta.env.VITE_IMGBB_API_KEY || "fe89849202737604fd6885ab988cace3"; // Fallback to public test key or fallback 

      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, visitingCardImage: data.data.url });
        showToast("Image uploaded successfully!", "success");
      } else {
        throw new Error("ImgBB Error");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to upload image.", "error");
    } finally {
      setUploadingImg(false);
    }
  };

  const wholesaleProducts = useMemo(() => {
    let result = products.filter(
      (p) => p.isWholesale === true && p.isActive === true,
    );

    if (searchQuery) {
      result = result.filter((p) => {
        const nameEn = p.name_en || p.name || "";
        const nameBn = p.name_bn || "";
        return (
          nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          nameBn.includes(searchQuery)
        );
      });
    }

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          a.price * (1 - a.discountPercentage / 100) -
          b.price * (1 - b.discountPercentage / 100),
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          b.price * (1 - b.discountPercentage / 100) -
          a.price * (1 - a.discountPercentage / 100),
      );
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [products, searchQuery, sortBy]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.shopName || !formData.phone || !formData.address) {
      showToast("Please fill all required fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      await addDoc(collection(db!, "resellerApplications"), {
        userId: user.id,
        shopName: formData.shopName,
        description: formData.description,
        phone: formData.phone,
        address: formData.address,
        visitingCardImage: formData.visitingCardImage,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      // Update user doc
      await updateDoc(doc(db!, "users", user.id), {
        resellerStatus: "pending",
      });

      showToast("Application submitted successfully!", "success");
      setIsApplying(false);
    } catch (error) {
      console.error(error);
      showToast("Failed to submit application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const renderAccessStatus = () => {
    if (!user) {
      return (
        <div className="bg-primary/5 border border-primary/20 dark:bg-darkCard p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-primary/10 p-3 rounded-full text-primary dark:text-accent">
              <Lock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-primary dark:text-white">
                Login to access wholesale
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                You need to log in to apply for reseller access and view
                wholesale prices.
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="bg-primary hover:bg-blue-900 text-white px-6 py-2 rounded-full font-bold transition shadow-md whitespace-nowrap"
          >
            Login Now
          </Link>
        </div>
      );
    }

    const isReseller =
      user.role === "reseller" || user.resellerStatus === "approved";
    const status = user.resellerStatus;

    if (isReseller) {
      return (
        <div className="bg-success/5 border border-success/20 dark:bg-darkCard p-6 rounded-2xl flex items-center gap-4 shadow-sm mb-8">
          <div className="bg-success/10 p-3 rounded-full text-success">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-success dark:text-green-400">
              Approved Reseller
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              You have full access to view prices and order wholesale products.
            </p>
          </div>
        </div>
      );
    }

    if (status === "pending") {
      return (
        <div className="bg-accent/5 border border-accent/20 dark:bg-darkCard p-6 rounded-2xl flex items-center gap-4 shadow-sm mb-8">
          <div className="bg-accent/10 p-3 rounded-full text-accent">
            <Clock size={28} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-accent dark:text-yellow-400">
              Your request is under review
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              We are verifying your details. We will notify you once approved.
            </p>
          </div>
        </div>
      );
    }

    if (status === "rejected") {
      return (
        <div className="bg-danger/5 border border-danger/20 dark:bg-darkCard p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <div className="bg-danger/10 p-3 rounded-full text-danger">
              <AlertCircle size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-danger dark:text-red-400">
                Application rejected. You can reapply.
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Unfortunately, your previous application was rejected. Please
                try applying again with correct details.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsApplying(true)}
            className="bg-primary hover:bg-blue-900 text-white px-6 py-2 rounded-full font-bold transition shadow-md whitespace-nowrap"
          >
            Reapply Now
          </button>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 dark:bg-darkCard p-6 flex flex-col md:flex-row items-center justify-between rounded-2xl shadow-sm mb-8">
        <div className="flex flex-col gap-1 mb-4 md:mb-0">
          <h3 className="font-bold text-lg text-primary dark:text-white">
            Become a reseller to see wholesale prices
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Get premium tier pricing and bulk order facilities.
          </p>
        </div>
        <button
          onClick={() => setIsApplying(true)}
          className="bg-accent hover:bg-yellow-600 text-primary px-6 py-2.5 rounded-full font-bold transition shadow-md whitespace-nowrap flex items-center gap-2"
        >
          Apply for Reseller <ShieldCheck size={18} />
        </button>
      </div>
    );
  };

  const renderApplicationForm = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-white dark:bg-darkCard rounded-2xl shadow-xl border border-gray-100 dark:border-darkBorder overflow-hidden mb-12"
      >
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Reseller Application</h2>
            <p className="text-white/80 text-sm">
              Fill in the details to apply for wholesale access
            </p>
          </div>
          <button
            onClick={() => setIsApplying(false)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-6 md:p-8 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Shop/Business Name <span className="text-danger">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.shopName}
              onChange={(e) =>
                setFormData({ ...formData, shopName: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-darkBg dark:text-white border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:border-darkBorder"
              placeholder="Enter your business name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-darkBg dark:text-white border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:border-darkBorder"
              placeholder="+880 1XXX-XXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Business Address <span className="text-danger">*</span>
            </label>
            <textarea
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-darkBg dark:text-white border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:border-darkBorder h-24"
              placeholder="Detailed outlet or office address"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Business Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-gray-50 dark:bg-darkBg dark:text-white border px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 dark:border-darkBorder h-20"
              placeholder="Briefly describe your business types..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Visiting Card (Optional)
            </label>
            <div className={`border-2 border-dashed ${formData.visitingCardImage ? 'border-success bg-success/5' : 'border-gray-300 dark:border-darkBorder bg-gray-50 dark:bg-darkBg'} p-6 rounded-xl text-center flex flex-col items-center relative overflow-hidden transition-colors`}>
              {uploadingImg ? (
                <div className="flex flex-col items-center py-4">
                  <LoadingSpinner />
                  <p className="text-sm mt-2 font-medium">Uploading to ImgBB...</p>
                </div>
              ) : formData.visitingCardImage ? (
                <div className="flex flex-col items-center w-full">
                   <img src={formData.visitingCardImage} alt="Visiting Card" className="h-32 object-contain mb-3 rounded shadow-sm" />
                   <div className="flex gap-2">
                     <span className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-full flex items-center gap-1">
                       <CheckCircle size={14}/> Uploaded
                     </span>
                     <button type="button" onClick={() => setFormData({...formData, visitingCardImage: ""})} className="text-sm font-medium text-danger bg-danger/10 px-3 py-1 rounded-full hover:bg-danger/20 transition">
                       Remove
                     </button>
                   </div>
                </div>
              ) : (
                <>
                  <Upload className="text-gray-400 mb-2 group-hover:text-primary transition-colors" size={28} />
                  <p className="text-sm text-gray-500 mb-1 font-medium">
                    Click to upload your visiting card
                  </p>
                  <p className="text-xs text-gray-400 mb-2">JPG, PNG up to 5MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={() => setIsApplying(false)}
              className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 dark:bg-darkBorder dark:text-white rounded-xl font-bold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3.5 bg-primary text-white rounded-xl font-bold transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${submitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-900"}`}
            >
              {submitting ? <LoadingSpinner /> : "Submit Application"}
            </button>
          </div>
        </form>
      </motion.div>
    );
  };

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-bold text-primary dark:text-white mb-4">
          {t("wholesaleProducts")}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {language === "bn"
            ? "আপনার ব্যবসার জন্য সেরা দামে পাইকারি পণ্য কিনুন। আমাদের রয়েছে বিশাল কালেকশন এবং আকর্ষণীয় টিয়ার প্রাইসিং।"
            : "Buy wholesale products at the best prices for your business. We have a huge collection and attractive tier pricing."}
        </p>
      </div>

      {isApplying ? renderApplicationForm() : renderAccessStatus()}

      {!isApplying && (
        <>
          <div className="mb-8 flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t("searchProduct")}
                className="w-full dark:bg-darkCard dark:text-white border border-gray-200 dark:border-darkBorder rounded-xl py-3 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-primary/20 transition outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-4 top-3.5 text-gray-400"
                size={20}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-danger"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            <select
              className="bg-white dark:bg-darkCard dark:text-white border dark:border-darkBorder rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">{t("sortDefault")}</option>
              <option value="price-low">{t("sortLowHigh")}</option>
              <option value="price-high">{t("sortHighLow")}</option>
              <option value="rating">{t("sortRating")}</option>
            </select>
          </div>

          {wholesaleProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wholesaleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-20 max-w-2xl mx-auto">
              <Package
                size={48}
                className="mx-auto text-gray-300 dark:text-gray-700 mb-4"
              />
              <p className="text-gray-500 dark:text-gray-400">
                {t("noWholesaleProducts")}
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
