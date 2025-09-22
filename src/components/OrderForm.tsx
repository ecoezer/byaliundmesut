import React, { useState, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2, Plus, Minus, ShoppingCart, Clock, MapPin, Phone, User, MessageSquare, Send } from 'lucide-react';

interface OrderItem {
  menuItem: {
    id: number;
    name: string;
    price: number;
    number: string | number;
  };
  quantity: number;
  selectedSize?: {
    name: string;
    description?: string;
  };
  selectedIngredients?: string[];
  selectedExtras?: string[];
  selectedPastaType?: string;
  selectedSauce?: string;
}

interface OrderFormProps {
  orderItems: OrderItem[];
  onRemoveItem: (id: number, selectedSize?: any, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => void;
  onUpdateQuantity: (id: number, quantity: number, selectedSize?: any, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => void;
  onClearCart: () => void;
  onCloseMobileCart?: () => void;
  hideTitle?: boolean;
}

// Delivery zones with minimum order and delivery fee
const DELIVERY_ZONES = {
  'lutter': { label: 'Lutter am Barenberge', minOrder: 0, fee: 0 },
  'banteln': { label: 'Banteln', minOrder: 25, fee: 2.5 },
  'barfelde': { label: 'Barfelde', minOrder: 20, fee: 2.5 },
  'betheln': { label: 'Betheln', minOrder: 25, fee: 3 },
  'brueggen': { label: 'Brüggen', minOrder: 35, fee: 3 },
  'deinsen': { label: 'Deinsen', minOrder: 35, fee: 4 },
  'duingen': { label: 'Duingen', minOrder: 40, fee: 4 },
  'dunsen-gime': { label: 'Dunsen (Gime)', minOrder: 30, fee: 3 },
  'eime': { label: 'Eime', minOrder: 25, fee: 3 },
  'eitzum': { label: 'Eitzum', minOrder: 25, fee: 3 },
  'elze': { label: 'Elze', minOrder: 35, fee: 4 },
  'gronau': { label: 'Gronau', minOrder: 15, fee: 1.5 },
  'gronau-doetzum': { label: 'Gronau Dötzum', minOrder: 20, fee: 2 },
  'gronau-eddighausen': { label: 'Gronau Eddighausen', minOrder: 20, fee: 2.5 },
  'haus-escherde': { label: 'Haus Escherde', minOrder: 25, fee: 3 },
  'heinum': { label: 'Heinum', minOrder: 25, fee: 3 },
  'kolonie-godenau': { label: 'Kolonie Godenau', minOrder: 40, fee: 4 },
  'mehle-elze': { label: 'Mehle (Elze)', minOrder: 35, fee: 4 },
  'nienstedt': { label: 'Nienstedt', minOrder: 35, fee: 4 },
  'nordstemmen': { label: 'Nordstemmen', minOrder: 35, fee: 4 },
  'rheden-elze': { label: 'Rheden (Elze)', minOrder: 25, fee: 3 },
  'sibesse': { label: 'Sibesse', minOrder: 40, fee: 4 },
  'sorsum-elze': { label: 'Sorsum (Elze)', minOrder: 35, fee: 4 },
  'wallensted': { label: 'Wallensted', minOrder: 25, fee: 3 }
} as const;

// Form validation schema
const orderSchema = z.object({
  orderType: z.enum(['pickup', 'delivery']),
  deliveryZone: z.string().optional(),
  deliveryTime: z.enum(['asap', 'specific']),
  specificTime: z.string().optional(),
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  phone: z.string().min(10, 'Telefonnummer muss mindestens 10 Zeichen haben'),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  postcode: z.string().optional(),
  note: z.string().optional(),
}).refine((data) => {
  if (data.orderType === 'delivery') {
    return data.deliveryZone && data.street && data.houseNumber && data.postcode;
  }
  return true;
}, {
  message: 'Bei Lieferung sind Liefergebiet, Straße, Hausnummer und PLZ erforderlich',
  path: ['deliveryZone']
}).refine((data) => {
  if (data.deliveryTime === 'specific') {
    return data.specificTime;
  }
  return true;
}, {
  message: 'Bei spezifischer Zeit muss eine Uhrzeit angegeben werden',
  path: ['specificTime']
});

type OrderFormData = z.infer<typeof orderSchema>;

const OrderForm: React.FC<OrderFormProps> = ({ 
  orderItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart,
  onCloseMobileCart,
  hideTitle = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderType: 'pickup',
      deliveryTime: 'asap'
    }
  });

  const watchOrderType = watch('orderType');
  const watchDeliveryZone = watch('deliveryZone');
  const watchDeliveryTime = watch('deliveryTime');

  // Helper function to calculate item price including extras
  const calculateItemPrice = useCallback((item: OrderItem) => {
    let basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
    const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
    return basePrice + extrasPrice;
  }, []);

  // Calculate totals
  const { subtotal, deliveryFee, total, canOrder, minOrderMessage } = useMemo(() => {
    const subtotal = orderItems.reduce((sum, item) => {
      const itemPrice = calculateItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    let deliveryFee = 0;
    let canOrder = true;
    let minOrderMessage = '';

    if (watchOrderType === 'delivery' && watchDeliveryZone) {
      const zone = DELIVERY_ZONES[watchDeliveryZone as keyof typeof DELIVERY_ZONES];
      if (zone) {
        deliveryFee = zone.fee;
        if (subtotal < zone.minOrder) {
          canOrder = false;
          minOrderMessage = `Mindestbestellwert für ${zone.label}: ${zone.minOrder.toFixed(2).replace('.', ',')} €`;
        }
      }
    }

    const total = subtotal + deliveryFee;

    return { subtotal, deliveryFee, total, canOrder, minOrderMessage };
  }, [orderItems, watchOrderType, watchDeliveryZone, calculateItemPrice]);

  // Generate WhatsApp message
  const generateWhatsAppMessage = useCallback((data: OrderFormData) => {
    let message = `🍕 *Neue Bestellung - by Ali und Mesut*\n\n`;
    
    // Customer info
    message += `👤 *Kunde:* ${data.name}\n`;
    message += `📞 *Telefon:* ${data.phone}\n`;
    message += `📦 *Art:* ${data.orderType === 'pickup' ? 'Abholung' : 'Lieferung'}\n`;
    
    if (data.orderType === 'delivery' && data.deliveryZone) {
      const zone = DELIVERY_ZONES[data.deliveryZone as keyof typeof DELIVERY_ZONES];
      message += `📍 *Adresse:* ${data.street} ${data.houseNumber}, ${data.postcode}\n`;
      message += `🗺️ *Gebiet:* ${zone?.label}\n`;
    }
    
    message += `⏰ *Zeit:* ${data.deliveryTime === 'asap' ? 'So schnell wie möglich' : `Um ${data.specificTime} Uhr`}\n\n`;
    
    // Order items
    message += `🛒 *Bestellung:*\n`;
    orderItems.forEach(item => {
      let itemText = `${item.quantity}x Nr. ${item.menuItem.number} ${item.menuItem.name}`;
      
      if (item.selectedSize) {
        itemText += ` (${item.selectedSize.name}${item.selectedSize.description ? ` - ${item.selectedSize.description}` : ''})`;
      }
      
      if (item.selectedPastaType) {
        itemText += ` - Nudelsorte: ${item.selectedPastaType}`;
      }
      
      if (item.selectedSauce) {
        itemText += ` - Soße: ${item.selectedSauce}`;
      }
      
      if (item.selectedIngredients && item.selectedIngredients.length > 0) {
        itemText += ` - Zutaten: ${item.selectedIngredients.join(', ')}`;
      }
      
      if (item.selectedExtras && item.selectedExtras.length > 0) {
        itemText += ` - Extras: ${item.selectedExtras.join(', ')} (+${(item.selectedExtras.length * 1.00).toFixed(2).replace('.', ',')}€)`;
      }
      
      const itemTotal = (calculateItemPrice(item) * item.quantity).toFixed(2).replace('.', ',');
      itemText += ` = ${itemTotal} €`;
      
      message += `• ${itemText}\n`;
    });
    
    // Totals
    message += `\n💰 *Zwischensumme:* ${subtotal.toFixed(2).replace('.', ',')} €\n`;
    
    if (deliveryFee > 0) {
      message += `🚗 *Liefergebühr:* ${deliveryFee.toFixed(2).replace('.', ',')} €\n`;
    }
    
    message += `💳 *Gesamtbetrag:* ${total.toFixed(2).replace('.', ',')} €\n`;
    
    if (data.note) {
      message += `\n📝 *Anmerkung:* ${data.note}`;
    }
    
    return encodeURIComponent(message);
  }, [orderItems, subtotal, deliveryFee, total]);

  // Send email notification
  const sendEmailNotification = async (data: OrderFormData) => {
    try {
      const emailData = {
        orderType: data.orderType,
        deliveryZone: data.deliveryZone,
        deliveryTime: data.deliveryTime,
        specificTime: data.specificTime,
        name: data.name,
        phone: data.phone,
        street: data.street,
        houseNumber: data.houseNumber,
        postcode: data.postcode,
        note: data.note,
        orderItems,
        subtotal,
        deliveryFee,
        total
      };

      const response = await fetch('/api/send-order-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        console.warn('Email notification failed, but continuing with WhatsApp order');
      }
    } catch (error) {
      console.warn('Email notification error:', error);
    }
  };

  const onSubmit = async (data: OrderFormData) => {
    if (!canOrder || orderItems.length === 0) return;

    setIsSubmitting(true);
    
    try {
      // Send email notification
      try {
        const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-order-email`;
        await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderType: data.orderType,
            deliveryZone: data.deliveryZone,
            deliveryTime: data.deliveryTime,
            specificTime: data.specificTime,
            name: data.name,
            phone: data.phone,
            street: data.street,
            houseNumber: data.houseNumber,
            postcode: data.postcode,
            note: data.note,
            orderItems,
            subtotal,
            deliveryFee,
            total
          }),
        });
      } catch (error) {
        console.warn('Email notification error:', error);
      }
      
      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(data);
      const whatsappUrl = `https://wa.me/+4915771459166?text=${whatsappMessage}`;
      
      // Open WhatsApp
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      if (isMobile) {
        try {
          const whatsappWindow = window.open(whatsappUrl, '_blank');
          if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
            window.location.href = whatsappUrl;
          }
        } catch (error) {
          console.error('Error opening WhatsApp:', error);
          window.location.href = whatsappUrl;
        }
      } else {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }
      
      // Clear cart and form after successful order
      setTimeout(() => {
        onClearCart();
        reset();
      }, 1000);
      
    } catch (error) {
      console.error('Order submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuantityChange = useCallback((item: OrderItem, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(
        item.menuItem.id,
        item.selectedSize,
        item.selectedIngredients,
        item.selectedExtras,
        item.selectedPastaType,
        item.selectedSauce
      );
    } else {
      onUpdateQuantity(
        item.menuItem.id,
        newQuantity,
        item.selectedSize,
        item.selectedIngredients,
        item.selectedExtras,
        item.selectedPastaType,
        item.selectedSauce
      );
    }
  }, [onRemoveItem, onUpdateQuantity]);

  const handleRemoveItem = useCallback((item: OrderItem) => {
    onRemoveItem(
      item.menuItem.id,
      item.selectedSize,
      item.selectedIngredients,
      item.selectedExtras,
      item.selectedPastaType,
      item.selectedSauce
    );
  }, [onRemoveItem]);

  const handleClearCart = useCallback(() => {
    setIsClearing(true);
    
    // After 3 seconds, actually clear the cart
    setTimeout(() => {
      onClearCart();
      setIsClearing(false);
      
      // Close mobile cart if the callback is provided
      if (onCloseMobileCart) {
        onCloseMobileCart();
      }
    }, 3000);
  }, [onClearCart, onCloseMobileCart]);

  if (orderItems.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="mb-4">
          <ShoppingCart className="w-16 h-16 mx-auto text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Ihr Warenkorb ist leer</h3>
        <p className="text-gray-600">Fügen Sie Artikel aus dem Menü hinzu, um eine Bestellung aufzugeben.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-0 transition-all duration-2000 ${isClearing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {!hideTitle && (
        <div className="bg-orange-500 text-white p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Warenkorb
            </h2>
          </div>
          
          {/* Separate clear cart button with more spacing */}
          <div className="mt-4 pt-3 border-t border-orange-400/30">
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className={`flex items-center gap-2 text-orange-100 hover:text-white hover:bg-orange-600/50 transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Warenkorb leeren"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? 'Wird geleert...' : 'Warenkorb leeren'}
            </button>
          </div>
          
          {/* Separate clear cart button with more spacing */}
          <div className="mt-4 pt-3 border-t border-orange-400/30">
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className={`flex items-center gap-2 text-orange-100 hover:text-white hover:bg-orange-600/50 transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
              title="Warenkorb leeren"
            >
              <Trash2 className="w-4 h-4" />
              {isClearing ? 'Wird geleert...' : 'Warenkorb leeren'}
            </button>
          </div>
        </div>
      )}

      {/* Clear cart button for mobile when title is hidden */}
      {hideTitle && (
        <div className="bg-orange-500 text-white p-4 sticky top-0 z-10">
          <button
            onClick={handleClearCart}
            disabled={isClearing}
            className={`flex items-center gap-2 text-orange-100 hover:text-white hover:bg-orange-600/50 transition-all duration-200 px-3 py-2 rounded-lg text-sm font-medium w-full justify-center ${isClearing ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Warenkorb leeren"
          >
            <Trash2 className="w-4 h-4" />
            {isClearing ? 'Wird geleert...' : 'Warenkorb leeren'}
          </button>
        </div>
      )}

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Order Items */}
        <div className="space-y-3">
          {orderItems.map((item, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">
                    Nr. {item.menuItem.number} {item.menuItem.name}
                  </h4>
                  
                  {item.selectedSize && (
                    <p className="text-xs text-blue-600 mt-1">
                      Größe: {item.selectedSize.name}
                      {item.selectedSize.description && ` - ${item.selectedSize.description}`}
                    </p>
                  )}
                  
                  {item.selectedPastaType && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Nudelsorte: {item.selectedPastaType}
                    </p>
                  )}
                  
                  {item.selectedSauce && (
                    <p className="text-xs text-red-600 mt-1">
                      Soße: {item.selectedSauce}
                    </p>
                  )}
                  
                  {item.selectedIngredients && item.selectedIngredients.length > 0 && (
                    <p className="text-xs text-green-600 mt-1">
                      Zutaten: {item.selectedIngredients.join(', ')}
                    </p>
                  )}
                  
                  {item.selectedExtras && item.selectedExtras.length > 0 && (
                    <p className="text-xs text-purple-600 mt-1">
                      Extras: {item.selectedExtras.join(', ')} (+{(item.selectedExtras.length * 1.00).toFixed(2)}€)
                    </p>
                  )}
                  
                  <p className="text-sm font-bold text-orange-600 mt-2">
                    {(calculateItemPrice(item) * item.quantity).toFixed(2).replace('.', ',')} €
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <button
                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleRemoveItem(item)}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Zwischensumme:</span>
            <span className="font-medium">{subtotal.toFixed(2).replace('.', ',')} €</span>
          </div>
          
          {deliveryFee > 0 && (
            <div className="flex justify-between text-sm">
              <span>Liefergebühr:</span>
              <span className="font-medium">{deliveryFee.toFixed(2).replace('.', ',')} €</span>
            </div>
          )}
          
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold text-orange-600">
              <span>Gesamtbetrag:</span>
              <span>{total.toFixed(2).replace('.', ',')} €</span>
            </div>
          </div>
          
          {!canOrder && minOrderMessage && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {minOrderMessage}
            </div>
          )}
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Order Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Bestellart *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="pickup"
                  {...register('orderType')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">🏃‍♂️ Abholung</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="delivery"
                  {...register('orderType')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">🚗 Lieferung</span>
              </label>
            </div>
          </div>

          {/* Delivery Zone */}
          {watchOrderType === 'delivery' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Liefergebiet *
              </label>
              <select
                {...register('deliveryZone')}
                className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Bitte wählen...</option>
                {Object.entries(DELIVERY_ZONES).map(([key, zone]) => (
                  <option key={key} value={key}>
                    {zone.label} (Min. {zone.minOrder.toFixed(2).replace('.', ',')} €, +{zone.fee.toFixed(2).replace('.', ',')} € Liefergebühr)
                  </option>
                ))}
              </select>
              {errors.deliveryZone && (
                <p className="text-sm text-red-600">{errors.deliveryZone.message}</p>
              )}
            </div>
          )}

          {/* Delivery Address */}
          {watchOrderType === 'delivery' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Straße *
                </label>
                <input
                  type="text"
                  {...register('street')}
                  className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Musterstraße"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hausnummer *
                </label>
                <input
                  type="text"
                  {...register('houseNumber')}
                  className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="123"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postleitzahl *
                </label>
                <input
                  type="text"
                  {...register('postcode')}
                  className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="12345"
                />
              </div>
            </div>
          )}

          {/* Delivery Time */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Lieferzeit *
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="asap"
                  {...register('deliveryTime')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">⚡ So schnell wie möglich</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  value="specific"
                  {...register('deliveryTime')}
                  className="text-orange-500 focus:ring-orange-500"
                />
                <span className="text-sm">🕐 Zu bestimmter Zeit</span>
              </label>
            </div>
            
            {watchDeliveryTime === 'specific' && (
              <input
                type="time"
                {...register('specificTime')}
                className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                min="12:00"
                max="21:30"
              />
            )}
            {errors.specificTime && (
              <p className="text-sm text-red-600">{errors.specificTime.message}</p>
            )}
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Ihre Kontaktdaten
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Ihr Name"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefonnummer *
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="0123 456789"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anmerkungen (optional)
              </label>
              <textarea
                {...register('note')}
                rows={3}
                className="w-full rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                placeholder="Besondere Wünsche, Allergien, etc."
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!canOrder || orderItems.length === 0 || isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
              canOrder && orderItems.length > 0 && !isSubmitting
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Bestellung wird gesendet...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Per WhatsApp bestellen
              </>
            )}
          </button>
        </form>
        
        {/* Bottom padding for mobile safe area */}
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default OrderForm;