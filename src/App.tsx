import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import MenuSection from './components/MenuSection';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import OrderForm from './components/OrderForm';
import {
  salads,
  dips,
  drinks,
  fleischgerichte,
  pizzas,
  snacks,
  vegetarischeGerichte,
  croques,
} from './data/menuItems';
import { useCartStore } from './store/cart.store';
import { ShoppingCart, ChevronUp, ChevronDown, X } from 'lucide-react';
import { MenuItem, PizzaSize } from './types';

// =================== CONSTANTS ===================
const SCROLL_CONFIG = {
  DELAY: 100,
  NAVBAR_HEIGHT: 140,
  MOBILE_OFFSET: 120,
  DESKTOP_OFFSET: 50,
  ANIMATION_DURATION: 1500,
  MOBILE_BREAKPOINT: 1024
};

const CONTACT_INFO = {
  PHONE: '01577 1459166',
  WHATSAPP_URL: 'https://wa.me/+4915771459166'
};

const CART_SELECTORS = [
  '[data-cart-section="true"]',
  'div[class*="Ihre Bestellung"]',
  '.lg\\:sticky',
  '#cart'
];

const BUTTON_CLASSES = {
  whatsapp: 'bg-gradient-to-r from-green-400 via-emerald-500 via-green-500 to-teal-400 text-white py-2 sm:py-3 md:py-4 px-2 sm:px-3 md:px-4 relative overflow-hidden group shadow-lg',
  cart: 'fixed top-2 sm:top-3 md:top-4 right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 hover:scale-110 active:scale-95 transition-all duration-300 ease-out drop-shadow-lg border-2 border-white/80 rounded-xl p-1.5 sm:p-2 md:p-2.5 bg-white/10 backdrop-blur-sm group/cart cursor-pointer z-50',
  scrollButton: 'fixed right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 border-2 border-white/50 hover:scale-110 active:scale-95'
};

const MENU_SECTIONS = {
  PIZZA: 'pizza',
  FLEISCHGERICHTE: 'fleischgerichte',
  SNACKS: 'snacks',
  VEGETARISCHE_GERICHTE: 'vegetarische-gerichte',
  CROQUES: 'croques',
  SALATE: 'salate',
  DIPS: 'dips',
  GETRAENKE: 'getraenke'
};

// =================== UTILITY FUNCTIONS ===================
const isDevelopment = process.env.NODE_ENV === 'development';

const debugLog = (message, data) => {
  if (isDevelopment) {
    console.log(message, data);
  }
};

function App() {
  // =================== STORE STATE ===================
  const items = useCartStore(state => state.items);
  const addItem = useCartStore(state => state.addItem);
  const removeItem = useCartStore(state => state.removeItem);
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const clearCart = useCartStore(state => state.clearCart);

  // =================== LOCAL STATE ===================
  const [isMobile, setIsMobile] = useState(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // =================== EFFECTS ===================
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < SCROLL_CONFIG.MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll detection for showing/hiding scroll buttons
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollButtons(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debug logging for menu items
  useEffect(() => {
    console.log('App: Menu items loaded:', {
      pizzas: pizzas.length,
      fleischgerichte: fleischgerichte.length,
      snacks: snacks.length,
      salads: salads.length,
      dips: dips.length,
      drinks: drinks.length
    });
  }, []);

  // =================== MEMOIZED VALUES ===================
  const totalItemsCount = useMemo(() => 
    items.reduce((sum, item) => sum + item.quantity, 0), 
    [items]
  );

  // =================== HELPER FUNCTIONS ===================
  const findCartElement = useCallback(() => {
    for (const selector of CART_SELECTORS) {
      try {
        const element = document.querySelector(selector);
        if (element) {
          debugLog('Cart element found with selector:', selector);
          return element;
        }
      } catch (error) {
        console.warn(`Selector failed: ${selector}`, error);
      }
    }

    // Fallback: Search by text content
    try {
      const allElements = document.querySelectorAll('*');
      for (let element of allElements) {
        if (element.textContent && element.textContent.includes('Ihre Bestellung')) {
          const container = element.closest('div') || element;
          debugLog('Cart element found by text search:', container);
          return container;
        }
      }
    } catch (error) {
      console.warn('Text search failed:', error);
    }

    // Last resort: Grid container's last column
    try {
      const gridContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-3');
      if (gridContainer && gridContainer.children.length > 0) {
        const lastColumn = gridContainer.children[gridContainer.children.length - 1];
        debugLog('Cart element found as grid last column:', lastColumn);
        return lastColumn;
      }
    } catch (error) {
      console.warn('Grid search failed:', error);
    }

    return null;
  }, []);

  const calculateScrollPosition = useCallback((element) => {
    try {
      const navbar = document.querySelector('.fixed.top-0');
      const navbarHeight = navbar ? navbar.offsetHeight : SCROLL_CONFIG.NAVBAR_HEIGHT;
      const extraOffset = isMobile ? SCROLL_CONFIG.MOBILE_OFFSET : SCROLL_CONFIG.DESKTOP_OFFSET;
      
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const finalPosition = rect.top + scrollTop - navbarHeight - extraOffset;
      
      debugLog('Scroll calculation:', {
        navbarHeight,
        extraOffset,
        isMobile,
        finalPosition
      });
      
      return Math.max(0, finalPosition);
    } catch (error) {
      console.error('Scroll position calculation failed:', error);
      return 0;
    }
  }, [isMobile]);

  const animateCartHighlight = useCallback((element) => {
    try {
      if (!element) return;

      const animations = {
        transition: 'all 0.8s ease-in-out',
        transform: 'scale(1.05)',
        boxShadow: '0 25px 50px rgba(239, 68, 68, 0.3)',
        border: '4px solid #ef4444',
        borderRadius: '20px',
        backgroundColor: 'rgba(239, 68, 68, 0.08)'
      };

      // Apply animations
      Object.assign(element.style, animations);

      // Reset animations
      setTimeout(() => {
        try {
          Object.assign(element.style, {
            transform: 'scale(1)',
            boxShadow: 'none',
            border: '4px solid transparent',
            backgroundColor: 'transparent'
          });
        } catch (resetError) {
          console.warn('Animation reset failed:', resetError);
        }
      }, SCROLL_CONFIG.ANIMATION_DURATION);

      debugLog('✅ Cart highlight animation applied');
    } catch (error) {
      console.error('Animation failed:', error);
    }
  }, []);

  const performFallbackScroll = useCallback(() => {
    try {
      const pageHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const scrollPosition = Math.max(0, pageHeight - windowHeight - 200);
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
      
      debugLog('Fallback scroll executed:', scrollPosition);
    } catch (error) {
      console.error('Fallback scroll failed:', error);
    }
  }, []);

  // =================== SCROLL FUNCTIONS ===================
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }, []);

  // =================== MAIN SCROLL FUNCTION ===================
  const scrollToCart = useCallback((e) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      debugLog('Cart scroll initiated...');
      
      setTimeout(() => {
        try {
          const cartElement = findCartElement();
          
          if (cartElement) {
            const scrollPosition = calculateScrollPosition(cartElement);
            
            window.scrollTo({
              top: scrollPosition,
              behavior: 'smooth'
            });
            
            animateCartHighlight(cartElement);
            debugLog('✅ Scroll completed successfully!');
          } else {
            console.error('❌ Cart element not found!');
            performFallbackScroll();
          }
        } catch (scrollError) {
          console.error('Scroll execution failed:', scrollError);
          performFallbackScroll();
        }
      }, SCROLL_CONFIG.DELAY);
    } catch (error) {
      console.error('ScrollToCart failed:', error);
    }
  }, [findCartElement, calculateScrollPosition, animateCartHighlight, performFallbackScroll]);

  // =================== MEMOIZED CALLBACKS ===================
  const memoizedAddItem = useCallback((menuItem: MenuItem, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    addItem(menuItem, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
  }, [addItem]);

  const memoizedRemoveItem = useCallback((id: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    removeItem(id, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
  }, [removeItem]);

  const memoizedUpdateQuantity = useCallback((id: number, quantity: number, selectedSize?: PizzaSize, selectedIngredients?: string[], selectedExtras?: string[], selectedPastaType?: string, selectedSauce?: string) => {
    updateQuantity(id, quantity, selectedSize, selectedIngredients, selectedExtras, selectedPastaType, selectedSauce);
  }, [updateQuantity]);

  const memoizedClearCart = useCallback(() => {
    clearCart();
  }, [clearCart]);

  // =================== MOBILE CART FUNCTIONS ===================
  const toggleMobileCart = useCallback(() => {
    setShowMobileCart(prev => !prev);
  }, []);

  const closeMobileCart = useCallback(() => {
    setShowMobileCart(false);
  }, []);

  // Close mobile cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileCart && isMobile) {
        const cartElement = document.getElementById('mobile-cart-sidebar');
        const buttonElement = document.getElementById('mobile-cart-button');
        
        if (cartElement && buttonElement && 
            !cartElement.contains(event.target as Node) && 
            !buttonElement.contains(event.target as Node)) {
          setShowMobileCart(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMobileCart, isMobile]);

  // =================== RENDER HELPER FUNCTIONS ===================
  const renderAnimatedBackground = () => (
    <div className='absolute inset-0 opacity-30'>
      <div className='absolute inset-0 bg-gradient-to-r from-yellow-300/20 via-pink-300/20 to-blue-300/20 animate-pulse'></div>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1500 ease-out'></div>
    </div>
  );

  const renderFloatingParticles = () => (
    <div className='absolute inset-0 overflow-hidden pointer-events-none'>
      <div className='absolute top-2 left-[10%] w-1 h-1 bg-yellow-300 rounded-full animate-bounce opacity-70' 
           style={{animationDelay: '0s', animationDuration: '2s'}}></div>
      <div className='absolute top-4 right-[15%] w-1.5 h-1.5 bg-pink-300 rounded-full animate-bounce opacity-60' 
           style={{animationDelay: '0.5s', animationDuration: '2.5s'}}></div>
      <div className='absolute bottom-3 left-[20%] w-1 h-1 bg-blue-300 rounded-full animate-bounce opacity-80' 
           style={{animationDelay: '1s', animationDuration: '1.8s'}}></div>
      <div className='absolute bottom-2 right-[25%] w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce opacity-50' 
           style={{animationDelay: '1.5s', animationDuration: '2.2s'}}></div>
    </div>
  );

  const renderWhatsAppIcon = () => (
    <div className='relative flex-shrink-0'>
      <div className='relative animate-bounce'>
        <svg
          viewBox='0 0 24 24'
          className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ease-out filter drop-shadow-lg'
          fill='currentColor'
          aria-hidden="true"
        >
          <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' />
        </svg>
        
        <div className='absolute inset-0 rounded-full border-2 border-white/50 animate-ping'></div>
        <div className='absolute inset-0 rounded-full border-2 border-yellow-300/60 animate-ping' 
             style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className='absolute -top-1 -right-1 text-xs animate-bounce' 
           style={{animationDelay: '0.2s'}}>🎉</div>
    </div>
  );

  const renderWhatsAppButton = () => (
    <div className={BUTTON_CLASSES.whatsapp}>
      {renderAnimatedBackground()}
      {renderFloatingParticles()}

      <a
        href={CONTACT_INFO.WHATSAPP_URL}
        onClick={(e) => {
          e.preventDefault();
          const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          
          if (isMobile) {
            try {
              const whatsappWindow = window.open(CONTACT_INFO.WHATSAPP_URL, '_blank');
              if (!whatsappWindow || whatsappWindow.closed || typeof whatsappWindow.closed === 'undefined') {
                window.location.href = CONTACT_INFO.WHATSAPP_URL;
              }
            } catch (error) {
              console.error('Error opening WhatsApp:', error);
              itemText += ` - Extras: ${item.selectedExtras.join(', ')} (+${(item.selectedExtras.length * 1.00).toFixed(2)}€)`;
            }
          } else {
            window.open(CONTACT_INFO.WHATSAPP_URL, '_blank', 'noopener,noreferrer');
          }
        }}
        className='flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl hover:text-green-100 transition-all w-full text-center px-1 sm:px-2 group relative z-10'
        aria-label="Jetzt per WhatsApp bestellen"
        role="button"
      >
        {renderWhatsAppIcon()}

        <div className='flex flex-col items-center justify-center gap-0.5 sm:gap-1 min-w-0 flex-1 text-center'>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 w-full'>
            <span className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-extrabold tracking-wide group-hover:tracking-wider transition-all duration-300 whitespace-nowrap transform group-hover:scale-105 drop-shadow-md text-center'>
              Jetzt bestellen! 🍕
            </span>
            <span className='text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold tracking-wide group-hover:tracking-wider transition-all duration-300 whitespace-nowrap transform group-hover:scale-105 bg-white/20 px-1 sm:px-2 py-0.5 rounded-full backdrop-blur-sm text-center mx-auto sm:mx-0'>
              📞 {CONTACT_INFO.PHONE}
            </span>
          </div>
          
          <div className='text-xs sm:text-xs md:text-sm opacity-90 animate-pulse font-medium text-center'>
            Klick für leckeres Essen! 🚀
          </div>
        </div>
      </a>
    </div>
  );

  const renderCartButton = () => (
    <button
      onClick={scrollToCart}
      type="button"
      aria-label={`Warenkorb anzeigen. ${totalItemsCount} Artikel`}
      aria-describedby="cart-count"
      className={BUTTON_CLASSES.cart}
    >
      <ShoppingCart className='w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover/cart:animate-bounce' aria-hidden="true" />
      
      <span id="cart-count" className="sr-only">
        {totalItemsCount} Artikel im Warenkorb
      </span>
      
      {totalItemsCount > 0 ? (
        <span 
          className='absolute -bottom-1 -right-1 px-1 sm:px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs font-bold min-w-[1.25rem] sm:min-w-[1.5rem] h-5 sm:h-6 flex justify-center items-center animate-bounce border-2 border-white shadow-lg'
          aria-hidden="true"
        >
          {totalItemsCount}
        </span>
      ) : (
        <div 
          className='absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full animate-ping opacity-75'
          aria-hidden="true"
        ></div>
      )}
    </button>
  );

  const renderScrollButtons = () => (
    showScrollButtons && (
      <div className="fixed right-2 sm:right-4 md:right-6 lg:right-8 xl:right-12 bottom-20 sm:bottom-24 flex flex-col gap-2 z-40">
        <button
          onClick={scrollToTop}
          className={BUTTON_CLASSES.scrollButton}
          aria-label="Nach oben scrollen"
          title="Nach oben scrollen"
        >
          <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={scrollToBottom}
          className={BUTTON_CLASSES.scrollButton}
          aria-label="Nach unten scrollen"
          title="Nach unten scrollen"
        >
          <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    )
  );

  const renderMobileCartButton = () => (
    isMobile && (
      <button
        id="mobile-cart-button"
        onClick={toggleMobileCart}
        className="fixed bottom-4 left-4 right-4 bg-orange-500 hover:bg-orange-600 text-white py-4 px-6 rounded-xl shadow-lg flex items-center justify-between z-50 transition-all duration-300 transform hover:scale-105"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="w-6 h-6" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="font-semibold text-lg">
            {totalItemsCount > 0 ? 'Warenkorb ansehen' : 'Warenkorb leer'}
          </span>
        </div>
        {totalItemsCount > 0 && (
          <span className="font-bold text-lg">
            {items.reduce((sum, item) => {
              const basePrice = item.selectedSize ? item.selectedSize.price : item.menuItem.price;
              const extrasPrice = (item.selectedExtras?.length || 0) * 1.00;
              return sum + ((basePrice + extrasPrice) * item.quantity);
            }, 0).toFixed(2).replace('.', ',')} €
          </span>
        )}
      </button>
    )
  );

  const renderMobileCartSidebar = () => (
    isMobile && showMobileCart && (
      <>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMobileCart}
        />
        
        {/* Mobile Cart Sidebar */}
        <div 
          id="mobile-cart-sidebar"
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50 max-h-[85vh] flex flex-col animate-slide-up"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-orange-500 text-white rounded-t-xl flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Warenkorb ({totalItemsCount})
            </h2>
            <button
              onClick={closeMobileCart}
              className="p-2 hover:bg-orange-600 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <OrderForm
              orderItems={items}
              onRemoveItem={memoizedRemoveItem}
              onUpdateQuantity={memoizedUpdateQuantity}
              onClearCart={memoizedClearCart}
            />
          </div>
        </div>
      </>
    )
  );

  const renderMenuSection = useCallback((id, title, description, items, subTitle) => {
    console.log(`Rendering section ${id}:`, { title, itemsCount: items?.length || 0 });
    
    return (
      <div key={id} id={id} className='scroll-mt-[6.5rem]'>
        <MenuSection
          title={title}
          description={description}
          subTitle={subTitle}
          items={items || []}
          bgColor='bg-orange-500'
          onAddToOrder={memoizedAddItem}
        />
      </div>
    );
  }, [memoizedAddItem]);

  // =================== MAIN RENDER ===================
  return (
    <div className='min-h-dvh bg-gray-50'>
      <div className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
        {renderWhatsAppButton()}
        <Navigation />
      </div>

      {/* Desktop Cart Sidebar */}
      <div className='hidden lg:block fixed top-0 right-0 w-80 h-full bg-white shadow-xl z-40 pt-32 overflow-y-auto'>
        <OrderForm
          orderItems={items}
          onRemoveItem={memoizedRemoveItem}
          onUpdateQuantity={memoizedUpdateQuantity}
          onClearCart={memoizedClearCart}
        />
      </div>

      <div className='pt-32 lg:pr-80'>
        <Header />

        <main className='container mx-auto px-6 py-6 max-w-5xl'>
          <div className='space-y-6'>
              {renderMenuSection(
                MENU_SECTIONS.FLEISCHGERICHTE,
                'Fleischgerichte',
                'nach Art eines Drehspießes (Erzeugnis eigener Art)\nAlle Fleischgerichte werden mit Eisbergsalat, Tomaten, Gurken, Zwiebeln und einer Soße Ihrer Wahl zubereitet.',
                fleischgerichte
              )}

              {renderMenuSection(
                MENU_SECTIONS.SNACKS,
                'Snacks',
                'Alle Burger werden mit frischem Salat, Ketchup und Burger-Dressing serviert.',
                snacks
              )}

              {renderMenuSection(
                MENU_SECTIONS.VEGETARISCHE_GERICHTE,
                'Vegetarische Gerichte',
                'Leckere vegetarische Pizzen und Gerichte ohne Fleisch',
                vegetarischeGerichte
              )}

              {renderMenuSection(
                MENU_SECTIONS.PIZZA,
                'Pizza',
                'Klassische Pizzen mit Fleisch - Alle Pizzen werden mit Tomatensoße und Käse zubereitet. Wählen Sie Ihre gewünschte Größe.',
                pizzas
              )}

              {renderMenuSection(
                'croques',
                'Croques',
                'Alle Croques werden mit Käse, Salat & Soße zubereitet.',
                croques
              )}

              {renderMenuSection(
                MENU_SECTIONS.SALATE,
                'Salate',
                'Alle Salate werden mit einem Dressing nach Wahl zubereitet!\n(z. B. Joghurt-, Balsamico- oder Essig-Öl-Dressing)',
                salads
              )}

              <div id={MENU_SECTIONS.DIPS} className='scroll-mt-[6.5rem]'>
                <MenuSection
                  title='Dips & Soßen'
                  items={dips}
                  bgColor='bg-orange-500'
                  onAddToOrder={memoizedAddItem}
                />
              </div>

              <div id={MENU_SECTIONS.GETRAENKE} className='scroll-mt-[6.5rem]'>
                <MenuSection
                  title='Getränke'
                  description='Der Verkauf von alkoholischen Getränken erfolgt gemäß dem Jugendschutzgesetz (JuSchG) nur an Personen ab 18 Jahren. Bitte halten Sie einen gültigen Ausweis bereit!'
                  items={drinks}
                  bgColor='bg-orange-500'
                  onAddToOrder={memoizedAddItem}
                />
              </div>
            </div>
          
          {/* Add bottom padding for mobile cart button */}
          <div className="h-24 lg:hidden" />
        </main>

        <Footer />
      </div>

      {renderScrollButtons()}
      {renderMobileCartButton()}
      {renderMobileCartSidebar()}
    </div>
  );
}

export default App;