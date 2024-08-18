"use client";
import { useState, useEffect } from 'react';
import './globals.css';


interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  discount:string
}

interface CartItem extends Product {
  quantity: number;
}

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]); // For storing product data
  const [cart, setCart] = useState<CartItem[]>([]); // For storing items in the cart

  // Fetch products from the API when the component mounts
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);
      if (productExists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };
  const updateQuantity = (productId: string, amount: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + amount } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  
    return (
      <div className="p-6">
        {/* Product Listing */}
        <h1 className="text-2xl font-bold mb-4">Product Listing</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-lg">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4" />
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-gray-600">${product.price.toFixed(2)}</p>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 transition duration-200 hover:bg-blue-700"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
  
        {/* Cart */}
        <div className="mt-12">
          <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
          {cart.length === 0 ? (
            <p>Your cart is empty</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b py-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
                  <div className="flex-1 ml-4">
                    <h2 className="text-lg">{item.name}</h2>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="px-2 py-1 text-gray-700 border border-gray-400 rounded"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="px-2 py-1 text-gray-700 border border-gray-400 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 ml-4"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div className="mt-6">
                <h2 className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</h2>
                {/* Optional: Apply discounts */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  
  export default HomePage;
  