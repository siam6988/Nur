import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Button, ProductCard, Card, LoadingSpinner } from '../components/UIComponents';
import { Minus, Plus, Trash2, MapPin, Phone, CreditCard, ShoppingBag, Package, Heart, Wallet, Moon, Sun, Edit, Save, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { DELIVERY_CHARGE_INSIDE, DELIVERY_CHARGE_OUTSIDE } from '../constants';
import { PaymentMethod, OrderStatus } from '../types';

// --- Cart Page ---
export const Cart: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, cartTotal, t, language } = useStore();
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="inline-flex bg-gray-100 dark:bg-darkCard p-6 rounded-full mb-4">
           <ShoppingBag size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2" data-key="yourCartEmpty">{t('yourCartEmpty')}</h2>
        <p className="text-gray-500 mb-6" data-key="noItemsAdded">{t('noItemsAdded')}</p>
        <Link to="/shop">
          <Button data-key="startShopping">{t('startShopping')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" data-key="shoppingCartTitle">{t('shoppingCartTitle')} ({cart.length})</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          {cart.map(item => {
             const discountedPrice = item.price - (item.price * item.discountPercentage / 100);
             const displayName = language === 'bn' ? (item.name_bn || item.name) : item.name;
             return (
              <Card key={item.cartId} className="flex gap-4 items-center !p-4">
                <img src={item.images[0]} alt={displayName} className="w-20 h-20 object-cover rounded bg-gray-100 dark:bg-darkBg" />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 dark:text-white line-clamp-1">{displayName}</h3>
                  <p className="text-xs text-gray-500 mb-2">Size: {item.selectedSize}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary dark:text-white">৳{discountedPrice}</span>
                    <span className="text-xs text-gray-400 line-through">৳{item.price}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 p-1">
                    <Trash2 size={18} />
                  </button>
                  <div className="flex items-center border dark:border-darkBorder rounded">
                    <button 
                      onClick={() => updateCartQuantity(item.cartId, item.quantity - 1)} 
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-2 text-sm font-medium dark:text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateCartQuantity(item.cartId, item.quantity + 1)} 
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-darkBg"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </Card>
             );
          })}
        </div>

        {/* Summary */}
        <div className="w-full lg:w-80 h-fit sticky top-24">
          <Card>
            <h3 className="font-bold text-lg mb-4" data-key="orderSummary">{t('orderSummary')}</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4 border-b dark:border-darkBorder pb-4">
              <div className="flex justify-between">
                <span data-key="subtotal">{t('subtotal')}</span>
                <span>৳{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span data-key="deliveryCharge">{t('deliveryCharge')}</span>
                <span>{cartTotal > 5000 ? t('free') : `৳${DELIVERY_CHARGE_INSIDE} - ৳${DELIVERY_CHARGE_OUTSIDE}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800 dark:text-white mb-6">
              <span data-key="totalEstimated">{t('totalEstimated')}</span>
              <span>৳{cartTotal} + Delivery</span>
            </div>
            <Link to="/checkout" className="block">
              <Button className="w-full" data-key="checkout">{t('checkout')}</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- Checkout Page ---
export const Checkout: React.FC = () => {
  const { cart, user, cartTotal, placeOrder, t, language } = useStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: 'Dhaka',
    note: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
       <div className="container mx-auto px-4 py-20 text-center">
         <h2 className="text-xl mb-4" data-key="loginToCheckout">{t('loginToCheckout')}</h2>
         <Link to="/login"><Button data-key="loginPage">{t('loginPage')}</Button></Link>
       </div>
    );
  }

  const isSylhet = formData.city === 'Sylhet';
  const shippingCost = cartTotal > 5000 ? 0 : (isSylhet ? DELIVERY_CHARGE_INSIDE : DELIVERY_CHARGE_OUTSIDE);
  const total = cartTotal + shippingCost;

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(async () => {
      const success = await placeOrder(formData, paymentMethod);
      setLoading(false);
      if(success) {
        navigate('/orders');
      }
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" data-key="checkoutTitle">{t('checkoutTitle')}</h1>
      <form onSubmit={handleOrder} className="flex flex-col lg:flex-row gap-8">
        <Card className="flex-1">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" data-key="shippingAddress"><MapPin size={18} /> {t('shippingAddress')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="col-span-2">
               <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="name">{t('name')}</label>
               <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2" />
             </div>
             <div>
               <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="phone">{t('phone')}</label>
               <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2" placeholder="017XXXXXXXX" />
             </div>
             <div>
               <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="city">{t('city')}</label>
               <select className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                 <option value="Dhaka">Dhaka</option>
                 <option value="Chittagong">Chittagong</option>
                 <option value="Sylhet">Sylhet (inside)</option>
                 <option value="Rajshahi">Rajshahi</option>
                 <option value="Khulna">Khulna</option>
                 <option value="Barisal">Barisal</option>
                 <option value="Rangpur">Rangpur</option>
                 <option value="Mymensingh">Mymensingh</option>
               </select>
             </div>
             <div className="col-span-2">
               <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1" data-key="detailedAddress">{t('detailedAddress')}</label>
               <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2" rows={2} placeholder="House, Road, Area..."></textarea>
             </div>
          </div>

          <h3 className="font-bold text-lg mt-8 mb-4 flex items-center gap-2" data-key="paymentMethod"><CreditCard size={18} /> {t('paymentMethod')}</h3>
          <div className="space-y-3">
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === PaymentMethod.COD ? 'border-primary bg-blue-50 dark:bg-white/5' : 'border-gray-100 dark:border-darkBorder'}`}>
              <input type="radio" name="payment" className="text-primary w-5 h-5" checked={paymentMethod === PaymentMethod.COD} onChange={() => setPaymentMethod(PaymentMethod.COD)} />
              <div className="ml-4">
                <span className="block font-bold text-gray-800 dark:text-white" data-key="cod">{t('cod')}</span>
                <span className="text-xs text-gray-500" data-key="codDesc">{t('codDesc')}</span>
              </div>
            </label>
            <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition ${paymentMethod === PaymentMethod.SSL ? 'border-primary bg-blue-50 dark:bg-white/5' : 'border-gray-100 dark:border-darkBorder'}`}>
              <input type="radio" name="payment" className="text-primary w-5 h-5" checked={paymentMethod === PaymentMethod.SSL} onChange={() => setPaymentMethod(PaymentMethod.SSL)} />
              <div className="ml-4 flex items-center gap-4">
                <div className="flex-1">
                  <span className="block font-bold text-gray-800 dark:text-white" data-key="onlinePayment">{t('onlinePayment')}</span>
                  <span className="text-xs text-gray-500" data-key="onlinePaymentDesc">{t('onlinePaymentDesc')}</span>
                </div>
              </div>
            </label>
          </div>
        </Card>

        <div className="w-full lg:w-96">
          <Card>
             <h3 className="font-bold text-lg mb-4" data-key="yourOrder">{t('yourOrder')}</h3>
             <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 no-scrollbar">
               {cart.map(item => (
                 <div key={item.cartId} className="flex justify-between text-sm">
                   <span className="text-gray-600 dark:text-gray-400">{language === 'bn' ? (item.name_bn || item.name) : item.name} <span className="text-xs text-gray-400">x {item.quantity}</span></span>
                   <span className="font-medium dark:text-white">৳{(item.price - (item.price * item.discountPercentage / 100)) * item.quantity}</span>
                 </div>
               ))}
             </div>
             <div className="border-t dark:border-darkBorder pt-4 space-y-2 text-sm">
               <div className="flex justify-between"><span data-key="subtotal">{t('subtotal')}</span><span>৳{cartTotal}</span></div>
               <div className="flex justify-between"><span data-key="deliveryCharge">{t('deliveryCharge')}</span><span>৳{shippingCost}</span></div>
               <div className="flex justify-between font-bold text-lg text-primary dark:text-white pt-2 border-t dark:border-darkBorder mt-2">
                 <span data-key="totalPayable">{t('totalPayable')}</span>
                 <span>৳{total}</span>
               </div>
             </div>
             <Button type="submit" className="w-full mt-6 py-4 text-lg" disabled={loading}>
               {loading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner /> <span data-key="processing">{t('processing')}</span></div> : <span data-key="confirmOrder">{t('confirmOrder')}</span>}
             </Button>
          </Card>
        </div>
      </form>
    </div>
  );
};

// --- Wishlist Page ---
export const Wishlist: React.FC = () => {
  const { wishlist, t } = useStore();
  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Heart size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold dark:text-white mb-2" data-key="yourCartEmpty">{t('yourCartEmpty')}</h2>
        <Link to="/shop"><Button data-key="startShopping">{t('startShopping')}</Button></Link>
      </div>
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6" data-key="wishlist">{t('wishlist')} ({wishlist.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
};

// --- Profile Page ---
export const Profile: React.FC = () => {
  const { user, orders, logout, cancelOrder, theme, setTheme, updateProfile, t, language } = useStore();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'https://picsum.photos/seed/user_avatar/100/100');

  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditAvatar(user.avatar || 'https://picsum.photos/seed/user_avatar/100/100');
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const AVATARS = [
    'https://picsum.photos/seed/avatar1/200/200',
    'https://picsum.photos/seed/avatar2/200/200',
    'https://picsum.photos/seed/avatar3/200/200',
    'https://picsum.photos/seed/avatar4/200/200',
    'https://picsum.photos/seed/avatar5/200/200',
    'https://picsum.photos/seed/avatar6/200/200',
  ];

  const handleSaveProfile = () => {
    updateProfile(editName, editAvatar);
    setIsEditing(false);
  };

  const filteredOrders = orders.filter(order => filterStatus === 'ALL' || order.status === filterStatus);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <Card className="w-full md:w-80 h-fit">
           <div className="flex justify-end mb-2">
             {!isEditing ? (
               <button onClick={() => setIsEditing(true)} className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">
                 <Edit size={18} />
               </button>
             ) : (
               <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-red-500 dark:text-gray-400">
                 <X size={18} />
               </button>
             )}
           </div>

           <div className="flex flex-col items-center mb-6">
             <div className="relative group">
               <div className="w-24 h-24 bg-gray-200 rounded-full mb-3 overflow-hidden border-4 border-primary/20 shadow-lg">
                 <img src={isEditing ? editAvatar : user.avatar} alt="avatar" className="w-full h-full object-cover" />
               </div>
               {isEditing && (
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white dark:bg-darkCard shadow-md rounded-full px-2 py-1 text-[10px] font-bold whitespace-nowrap border dark:border-darkBorder" data-key="changeAvatar">
                   {t('changeAvatar')}
                 </div>
               )}
             </div>

             {isEditing ? (
               <div className="w-full space-y-4 mt-2">
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-1 block" data-key="username">{t('username')}</label>
                   <input 
                     type="text" 
                     value={editName} 
                     onChange={(e) => setEditName(e.target.value)} 
                     className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 text-center font-bold"
                   />
                 </div>
                 
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase mb-2 block text-center" data-key="selectAvatar">{t('selectAvatar')}</label>
                   <div className="flex flex-wrap justify-center gap-2">
                     {AVATARS.map((av, idx) => (
                       <button 
                         key={idx} 
                         onClick={() => setEditAvatar(av)}
                         className={`w-10 h-10 rounded-full overflow-hidden border-2 ${editAvatar === av ? 'border-primary scale-110' : 'border-transparent hover:border-gray-300'} transition`}
                       >
                         <img src={av} alt={`av-${idx}`} className="w-full h-full object-cover" />
                       </button>
                     ))}
                   </div>
                 </div>

                 <Button onClick={handleSaveProfile} className="w-full py-2 flex items-center justify-center gap-2">
                   <Save size={16} /> <span data-key="saveChanges">{t('saveChanges')}</span>
                 </Button>
               </div>
             ) : (
               <>
                 <h3 className="font-bold text-xl dark:text-white mt-2">{user.name}</h3>
                 <p className="text-sm text-gray-500">{user.email}</p>
               </>
             )}
           </div>
           
           {!isEditing && (
             <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 rounded-xl text-center mb-6 border border-primary/10">
               <p className="text-xs text-gray-600 dark:text-gray-400 uppercase font-bold tracking-wider mb-1" data-key="gameProgress">{t('gameProgress')}</p>
               <p className="text-3xl font-black text-primary dark:text-white">{user.points}</p>
               <p className="text-[10px] text-gray-500 mt-1" data-key="earnPoints">{t('earnPoints')}</p>
             </div>
           )}

           <div className="mb-6 pt-4 border-t dark:border-darkBorder">
             <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider" data-key="appearance">{t('appearance')}</h4>
             <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-darkBg border dark:border-darkBorder">
               <div className="flex items-center gap-2">
                 {theme === 'dark' ? <Moon size={16} className="text-accent" /> : <Sun size={16} className="text-primary" />}
                 <span className="text-sm font-medium dark:text-gray-300" data-key="blackTheme">{t('blackTheme')}</span>
               </div>
               <button 
                 onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                 className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-accent' : 'bg-gray-300'}`}
               >
                 <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`}></div>
               </button>
             </div>
           </div>

           <nav className="space-y-2">
             <Button variant="ghost" className="w-full justify-start text-primary dark:text-white bg-blue-50 dark:bg-white/5 font-semibold" data-key="orders">{t('orders')}</Button>
             <Link to="/wishlist"><Button variant="ghost" className="w-full justify-start" data-key="wishlist">{t('wishlist')}</Button></Link>
             <Button variant="ghost" onClick={logout} className="w-full justify-start text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" data-key="logout">{t('logout')}</Button>
           </nav>
        </Card>

        <div className="flex-1">
           <h2 className="text-2xl font-bold mb-6" data-key="orders">{t('orders')}</h2>
           <div className="space-y-4">
             {filteredOrders.length > 0 ? filteredOrders.map(order => (
               <Card key={order.id}>
                 <div className="flex justify-between items-start mb-4 border-b dark:border-darkBorder pb-4">
                   <div>
                     <p className="font-bold text-primary dark:text-white">#{order.id}</p>
                     <p className="text-xs text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{order.status}</span>
                     <p className="font-bold text-lg mt-1 dark:text-white">৳{order.finalTotal}</p>
                   </div>
                 </div>
                 {order.items.map((item, idx) => (
                   <div key={idx} className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                     {language === 'bn' ? (item.name_bn || item.name) : item.name} x{item.quantity}
                   </div>
                 ))}
               </Card>
             )) : (
               <div className="text-center py-10 bg-white dark:bg-darkCard rounded-lg border dark:border-darkBorder">
                 <Package size={48} className="mx-auto text-gray-300 mb-3" />
                 <p className="text-gray-500">কোনো অর্ডার পাওয়া যায়নি।</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

// --- Login Page ---
export const Login: React.FC = () => {
  const { login, t } = useStore();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, 'User');
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50 dark:bg-darkBg">
      <Card className="max-w-md w-full !p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-8 dark:text-white" data-key={isLoginView ? 'loginTitle' : 'signupTitle'}>{isLoginView ? t('loginTitle') : t('signupTitle')}</h2>
        <form className="space-y-4" onSubmit={handleAuth}>
          <input type="email" placeholder={t('email')} required className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white p-3 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder={t('password')} required className="w-full border dark:border-darkBorder dark:bg-darkBg dark:text-white p-3 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          <Button type="submit" className="w-full py-3" disabled={loading}>
            {loading ? <div className="flex items-center justify-center gap-2"><LoadingSpinner /> <span data-key="processing">{t('processing')}</span></div> : (isLoginView ? t('login') : t('signupTitle'))}
          </Button>
          <button type="button" onClick={() => setIsLoginView(!isLoginView)} className="w-full text-sm text-primary dark:text-accent hover:underline mt-4" data-key={isLoginView ? 'noAccount' : 'haveAccount'}>
            {isLoginView ? t('noAccount') : t('haveAccount')}
          </button>
        </form>
      </Card>
    </div>
  );
};