import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { db } from '../firebase-config';
import { doc, updateDoc, collection, query, getDocs, orderBy } from 'firebase/firestore';
import { Button, Card, LoadingSpinner } from '../components/UIComponents';
import { Save, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Order, OrderStatus } from '../types';

const Admin: React.FC = () => {
  const { products, isLoading, showToast } = useStore();
  const [stockUpdates, setStockUpdates] = useState<{ [key: string]: number }>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stock' | 'orders'>('stock');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    if (!db) return;
    setLoadingOrders(true);
    try {
      const q = query(collection(db, "orders"), orderBy("date", "desc"));
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStockChange = (id: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setStockUpdates(prev => ({ ...prev, [id]: numValue }));
    }
  };

  const saveStock = async (id: string) => {
    if (stockUpdates[id] === undefined || !db) return;
    
    setSaving(id);
    try {
      const productRef = doc(db, "products", id);
      await updateDoc(productRef, { stock: stockUpdates[id] });
      // Clear the update state for this item as it's now synced
      setStockUpdates(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      showToast("Stock updated successfully!", "success");
    } catch (error) {
      console.error("Error updating stock:", error);
      showToast("Failed to update stock", "error");
    } finally {
      setSaving(null);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (!db) return;
    setSaving(orderId);
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast(`Order status updated to ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating order status:", error);
      showToast("Failed to update order status", "error");
    } finally {
      setSaving(null);
    }
  };

  if (isLoading) return <div className="p-20 flex justify-center"><LoadingSpinner /></div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Admin Panel</h1>
      
      <div className="flex gap-4 mb-8 border-b dark:border-darkBorder pb-4">
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === 'stock' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-darkCard dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'}`}
        >
          Stock Management
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-lg font-bold transition ${activeTab === 'orders' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-darkCard dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5'}`}
        >
          Order Management
        </button>
      </div>

      {activeTab === 'stock' && (
        <div className="grid gap-6">
          {products.map(product => (
            <Card key={product.id} className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <img src={product.images[0]} alt={product.name_en} className="w-16 h-16 object-cover rounded-lg" />
                <div>
                  <h3 className="font-bold dark:text-white">{product.name_en}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID: {product.id}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Stock: <span className="font-bold text-primary">{product.stock}</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <label className="text-xs text-gray-500 mb-1">New Stock</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-24 border dark:border-darkBorder dark:bg-darkBg dark:text-white rounded p-2 text-center"
                    value={stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : product.stock}
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => saveStock(product.id)}
                  disabled={stockUpdates[product.id] === undefined || stockUpdates[product.id] === product.stock || saving === product.id}
                  className="w-32"
                >
                  {saving === product.id ? <LoadingSpinner /> : <><Save size={16} className="mr-2" /> Update</>}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="flex justify-center p-10"><LoadingSpinner /></div>
          ) : orders.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-10">No orders found.</p>
          ) : (
            <div className="grid gap-6">
              {orders.map(order => (
                <Card key={order.id} className="flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b dark:border-darkBorder pb-4">
                    <div>
                      <h3 className="font-bold text-lg dark:text-white">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Customer: {order.userId}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total: <span className="font-bold text-primary">৳{order.finalTotal}</span></p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {order.status}
                      </span>
                      
                      {order.status !== OrderStatus.DELIVERED && order.status !== OrderStatus.CANCELLED && (
                        <div className="flex gap-2 mt-2">
                          {order.status === OrderStatus.PENDING && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)} disabled={saving === order.id}>
                              Confirm
                            </Button>
                          )}
                          {order.status === OrderStatus.CONFIRMED && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, OrderStatus.SHIPPED)} disabled={saving === order.id}>
                              Ship
                            </Button>
                          )}
                          {order.status === OrderStatus.SHIPPED && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, OrderStatus.DELIVERED)} disabled={saving === order.id} className="bg-green-600 hover:bg-green-700">
                              Mark Delivered
                            </Button>
                          )}
                          <Button size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-50" onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)} disabled={saving === order.id}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-sm mb-2 dark:text-gray-300">Items:</h4>
                    <div className="space-y-2">
                      {order.items.map(item => (
                        <div key={item.cartId} className="flex justify-between items-center text-sm">
                          <span className="dark:text-gray-400">{item.name_en} (x{item.quantity}) - Size: {item.selectedSize}</span>
                          <span className="font-medium dark:text-gray-300">৳{(item.price - (item.price * item.discountPercentage / 100)) * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
