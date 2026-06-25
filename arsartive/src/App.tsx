/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Search, 
  Plus, 
  MessageCircle, 
  User, 
  Bell, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Settings, 
  MoreHorizontal,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle2,
  Check,
  Brush,
  PenTool,
  Grid,
  History,
  ShoppingBag,
  Palette,
  Camera,
  Layout,
  Play,
  X,
  Send,
  MoreVertical,
  LogOut,
  Trash2,
  Shield,
  UserRound,
  HelpCircle,
  Lock,
  Mail,
  Info,
  Clock
} from 'lucide-react';
import { cn } from './lib/utils';

// --- Types ---
type Screen = 
  | 'SPLASH' 
  | 'ONBOARDING' 
  | 'AUTH_LOGIN' 
  | 'AUTH_SIGNUP' 
  | 'AUTH_VERIFY' 
  | 'AUTH_FORGOT' 
  | 'HOME' 
  | 'EXPLORE' 
  | 'MY_BUSINESS' 
  | 'MESSAGES' 
  | 'PROFILE'
  | 'REACTIONS'
  | 'UPLOAD'
  | 'UPLOAD_PREVIEW'
  | 'NOTIFICATIONS'
  | 'SETUP_PROFILE'
  | 'SETTINGS_PRIVACY'
  | 'SETTINGS_EDIT_PROFILE'
  | 'SETTINGS_HELP'
  | 'SETTINGS_SECURITY'
  | 'BUSINESS_ANALYTICS'
  | 'CHAT'
  | 'OTHER_PROFILE';

// --- Shared Mock State ---
interface SharedData {
  user: {
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
  viewerCurrency: string;
  upload: {
    name: string;
    description: string;
    isForSale: boolean;
    price: string;
    currency: string;
    materials: string;
    showPrice: boolean;
    tags: string[];
    contentType: 'POST' | 'REEL';
    reelDuration?: number;
    photoCount?: number;
    images?: string[];
  };
  posts: any[];
  activeChat: any | null;
  activeProfile: any | null;
}

// --- Components ---

const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex flex-col items-center justify-center", className)}>
    <div className="relative">
      <Brush className="w-12 h-12 text-brand-terracotta -rotate-12" />
      <PenTool className="w-12 h-12 text-brand-terracotta absolute top-0 -right-2 rotate-12" />
    </div>
    <span className="text-3xl font-display font-bold text-brand-terracotta mt-2 tracking-tight">Arsartive</span>
  </div>
);

const Button = ({ 
  children, 
  className, 
  variant = 'primary',
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  onClick?: () => void;
}) => {
  const v = {
    primary: "bg-brand-terracotta text-white",
    secondary: "bg-brand-beige text-brand-terracotta",
    ghost: "bg-transparent text-brand-terracotta",
    outline: "border-2 border-brand-terracotta text-brand-terracotta"
  };
  return (
    <button 
      onClick={onClick}
      className={cn("w-full py-4 rounded-2xl font-semibold transition-transform active:scale-95", v[variant], className)}
    >
      {children}
    </button>
  );
};

const Input = ({ 
  label, 
  placeholder, 
  type = 'text',
  showPasswordToggle = false,
  defaultValue,
  onChange
}: { 
  label: string; 
  placeholder: string; 
  type?: string;
  showPasswordToggle?: boolean;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full space-y-1.5">
      <label className="text-xs font-semibold text-brand-dark/60 ml-1">{label}</label>
      <div className="relative">
        <input 
          type={show ? 'text' : type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          onChange={onChange}
          className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none placeholder:text-brand-dark/30"
        />
        {showPasswordToggle && (
          <button 
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-dark/40"
          >
            {show ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

const BottomNav = ({ active, setScreen, onActiveClick }: { active: Screen, setScreen: (s: Screen) => void, onActiveClick?: () => void }) => {
  const navItems: { s: Screen, i: any, label: string }[] = [
    { s: 'HOME', i: Grid, label: 'Home' },
    { s: 'EXPLORE', i: Search, label: 'Explore' },
    { s: 'UPLOAD', i: Plus, label: 'Upload' },
    { s: 'MESSAGES', i: MessageCircle, label: 'Messages' },
    { s: 'PROFILE', i: User, label: 'Profile' },
  ];

  const handleClick = (s: Screen) => {
    if (s === active && onActiveClick) {
      onActiveClick();
    } else {
      setScreen(s);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-brand-cream border-t border-brand-beige flex items-center justify-around px-2 z-50">
      {navItems.map(({ s, i: Icon, label }) => {
        const isActive = active === s;
        if (s === 'UPLOAD') {
          return (
            <button key={s} onClick={() => setScreen(s)} className="bg-brand-terracotta text-white p-3 rounded-2xl shadow-lg -mt-8">
              <Icon size={24} />
            </button>
          );
        }
        return (
          <button 
            key={s} 
            onClick={() => handleClick(s)} 
            className={cn("flex flex-col items-center space-y-1 transition-colors", isActive ? "text-brand-terracotta" : "text-brand-dark/40")}
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- Screen Components ---

const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-brand-cream flex items-center justify-center"
    >
      <Logo />
    </motion.div>
  );
};

const OnboardingScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Explore unique arts and crafts",
      desc: "Browse and buy directly from talented artisans.",
      img: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Build your own craft business",
      desc: "List your creations, connect with buyers, and grow your side business.",
      img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="p-8 h-full flex flex-col justify-between"
    >
      <div className="mt-8 flex justify-center">
        <Logo className="scale-75" />
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64 mb-12">
          <div className="absolute inset-0 bg-brand-tan rounded-full scale-105 opacity-20 blur-xl" />
          <div className="w-full h-full rounded-full border-2 border-brand-beige p-1 overflow-hidden">
            <img 
              src={steps[step].img} 
              className="w-full h-full object-cover rounded-full" 
              alt="Art"
            />
          </div>
          {/* Decorative icons */}
          <div className="absolute -top-4 -right-4 bg-brand-cream p-3 rounded-full shadow-md border border-brand-beige">
            <Palette className="w-6 h-6 text-brand-terracotta" />
          </div>
          <div className="absolute -bottom-2 -left-4 bg-brand-cream p-3 rounded-full shadow-md border border-brand-beige">
            <Brush className="w-6 h-6 text-brand-terracotta" />
          </div>
        </div>

        <div className="text-center space-y-3 px-4">
          <h1 className="text-2xl font-display font-bold text-brand-dark leading-tight">{steps[step].title}</h1>
          <p className="text-brand-dark/50 text-sm leading-relaxed">{steps[step].desc}</p>
        </div>

        <div className="flex space-x-1.5 mt-8">
          {[0, 1].map(i => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-brand-terracotta" : "w-1.5 bg-brand-beige")} />
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Button onClick={() => {
          if (step < steps.length - 1) setStep(step + 1);
          else setScreen('AUTH_LOGIN');
        }}>
          {step === steps.length - 1 ? 'Get Started' : 'Continue'}
        </Button>
        <Button variant="ghost" onClick={() => setScreen('AUTH_LOGIN')}>Sign in</Button>
      </div>
    </motion.div>
  );
};

const LoginScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div 
      initial={{ x: 300, opacity: 0 }} 
      animate={{ x: 0, opacity: 1 }}
      className="p-8 h-full space-y-8"
    >
      <button onClick={() => setScreen('ONBOARDING')} className="bg-brand-beige p-3 rounded-2xl text-brand-dark">
        <ArrowLeft size={20} />
      </button>

      <div className="space-y-1">
        <h1 className="text-3xl font-display font-bold tracking-tight">Welcome Back 👋</h1>
        <p className="text-brand-dark/50 text-sm">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        <Input label="Email" placeholder="Your email" />
        <Input label="Password" placeholder="Your password" type="password" showPasswordToggle />
        <div className="flex justify-end">
          <button onClick={() => setScreen('AUTH_FORGOT')} className="text-xs font-semibold text-brand-terracotta">Forgot Password?</button>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <Button onClick={() => setScreen('SETUP_PROFILE')}>Login</Button>
        <div className="flex items-center justify-center space-x-1 text-xs">
          <span className="text-brand-dark/50">Don’t have an account?</span>
          <button onClick={() => setScreen('AUTH_SIGNUP')} className="text-brand-terracotta font-bold">Sign Up</button>
        </div>
      </div>

      <div className="relative pt-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-brand-beige"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-3 bg-brand-cream text-brand-dark/40 font-medium">Or with</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="flex items-center justify-center space-x-2 py-3 border-brand-beige bg-white/50">
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
          <span className="text-xs">Sign in with Google</span>
        </Button>
        <Button variant="outline" className="flex items-center justify-center space-x-2 py-3 border-brand-beige bg-white/50">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.51 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702z"/></svg>
          <span className="text-xs tracking-wide">Sign in with Apple</span>
        </Button>
      </div>
    </motion.div>
  );
};

const SignupScreen = ({ setScreen, setSharedData }: { setScreen: (s: Screen) => void, setSharedData: any, key?: string }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });

  const handleRegister = () => {
    setSharedData((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        firstName: formData.firstName || 'Ananya',
        lastName: formData.lastName || 'Sharma',
        username: formData.username || 'ananya_crafts'
      }
    }));
    setScreen('AUTH_VERIFY');
  };

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-8 h-full space-y-6 overflow-y-auto no-scrollbar">
      <button onClick={() => setScreen('AUTH_LOGIN')} className="bg-brand-beige p-3 rounded-2xl">
        <ArrowLeft size={20} />
      </button>
      <div>
        <h1 className="text-3xl font-display font-bold">Sign Up</h1>
        <p className="text-brand-dark/50 text-sm">Create account to start craft journey</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-dark/60 ml-1">First Name</label>
            <input 
              placeholder="Ananya" 
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-dark/60 ml-1">Last Name</label>
            <input 
              placeholder="Sharma" 
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-dark/60 ml-1">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xs font-bold transition-all">@</span>
            <input 
              placeholder="username" 
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 pl-8 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>
        <Input label="Email" placeholder="Your email" />
        <Input label="Password" placeholder="Your password" type="password" showPasswordToggle />
      </div>
      <Button onClick={handleRegister}>Register</Button>
      <div className="text-center text-xs">
        <span className="text-brand-dark/50">Have an account? </span>
        <button onClick={() => setScreen('AUTH_LOGIN')} className="text-brand-terracotta font-bold underline">Sign In</button>
      </div>
      <p className="text-[10px] text-center text-brand-dark/40 px-4 leading-relaxed">
        By clicking register, you agree to our <span className="font-bold">Terms</span> and <span className="font-bold">Privacy Policy</span>
      </p>
    </motion.div>
  );
};

const VerifyScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-8 h-full flex flex-col justify-between">
      <div className="space-y-6">
        <button onClick={() => setScreen('AUTH_SIGNUP')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-display font-bold">Verification Email</h1>
          <p className="text-brand-dark/50 text-sm px-6">Please enter the code we just sent to email <span className="font-bold text-brand-dark">anarya@gmail.com</span></p>
        </div>
        <div className="grid grid-cols-4 gap-3 pt-4">
          {[2, 8, 5, 1].map((n, i) => (
            <div key={i} className="aspect-square bg-brand-beige/50 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 border-brand-beige">
              {n}
            </div>
          ))}
        </div>
        <div className="text-center text-xs">
          <span className="text-brand-dark/50 font-medium">If you didn’t number a code? </span>
          <button className="text-brand-terracotta font-bold">Resend</button>
        </div>
        <Button onClick={() => setScreen('SETUP_PROFILE')} className="mt-4">Continue</Button>
      </div>

      {/* Numeric Keypad Component */}
      <div className="grid grid-cols-3 gap-y-6 pt-12">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'DEL'].map((k, i) => (
          <button key={i} className="text-2xl font-semibold text-brand-dark h-12 flex items-center justify-center active:bg-brand-beige rounded-full">
            {k === 'DEL' ? <X /> : k}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  NPR: 'रु',
  GBP: '£',
  EUR: '€'
};

const EXCHANGE_RATES: Record<string, number> = {
  INR: 83.5,
  USD: 1,
  NPR: 133.5,
  GBP: 0.79,
  EUR: 0.92
};

const convertPrice = (amount: string | number, from: string, to: string) => {
  const value = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  if (isNaN(value)) return '0';
  
  // Convert to USD first (base)
  const usdValue = value / EXCHANGE_RATES[from];
  // Convert from USD to target
  const targetValue = usdValue * EXCHANGE_RATES[to];
  
  return targetValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

const PriceDisplay = ({ amount, from, to, showLabel = true }: { amount: string | number, from: string, to: string, showLabel?: boolean }) => {
  const convertedValue = convertPrice(amount, from, to);
  return (
    <div className="inline-flex items-center space-x-1">
      <span className="text-inherit opacity-40 font-bold">{CURRENCY_SYMBOLS[to]}</span>
      <span className="font-bold">{convertedValue}</span>
      {showLabel && from !== to && (
        <span className="text-[8px] opacity-30 font-medium ml-1">approx.</span>
      )}
    </div>
  );
};

const HomeScreen = ({ setScreen, navigateToProfile, sharedData, setSharedData }: { setScreen: (s: Screen) => void, navigateToProfile?: (u: any) => void, sharedData: SharedData, setSharedData: any, key?: string }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stories = [
    { title: 'Your story', icon: <Plus size={20} />, active: false },
    { title: 'Art App', img: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200' },
    { title: 'Craft Life', img: 'https://images.unsplash.com/photo-1544413647-ad3474d0819a?auto=format&fit=crop&q=80&w=200' },
    { title: 'Clay Love', img: 'https://images.unsplash.com/photo-1565193998248-d50c1c8a149c?auto=format&fit=crop&q=80&w=200' },
    { title: 'Wooden', img: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=200' },
  ];

  const toggleLike = (id: number) => {
    setSharedData((prev: any) => ({
      ...prev,
      posts: prev.posts.map((p: any) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p)
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto no-scrollbar pb-24"
    >
      {/* Top Header */}
      <div className="p-6 flex items-center justify-between sticky top-0 bg-brand-cream/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-3">
          <img 
            src="/input_file_0.png" 
            alt="Arsartive" 
            className="h-10 w-auto object-contain cursor-pointer" 
            onClick={() => setScreen('HOME')}
            onError={(e) => {
              // Fallback if image path is different or fails
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.querySelector('.fallback-text')?.classList.remove('hidden');
            }}
          />
          <span className="fallback-text hidden text-2xl font-display font-bold text-brand-terracotta translate-y-0.5 tracking-tight italic">arsartive</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative" onClick={() => setScreen('NOTIFICATIONS')}>
            <Bell size={24} className="cursor-pointer text-brand-dark/80 hover:text-brand-terracotta transition-colors" />
            <div className="absolute -top-1 -right-0.5 w-2 h-2 bg-brand-terracotta rounded-full border-2 border-brand-cream"></div>
          </div>
          <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand-terracotta cursor-pointer shadow-sm active:scale-90 transition-transform" onClick={() => setScreen('PROFILE')}>
            <img src={sharedData.user.avatar} alt="Me" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <div className="px-6 space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <span>Hi, {sharedData.user.firstName}!</span>
            <span className="text-lg">👋</span>
          </h2>
          <p className="text-xs text-brand-dark/50 italic leading-snug">"Every craft you create is a piece of your heart"</p>
        </div>

        <Button onClick={() => setScreen('UPLOAD')} className="flex items-center justify-center space-x-2 py-3 bg-brand-terracotta rounded-2xl shadow-lg ring-4 ring-brand-terracotta/10">
          <Plus size={20} />
          <span>Upload Craft</span>
        </Button>

        {/* Stories */}
        <div className="flex space-x-4 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
          {stories.map((s, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 min-w-[70px]">
              <div className={cn(
                "w-16 h-16 rounded-full p-1",
                i === 0 ? "border-2 border-dashed border-brand-beige" : "bg-gradient-to-tr from-brand-terracotta to-brand-tan"
              )}>
                <div className="w-full h-full rounded-full bg-brand-cream overflow-hidden flex items-center justify-center">
                  {s.img ? (
                    <img src={s.img} className="w-full h-full object-cover" alt={s.title} />
                  ) : (
                    <div className="text-brand-terracotta">{s.icon}</div>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-medium opacity-60 truncate w-16 text-center">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Feed Headers */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <h3 className="font-display font-bold text-lg">Feed</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-widest">Pricing:</span>
              <select 
                value={sharedData.viewerCurrency}
                onChange={(e) => setSharedData((prev: any) => ({ ...prev, viewerCurrency: e.target.value }))}
                className="bg-transparent text-[10px] font-bold text-brand-terracotta outline-none border-b border-brand-terracotta/20"
              >
                {Object.keys(CURRENCY_SYMBOLS).map(c => (
                  <option key={c} value={c}>{c} ({CURRENCY_SYMBOLS[c]})</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold text-brand-dark/40">
            <span className="text-brand-terracotta border-b-2 border-brand-terracotta pb-1">Most Recent</span>
            <div className="flex items-center space-x-1 cursor-pointer">
              <Eye size={14} />
              <span>Filter</span>
            </div>
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-6">
          {sharedData.posts.map(post => (
            <div key={post.id} className="bg-brand-beige/30 p-4 rounded-3xl space-y-4 shadow-sm border border-brand-beige/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigateToProfile?.(post)}>
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-brand-beige group-hover:ring-brand-terracotta/30 transition-all">
                    <img src={post.avatar} alt={post.user} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold group-hover:text-brand-terracotta transition-colors">{post.user}</span>
                    <span className="text-[10px] text-brand-dark/40 font-medium">{post.time}</span>
                  </div>
                </div>
                <MoreHorizontal size={20} className="text-brand-dark/40 cursor-pointer" />
              </div>
              <div className="rounded-2xl overflow-hidden aspect-square shadow-sm relative group cursor-pointer">
                <img 
                  src={post.image} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt="Craft" 
                />
                
                {/* Sale Badge */}
                <div className="absolute top-4 right-4">
                  {post.isForSale ? (
                    <div className="bg-brand-terracotta text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-lg flex items-center space-x-1.5">
                      <ShoppingBag size={12} />
                      <span>
                        {CURRENCY_SYMBOLS[sharedData.viewerCurrency]}
                        {convertPrice(post.priceAmount || post.price || 0, post.currency || 'INR', sharedData.viewerCurrency)}
                      </span>
                    </div>
                  ) : (
                    <div className="bg-white/90 backdrop-blur-md text-brand-dark px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-lg flex items-center space-x-1.5 border border-brand-beige">
                      <Palette size={12} className="text-brand-terracotta" />
                      <span>Showcase</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-5">
                  <button onClick={() => toggleLike(post.id)} className="flex items-center space-x-1.5 group">
                    <Heart size={22} className={cn("transition-colors", post.liked ? "text-brand-terracotta fill-brand-terracotta scale-110" : "text-brand-dark/40 group-hover:text-brand-terracotta")} />
                    <span className={cn("text-[10px] font-bold", post.liked ? "text-brand-terracotta" : "text-brand-dark/40")}>{post.likes}</span>
                  </button>
                  <button className="text-brand-dark/40 hover:text-brand-terracotta transition-colors">
                    <MessageCircle size={22} />
                  </button>
                  <button className="text-brand-dark/40 hover:text-brand-terracotta transition-colors">
                    <Send size={22} />
                  </button>
                </div>
                {post.isForSale ? (
                  <button className="bg-brand-terracotta text-white px-5 py-2 rounded-2xl text-[11px] font-bold shadow-md hover:bg-brand-terracotta/90 transition-all active:scale-95 flex items-center space-x-2">
                    <ShoppingBag size={14} />
                    <span>Buy Now</span>
                  </button>
                ) : (
                  <button className="bg-brand-beige/50 text-brand-dark/60 px-5 py-2 rounded-2xl text-[11px] font-bold border border-brand-tan/20 hover:bg-brand-beige transition-all active:scale-95 flex items-center space-x-2">
                    <MessageCircle size={14} />
                    <span>Inquire</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="HOME" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const ExploreScreen = ({ setScreen, navigateToProfile }: { setScreen: (s: Screen) => void, navigateToProfile?: (u: any) => void, key?: string }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { name: 'All', icon: <Grid size={16} /> },
    { name: 'Macrame', icon: <Brush size={16} /> },
    { name: 'Ceramics', icon: <Palette size={16} /> },
    { name: 'Embroidery', icon: <PenTool size={16} /> },
    { name: 'Wood', icon: <ShoppingBag size={16} /> },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto no-scrollbar p-6 pb-24 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold">Explore</h1>
        <button onClick={() => setScreen('NOTIFICATIONS')} className="relative">
          <Bell size={24} className="text-brand-dark/40" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-terracotta rounded-full border-2 border-brand-cream"></div>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={20} />
        <input 
          placeholder="Search for crafts, creators..."
          className="w-full bg-brand-beige/50 rounded-2xl p-4 pl-12 text-sm outline-none"
        />
      </div>

      <div className="flex space-x-3 overflow-x-auto no-scrollbar -mx-6 px-6">
        {categories.map(c => (
          <button key={c.name} className={cn(
            "flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap text-xs font-semibold border border-brand-beige",
            c.name === 'All' ? "bg-brand-terracotta text-white" : "bg-white/50 text-brand-dark/60"
          )}>
            {c.icon}
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Trending Creators</h2>
          <button className="text-brand-terracotta text-xs font-bold">See all</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto no-scrollbar -mx-6 px-6 py-2">
          { [
            { n: 'Riya Art', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100' },
            { n: 'CraftyHands', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100' },
            { n: 'ColorMe', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' },
            { n: 'PaperPlane', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=100' },
          ].map((c, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 bg-white/50 p-3 rounded-3xl border border-brand-beige min-w-[100px] cursor-pointer hover:bg-brand-beige/50 transition-colors group" onClick={() => navigateToProfile?.({ user: c.n, avatar: c.img })}>
              <div className="w-14 h-14 rounded-full overflow-hidden outline outline-2 outline-brand-terracotta/20 outline-offset-2 group-hover:outline-brand-terracotta transition-all">
                <img src={c.img} className="w-full h-full object-cover" alt={c.n} />
              </div>
              <span className="text-[10px] font-bold text-center group-hover:text-brand-terracotta transition-colors">{c.n}</span>
              <button className="bg-brand-terracotta text-white px-3 py-1 rounded-full text-[10px] font-bold">Follow</button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">Popular Posts</h2>
          <button className="text-brand-terracotta text-xs font-bold">See all</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1596700421255-a47738f6d634?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1616422285623-13ff0167c95c?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1610660246444-375609618ad7?auto=format&fit=crop&q=80&w=300',
            'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=300',
          ].map((url, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm">
              <img src={url} className="w-full h-full object-cover" alt="Popular" />
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="EXPLORE" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const BusinessScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
      <div className="p-6 flex items-center justify-between">
        <button onClick={() => setScreen('HOME')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">My Business</h1>
        <button className="bg-brand-beige p-3 rounded-2xl"><Settings size={20} /></button>
      </div>

      <div className="px-6 space-y-6">
        <div className="bg-brand-terracotta text-white p-6 rounded-[32px] space-y-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center space-x-2 relative z-10">
            <h2 className="text-2xl font-bold font-display">Craft Your Success</h2>
            <span>🤎</span>
          </div>
          <p className="text-xs opacity-80 max-w-[200px] relative z-10 leading-relaxed font-medium">Browse your shop, create and grow your brand</p>
          <button className="bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-2xl text-xs font-bold border border-white/30 relative z-10">View Dashboard</button>
          <ShoppingBag className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 -rotate-12" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">Overview</h3>
            <div className="bg-brand-beige/50 px-3 py-1 rounded-full flex items-center space-x-1">
              <span className="text-[10px] font-bold">This Month</span>
              <ChevronRight size={12} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-brand-beige/20 p-4 rounded-3xl border border-brand-beige space-y-2">
              <div className="flex items-center justify-between text-brand-dark/40">
                <span className="text-[10px] font-bold">Orders</span>
                <ShoppingBag size={14} />
              </div>
              <p className="text-2xl font-bold">32</p>
            </div>
            <div className="bg-brand-beige/20 p-4 rounded-3xl border border-brand-beige space-y-2">
              <div className="flex items-center justify-between text-brand-dark/40">
                <span className="text-[10px] font-bold">Revenue</span>
                <div className="bg-brand-terracotta/10 p-1 rounded-full"><TrendingUp size={14} className="text-brand-terracotta" /></div>
              </div>
              <p className="text-2xl font-bold">₹24,550</p>
            </div>
            <div className="bg-brand-beige/20 p-4 rounded-3xl border border-brand-beige space-y-2">
              <div className="flex items-center justify-between text-brand-dark/40">
                <span className="text-[10px] font-bold">Views</span>
                <Eye size={14} />
              </div>
              <p className="text-2xl font-bold">1,234</p>
            </div>
            <div className="bg-brand-beige/20 p-4 rounded-3xl border border-brand-beige space-y-2">
              <div className="flex items-center justify-between text-brand-dark/40">
                <span className="text-[10px] font-bold">Conversion</span>
                <Award size={14} />
              </div>
              <p className="text-2xl font-bold">6.5%</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">My Products</h3>
            <button className="text-brand-terracotta text-xs font-bold">See all</button>
          </div>
          <Button className="flex items-center justify-center space-x-2 py-3 rounded-2xl shadow-md border-b-4 border-brand-terracotta/20 active:border-b-0 underline-offset-4">
            <Plus size={20} />
            <span>Add New Product</span>
          </Button>
          
          <div className="pt-2">
             <div className="bg-white/50 p-3 rounded-2xl flex items-center space-x-3 border border-brand-beige">
                <div className="w-14 h-14 rounded-xl overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Prod" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">Macrame Wall Hanging</p>
                  <p className="text-[10px] text-brand-dark/40">12 Sold • 24 in stock</p>
                </div>
                <MoreVertical size={20} className="text-brand-dark/40" />
             </div>
          </div>
        </div>
      </div>
      <BottomNav active="UPLOAD" setScreen={setScreen} />
    </motion.div>
  );
};

const ProfileScreen = ({ setScreen, sharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData, key?: string }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 300);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [showMenu, setShowMenu] = useState(false);

  const [activeTab, setActiveTab] = useState<'Posts' | 'Reels' | 'Saved'>('Posts');

  const userFullPosts = sharedData.posts.filter((p: any) => 
    p.user === `${sharedData.user.firstName} ${sharedData.user.lastName}` || 
    p.username === sharedData.user.username
  );

  const userTabPosts = userFullPosts.filter((p: any) => {
    if (activeTab === 'Posts') return p.contentType !== 'REEL';
    if (activeTab === 'Reels') return p.contentType === 'REEL';
    return false;
  });

  const defaultImages = [
    'https://images.unsplash.com/photo-1544413647-ad3474d0819a?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1565193998248-d50c1c8a149c?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1596700421255-a47738f6d634?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1616422285623-13ff0167c95c?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1610660246444-375609618ad7?auto=format&fit=crop&q=80&w=200',
  ];

  const defaultReelThumbnails = [
    'https://images.unsplash.com/photo-1620023419356-9f33ae1ff8e9?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=200'
  ];

  const displayImages = activeTab === 'Saved'
    ? [
        ...sharedData.posts.filter((p: any) => p.liked).map((p: any) => p.image).filter(Boolean),
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200'
      ]
    : [
        ...userTabPosts.map((p: any) => p.image).filter(Boolean),
        ...(activeTab === 'Posts' ? defaultImages : defaultReelThumbnails)
      ];

  const menuOptions = [
    { label: 'Edit Profile', icon: UserRound, color: 'text-brand-dark', screen: 'SETTINGS_EDIT_PROFILE' as Screen },
    { label: 'Business Analytics', icon: TrendingUp, color: 'text-brand-dark', screen: 'BUSINESS_ANALYTICS' as Screen },
    { label: 'Security & Account', icon: Lock, color: 'text-brand-dark', screen: 'SETTINGS_SECURITY' as Screen },
    { label: 'Privacy Settings', icon: Shield, color: 'text-brand-dark', screen: 'SETTINGS_PRIVACY' as Screen },
    { label: 'Help Center', icon: HelpCircle, color: 'text-brand-dark', screen: 'SETTINGS_HELP' as Screen },
    { label: 'Logout', icon: LogOut, color: 'text-brand-terracotta', screen: 'AUTH_LOGIN' as Screen },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto no-scrollbar pb-24"
    >
      <div className="p-6 flex items-center justify-between sticky top-0 bg-brand-cream/80 backdrop-blur-md z-20">
         <div className="w-10 h-10"></div>
         <h1 className="text-xl font-display font-bold">Profile Detail</h1>
         <div className="relative">
           <MoreVertical 
             size={24} 
             className="text-brand-dark/60 cursor-pointer hover:text-brand-terracotta transition-colors" 
             onClick={() => setShowMenu(!showMenu)}
           />
           
           <AnimatePresence>
             {showMenu && (
               <>
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className="fixed inset-0 z-30"
                   onClick={() => setShowMenu(false)}
                 />
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.95, y: -10 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.95, y: -10 }}
                   className="absolute right-0 mt-2 w-56 bg-white rounded-3xl shadow-2xl border border-brand-beige p-2 z-40 overflow-hidden"
                 >
                   {menuOptions.map((opt, i) => (
                     <button 
                       key={i}
                       className={cn(
                         "w-full flex items-center space-x-3 p-3 rounded-2xl hover:bg-brand-beige/30 transition-colors text-xs font-bold",
                         opt.color
                       )}
                       onClick={() => {
                         if (opt.screen) setScreen(opt.screen);
                         setShowMenu(false);
                       }}
                     >
                       <opt.icon size={18} />
                       <span>{opt.label}</span>
                     </button>
                   ))}
                 </motion.div>
               </>
             )}
           </AnimatePresence>
         </div>
      </div>

      <div className="px-6 flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-terracotta p-1 bg-brand-cream">
            <img src={sharedData.user.avatar} className="w-full h-full object-cover rounded-full" alt="profile" />
          </div>
          <div className="absolute bottom-0 right-0 bg-brand-terracotta text-white p-1.5 rounded-full ring-4 ring-brand-cream shadow-sm">
            <Camera size={14} />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">{sharedData.user.firstName} {sharedData.user.lastName}</h2>
          <p className="text-xs text-brand-dark/50 font-medium">@{sharedData.user.username}</p>
        </div>

        <div className="flex justify-around w-full py-2">
          {[
            { n: '128', l: 'Posts' },
            { n: '123K', l: 'Followers' },
            { n: '336', l: 'Following' }
          ].map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <p className="text-sm font-bold">{s.n}</p>
              <p className="text-[10px] text-brand-dark/40 font-bold">{s.l}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-center text-brand-dark/60 italic leading-relaxed px-10">
          Handmade with love 🤎<br/>Crafting stories, one creation at a time.
        </p>

        <Button variant="primary" className="py-2.5 rounded-2xl text-xs shadow-md">Edit Profile</Button>
      </div>

      <div className="mt-8 px-6 space-y-4">
        <div className="flex items-center justify-around border-b border-brand-beige">
          {['Posts', 'Reels', 'Saved'].map((t, i) => (
             <button key={i} className={cn(
               "pb-3 px-4 text-xs font-bold transition-all",
               activeTab === t ? "border-b-2 border-brand-terracotta text-brand-terracotta" : "text-brand-dark/40"
             )} onClick={() => setActiveTab(t as 'Posts' | 'Reels' | 'Saved')}>{t}</button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {displayImages.map((u, i) => (
             <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-sm">
               <img src={u} className="w-full h-full object-cover" alt="P" />
             </div>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="PROFILE" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const UploadScreen = ({ setScreen, sharedData, setSharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData, setSharedData: any, key?: string }) => {
  const [description, setDescription] = useState(sharedData.upload.description);
  const [isForSale, setIsForSale] = useState(sharedData.upload.isForSale);
  const [price, setPrice] = useState(sharedData.upload.price);
  const [currency, setCurrency] = useState(sharedData.upload.currency || 'INR');
  const [materials, setMaterials] = useState(sharedData.upload.materials || '');
  
  const [contentType, setContentType] = useState<'POST' | 'REEL'>('POST');
  const [reelDuration, setReelDuration] = useState(5);
  const [photoCount, setPhotoCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    if (contentType === 'REEL') {
      const video = files[0];
      if (!video.type.startsWith('video/')) {
        setError('Please select a valid video for an Art Reel.');
        return;
      }
      setSelectedFiles([video]);
      setError(null);
    } else {
      const images = files.filter(f => f.type.startsWith('image/'));
      if (images.length !== files.length) {
        setError('Only images are allowed in Gallery Posts.');
        return;
      }
      
      setSelectedFiles(prev => {
        const updated = [...prev, ...images].slice(0, 7);
        setPhotoCount(updated.length);
        if (updated.length < 3 || updated.length > 7) {
          setError(`Please select between 3 and 7 photos (Selected: ${updated.length}).`);
        } else {
          setError(null);
        }
        return updated;
      });
    }
    
    // Clear input value to allow re-selecting the same files if needed
    if (e.target) e.target.value = '';
  };

  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    if (contentType === 'POST') {
      setPhotoCount(newFiles.length);
      if (newFiles.length < 3 || newFiles.length > 7) {
        setError(`Please select between 3 and 7 photos (Selected: ${newFiles.length}).`);
      } else {
        setError(null);
      }
    } else {
      if (newFiles.length === 0) {
        setPhotoCount(0);
      }
    }
  };

  const handleNext = () => {
    if (contentType === 'REEL') {
      if (selectedFiles.length === 0) {
        setError('Please select a video file first.');
        return;
      }
      if (reelDuration < 3 || reelDuration > 6) {
        setError('Reels must be between 3 and 6 seconds.');
        return;
      }
    } else {
      if (selectedFiles.length < 3 || selectedFiles.length > 7) {
        setError('Gallery posts must have between 3 and 7 photos.');
        return;
      }
    }

    setSharedData((prev: any) => ({
      ...prev,
      upload: {
        ...prev.upload,
        description,
        isForSale,
        price,
        currency,
        materials,
        contentType,
        reelDuration,
        photoCount: selectedFiles.length,
        images: selectedFiles.map(file => URL.createObjectURL(file))
      }
    }));
    setScreen('UPLOAD_PREVIEW');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-brand-cream/30">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white border-b border-brand-beige sticky top-0 z-20">
        <div className="flex items-center space-x-4">
          <button onClick={() => setScreen('HOME')} className="text-brand-dark/60 hover:text-brand-dark">
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-lg font-bold font-display text-brand-dark">Create Post</h2>
        </div>
        <button 
          onClick={handleNext} 
          disabled={!!error || selectedFiles.length === 0}
          className={cn(
            "text-sm font-bold transition-all px-4 py-2 rounded-full",
            (!!error || selectedFiles.length === 0) 
              ? "text-brand-dark/20 bg-brand-beige/50" 
              : "text-brand-terracotta hover:bg-brand-terracotta/5"
          )}
        >
          Next
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">
        {/* Content Type Tabs */}
        <div className="bg-brand-beige/40 p-1.5 rounded-[24px] flex items-center space-x-1 border border-brand-beige/50 shadow-inner">
          <button 
            onClick={() => { setContentType('POST'); setSelectedFiles([]); setError(null); }}
            className={cn(
              "flex-1 flex items-center justify-center space-x-2 py-3 rounded-[20px] text-xs font-bold transition-all",
              contentType === 'POST' ? "bg-white text-brand-terracotta shadow-md" : "text-brand-dark/40"
            )}
          >
            <Layout size={16} />
            <span>Photos</span>
          </button>
          <button 
            onClick={() => { setContentType('REEL'); setSelectedFiles([]); setError(null); }}
            className={cn(
              "flex-1 flex items-center justify-center space-x-2 py-3 rounded-[20px] text-xs font-bold transition-all",
              contentType === 'REEL' ? "bg-white text-brand-terracotta shadow-md" : "text-brand-dark/40"
            )}
          >
            <Play size={16} />
            <span>Reel</span>
          </button>
        </div>

        {/* Upload Feed Section */}
        <div className="bg-white rounded-[40px] p-8 border border-brand-beige/50 shadow-sm space-y-8">
          <div className="flex items-center space-x-4">
            <div className={cn("p-3 rounded-2xl", contentType === 'POST' ? "bg-brand-terracotta text-white" : "bg-pink-500 text-white")}>
              {contentType === 'POST' ? <Camera size={24} /> : <Play size={24} />}
            </div>
            <div>
              <h3 className="text-base font-bold text-brand-dark">Upload {contentType === 'POST' ? 'Photos' : 'Reel'}</h3>
              <p className="text-[11px] text-brand-dark/40 font-medium">
                {contentType === 'POST' ? 'You can add between 3 and 7 photos per post.' : 'Share a short reel. Maximum duration is 6 seconds.'}
              </p>
            </div>
          </div>

          {contentType === 'POST' ? (
            <div className="space-y-6">
              <div className="flex flex-nowrap space-x-3 overflow-x-auto no-scrollbar pb-2">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const file = selectedFiles[idx];
                  if (file) {
                    return (
                      <div key={idx} className="relative shrink-0">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-sm ring-1 ring-brand-beige">
                          <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt={`Selection ${idx}`} />
                        </div>
                        <button 
                          onClick={() => removeFile(idx)}
                          className="absolute -top-1 -right-1 bg-brand-dark/80 text-white p-1 rounded-full shadow-lg hover:bg-brand-terracotta transition-colors z-10"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    );
                  }
                  
                  return (
                    <button 
                      key={idx}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-2xl border-2 border-dashed border-brand-beige bg-brand-beige/5 flex flex-col items-center justify-center space-y-1 hover:bg-brand-beige/10 transition-colors shrink-0"
                    >
                      <Plus size={18} className="text-brand-dark/20" />
                      <span className="text-[10px] font-bold text-brand-dark/30">{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              <div className="bg-brand-beige/20 p-4 rounded-2xl flex items-center justify-between border border-brand-beige/30">
                <div className="flex items-center space-x-2 text-brand-terracotta/70 font-bold text-[10px] uppercase tracking-wider">
                  <div className="w-1 h-1 rounded-full bg-brand-terracotta" />
                  <span>Minimum 3 photos • Maximum 7 photos</span>
                </div>
                <div className={cn("text-[11px] font-bold", selectedFiles.length < 3 || selectedFiles.length > 7 ? "text-red-500" : "text-brand-terracotta")}>
                  {selectedFiles.length} / 7
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div 
                  onClick={selectedFiles.length === 0 ? () => fileInputRef.current?.click() : undefined}
                  className="aspect-video bg-brand-beige/20 rounded-[32px] border-2 border-dashed border-brand-beige relative flex flex-col items-center justify-center group overflow-hidden cursor-pointer"
                >
                  {selectedFiles.length > 0 ? (
                    <>
                      <div className="absolute inset-x-0 bottom-0 p-3 bg-brand-dark/40 backdrop-blur-sm text-white text-[9px] font-bold flex justify-between items-center z-10">
                        <span>{selectedFiles[0].name}</span>
                        <span>0:00 / 0:06</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={24} className="text-white fill-white" />
                         </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full bg-brand-terracotta/10 flex items-center justify-center text-brand-terracotta mb-2">
                        <Plus size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest">Select Video</span>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 flex items-start space-x-3">
                    <div className="p-1.5 bg-pink-100 rounded-lg text-pink-500 mt-0.5">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-pink-900 uppercase tracking-wider mb-0.5">Maximum duration</p>
                      <p className="text-xs font-bold text-pink-700">6 seconds</p>
                    </div>
                  </div>
                  <div className="bg-brand-beige/20 p-4 rounded-2xl border border-brand-beige/30 flex items-start space-x-3">
                    <div className="p-1.5 bg-brand-beige/50 rounded-lg text-brand-dark/40 mt-0.5">
                      <Info size={16} />
                    </div>
                    <p className="text-[10px] font-bold text-brand-dark/50 leading-relaxed uppercase tracking-wider pt-1">
                      Reels longer than 6 seconds will not be allowed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept={contentType === 'REEL' ? "video/*" : "image/*"}
            multiple={contentType === 'POST'}
            onChange={handleFileChange}
          />
        </div>

        {/* Caption Section (moved from previous layout but integrated) */}
        <div className="bg-white rounded-[40px] p-8 border border-brand-beige/50 shadow-sm space-y-6">
           <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Description</h3>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write an artistic caption for your craft..."
                className="w-full text-sm outline-none border-none resize-none min-h-[120px] placeholder:text-brand-dark/20 text-brand-dark leading-relaxed font-medium"
              />
           </div>

           <div className={cn("pt-6 border-t border-brand-beige/50", isForSale ? "space-y-6" : "space-y-0 overflow-hidden h-fit")}>
              <div className="flex items-center justify-between pb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-terracotta/10 text-brand-terracotta rounded-xl shadow-sm transition-colors"><ShoppingBag size={18} /></div>
                  <div>
                    <p className="text-xs font-bold text-brand-dark">Marketplace Listing</p>
                    <p className="text-[9px] text-brand-dark/40 font-medium tracking-tight">Available for purchase in store</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsForSale(!isForSale)}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300",
                    isForSale ? "bg-brand-terracotta" : "bg-brand-beige"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300",
                    isForSale ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <AnimatePresence>
                {isForSale && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="space-y-4 pt-4 border-t border-brand-beige/30"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <label className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest">Pricing & Currency</label>
                      </div>
                      
                      <div className="flex space-x-2">
                        <div className="w-24 shrink-0">
                          <select 
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full bg-brand-beige/20 rounded-2xl p-3 border border-brand-beige text-xs font-bold text-brand-dark outline-none focus:border-brand-terracotta appearance-none h-[46px]"
                          >
                            <option value="INR">INR (₹)</option>
                            <option value="USD">USD ($)</option>
                            <option value="NPR">NPR (रु)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="EUR">EUR (€)</option>
                          </select>
                        </div>
                        
                        <div className="flex-1 bg-brand-beige/20 rounded-2xl p-3 border border-brand-beige flex items-center group focus-within:border-brand-terracotta transition-colors">
                          <span className="text-brand-dark/40 font-bold text-sm mr-2">
                             {currency === 'INR' ? '₹' : (currency === 'USD' ? '$' : (currency === 'NPR' ? 'रु' : (currency === 'GBP' ? '£' : '€')))}
                          </span>
                          <input 
                            type="number" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="bg-transparent outline-none w-full text-sm font-bold text-brand-dark placeholder:text-brand-dark/10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Craft Details & Materials</label>
                      <div className="bg-brand-beige/20 rounded-2xl p-3 border border-brand-beige group focus-within:border-brand-terracotta transition-colors">
                        <input 
                          type="text" 
                          value={materials}
                          onChange={(e) => setMaterials(e.target.value)}
                          placeholder="E.g., Fine Porcelain, Cobalt Blue Glaze, Gold leaf..."
                          className="bg-transparent outline-none w-full text-sm font-medium text-brand-dark placeholder:text-brand-dark/20"
                        />
                      </div>
                      <p className="text-[8px] text-brand-dark/30 font-medium italic text-right px-1">Help buyers understand the value of your work.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center space-x-3 p-4 bg-red-50 rounded-2xl border border-red-100"
          >
            <div className="bg-red-500 rounded-full p-1 text-white shadow-sm"><X size={12} /></div>
            <p className="text-[11px] font-bold text-red-600">{error}</p>
          </motion.div>
        )}

        {/* Footer Guidance */}
        <div className="flex items-center justify-center space-x-2 py-4">
          <div className="w-4 h-4 text-brand-dark/20"><Info size={14} /></div>
          <p className="text-[9px] font-bold text-brand-dark/30 uppercase tracking-[1px]">
            Follow our <span className="text-brand-terracotta underline cursor-pointer">Community Guidelines</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const UploadPreviewScreen = ({ setScreen, sharedData, setSharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData, setSharedData: any, key?: string }) => {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    const uploadedImage = sharedData.upload.images && sharedData.upload.images.length > 0
      ? sharedData.upload.images[0]
      : (sharedData.upload.contentType === 'REEL' 
         ? 'https://images.unsplash.com/photo-1620023419356-9f33ae1ff8e9?auto=format&fit=crop&q=80&w=1000'
         : 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=1000');

    const newPost = {
      id: Date.now(),
      user: `${sharedData.user.firstName} ${sharedData.user.lastName}`,
      avatar: sharedData.user.avatar,
      username: sharedData.user.username,
      time: 'Just now',
      image: uploadedImage,
      description: sharedData.upload.description,
      liked: false,
      likes: 0,
      isForSale: sharedData.upload.isForSale,
      priceAmount: parseFloat(sharedData.upload.price) || 0,
      currency: sharedData.upload.currency,
      previewPrice: sharedData.upload.isForSale ? `${CURRENCY_SYMBOLS[sharedData.upload.currency]}${sharedData.upload.price}` : null,
      contentType: sharedData.upload.contentType,
      reelDuration: sharedData.upload.reelDuration,
      photoCount: sharedData.upload.photoCount
    };

    setPublishing(true);
    setTimeout(() => {
      setSharedData((prev: any) => ({
        ...prev,
        posts: [newPost, ...prev.posts]
      }));
      setScreen('HOME');
    }, 2000);
  };

  const previewImage = sharedData.upload.images && sharedData.upload.images.length > 0
    ? sharedData.upload.images[0]
    : (sharedData.upload.contentType === 'REEL' 
       ? 'https://images.unsplash.com/photo-1620023419356-9f33ae1ff8e9?auto=format&fit=crop&q=80&w=1000'
       : 'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=1000');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-brand-beige sticky top-0 bg-white z-20">
        <button onClick={() => setScreen('UPLOAD')}><ChevronLeft size={24} /></button>
        <h2 className="text-sm font-bold tracking-widest uppercase">Preview Selection</h2>
        <button 
          onClick={handlePublish}
          disabled={publishing}
          className="text-brand-terracotta font-bold text-sm"
        >
          {publishing ? '...' : 'Share'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
        <div className="aspect-[4/5] relative bg-brand-dark/5">
          <img 
            src={previewImage} 
            alt="Upload preview" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
             <div className="flex items-center space-x-2 text-white/90 mb-2">
                {sharedData.upload.contentType === 'REEL' ? <Play size={14} /> : <Layout size={14} />}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {sharedData.upload.contentType === 'REEL' ? `Art Reel • ${sharedData.upload.reelDuration}s` : `Gallery Post • ${sharedData.upload.photoCount} Photos`}
                </span>
              </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Description</h3>
            <p className="text-sm text-brand-dark leading-relaxed italic">"{sharedData.upload.description || 'No description provided'}"</p>
          </div>

          <div className="bg-brand-beige/5 p-5 rounded-[32px] border border-brand-beige space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Status</span>
                <span className={cn("text-xs font-bold", sharedData.upload.isForSale ? "text-brand-terracotta" : "text-brand-dark")}>
                  {sharedData.upload.isForSale ? 'For Sale' : 'Artistic Showcase'}
                </span>
             </div>
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Creator</span>
                <span className="text-xs font-bold text-brand-dark">{sharedData.user.firstName} {sharedData.user.lastName}</span>
             </div>
              {sharedData.upload.isForSale && (
               <>
                 <div className="flex items-center justify-between pt-2 border-t border-brand-beige">
                    <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Price</span>
                    <div className="text-xs font-bold text-brand-dark flex flex-col items-end">
                      <PriceDisplay amount={sharedData.upload.price} from={sharedData.upload.currency} to={sharedData.viewerCurrency} />
                      {sharedData.upload.currency !== sharedData.viewerCurrency && (
                        <span className="text-[8px] text-brand-dark/30">Original: {CURRENCY_SYMBOLS[sharedData.upload.currency]}{sharedData.upload.price}</span>
                      )}
                    </div>
                 </div>
                 {sharedData.upload.materials && (
                    <div className="space-y-2 pt-2 border-t border-brand-beige">
                       <span className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-[2px]">Materials</span>
                       <p className="text-[10px] font-medium text-brand-dark/60 leading-tight">{sharedData.upload.materials}</p>
                    </div>
                 )}
               </>
             )}
          </div>
        </div>
      </div>

      {publishing && (
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           className="fixed inset-0 bg-brand-cream/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
           <motion.div 
             animate={{ 
               scale: [1, 1.1, 1],
               rotate: [0, 5, -5, 0]
             }}
             transition={{ duration: 2, repeat: Infinity }}
             className="flex flex-col items-center space-y-4"
           >
             <div className="bg-brand-terracotta p-6 rounded-full shadow-2xl">
                <CheckCircle2 size={40} className="text-white" />
             </div>
             <p className="font-display font-bold text-xl">Curating your craft...</p>
           </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

const MessagesScreen = ({ setScreen, navigateToChat }: { setScreen: (s: Screen) => void, navigateToChat?: (c: any) => void, key?: string }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'Groups'>('All');
  
  const chats = [
    { n: 'CraftyHands', m: 'Hey! I loved your artisan craft!', t: '30m ago', i: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', unread: true },
    { n: 'Rya Art', m: 'Shared your message!', t: '1h ago', i: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', unread: false },
    { n: 'Cerama_Studio', m: 'Is that clay pot still available for sale?', t: '3h ago', i: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100', unread: true },
    { n: 'Art_Lover_99', m: 'I just placed an order. Can\'t wait!', t: '5h ago', i: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100', unread: false },
    { n: 'WoodWork_Pro', m: 'Do you offer international shipping?', t: '1d ago', i: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100', unread: false },
  ];

  const filteredChats = chats.filter(c => {
    if (activeTab === 'Unread') return c.unread;
    if (activeTab === 'Groups') return false; // Dummy groups
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      ref={scrollRef}
      onScroll={handleScroll}
      className="p-6 pb-24 h-full flex flex-col space-y-6 overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center justify-between">
        <button onClick={() => setScreen('HOME')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">Messages</h1>
        <button className="bg-brand-beige p-3 rounded-2xl text-brand-terracotta">
           <PenTool size={20} />
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={20} />
        <input 
          placeholder="Search messages..."
          className="w-full bg-brand-beige/50 rounded-2xl p-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-brand-terracotta/20"
        />
      </div>

      <div className="space-y-4 flex-1">
        <div className="flex space-x-2">
           {['All', 'Unread', 'Groups'].map((tab) => (
             <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-xs font-bold transition-all",
                  activeTab === tab ? "bg-brand-terracotta text-white shadow-md" : "bg-brand-beige/50 text-brand-dark/60 hover:bg-brand-beige"
                )}
             >
               {tab}
             </button>
           ))}
        </div>

        <div className="space-y-2 pt-2">
           {filteredChats.map((msg, i) => (
              <div 
                key={i} 
                className="flex items-center space-x-4 p-3 rounded-2xl hover:bg-brand-beige/20 transition-colors cursor-pointer group"
                onClick={() => navigateToChat?.(msg)}
              >
                 <div className="relative">
                   <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-brand-cream ring-2 ring-brand-beige">
                      <img src={msg.i} className="w-full h-full object-cover" alt="U" />
                   </div>
                   {msg.unread && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-brand-terracotta rounded-full border-2 border-brand-cream"></div>}
                 </div>
                 <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold group-hover:text-brand-terracotta transition-colors">{msg.n}</p>
                      <p className="text-[9px] text-brand-dark/40 font-medium">{msg.t}</p>
                    </div>
                    <p className={cn("text-[11px] line-clamp-1", msg.unread ? "text-brand-dark font-semibold" : "text-brand-dark/50")}>
                      {msg.m}
                    </p>
                 </div>
              </div>
           ))}
        </div>
      </div>
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="MESSAGES" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const SettingsPrivacyScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-6 h-full space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => setScreen('PROFILE')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">Privacy Settings</h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Visibility</h2>
          <div className="space-y-2">
            {[
              { label: 'Private Account', desc: 'Only followers can see your crafts', checked: false },
              { label: 'Show Online Status', desc: 'Let others see when you are crafting', checked: true },
              { label: 'Hide Last Seen', desc: 'Keep your activity private', checked: false }
            ].map((item, i) => (
              <div key={i} className="bg-white/40 p-4 rounded-3xl border border-brand-beige flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-[10px] text-brand-dark/50">{item.desc}</p>
                </div>
                <div className={cn("w-10 h-6 rounded-full relative", item.checked ? "bg-brand-terracotta" : "bg-brand-tan/30")}>
                  <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm", item.checked ? "right-1" : "left-1")}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Interactions</h2>
          <div className="space-y-2">
            {[
              { label: 'Allow Direct Messages', value: 'Everyone' },
              { label: 'Who can tag me?', value: 'Followers' },
              { label: 'Comment Filtering', value: 'On' }
            ].map((item, i) => (
              <div key={i} className="bg-white/40 p-4 rounded-3xl border border-brand-beige flex items-center justify-between cursor-pointer">
                <p className="text-sm font-bold">{item.label}</p>
                <div className="flex items-center space-x-2">
                   <span className="text-xs text-brand-terracotta font-bold">{item.value}</span>
                   <ChevronRight size={16} className="text-brand-dark/30" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Data</h2>
          <button className="w-full bg-white/40 p-4 rounded-3xl border border-brand-beige flex items-center justify-between group">
             <p className="text-sm font-bold group-hover:text-brand-terracotta">Download My Data</p>
             <ArrowLeft size={16} className="text-brand-dark/30 rotate-180" />
          </button>
        </section>
      </div>
    </motion.div>
  );
};

const SettingsEditProfileScreen = ({ setScreen, sharedData, setSharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData, setSharedData: any, key?: string }) => {
  const [formData, setFormData] = useState({
    firstName: sharedData.user.firstName,
    lastName: sharedData.user.lastName,
    username: sharedData.user.username
  });

  const handleSave = () => {
    setSharedData((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        ...formData
      }
    }));
    setScreen('PROFILE');
  };

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-6 h-full space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={() => setScreen('PROFILE')} className="bg-brand-beige p-3 rounded-2xl">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-display font-bold">Edit Profile</h1>
        </div>
        <button onClick={handleSave} className="text-brand-terracotta font-bold">Save</button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-terracotta p-1 bg-brand-cream ring-4 ring-brand-terracotta/5">
            <img src={sharedData.user.avatar} className="w-full h-full object-cover rounded-full" alt="profile" />
          </div>
          <div className="absolute inset-0 bg-brand-dark/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        <p className="text-xs text-brand-terracotta font-bold">Change Profile Photo</p>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-dark/60 ml-1">First Name</label>
            <input 
              defaultValue={formData.firstName}
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-brand-dark/60 ml-1">Last Name</label>
            <input 
              defaultValue={formData.lastName}
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-dark/60 ml-1">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 text-xs font-bold">@</span>
            <input 
              defaultValue={formData.username}
              className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 pl-8 text-xs text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none"
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-brand-dark/60 ml-1">Bio</label>
          <textarea 
            className="w-full bg-brand-beige/50 border-none rounded-2xl p-4 text-sm text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none min-h-[100px]"
            defaultValue="Handmade with love 🤎 Crafting stories, one creation at a time."
          />
        </div>
      </div>

      <div className="pt-4">
         <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1 mb-3">Links</h2>
         <Button variant="outline" className="border-dashed py-3 flex items-center justify-center space-x-2">
            <Plus size={16} />
            <span>Add Social Link</span>
         </Button>
      </div>
    </motion.div>
  );
};

const SettingsSecurityScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-6 h-full space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => setScreen('PROFILE')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">Security & Account</h1>
      </div>

      <div className="space-y-6">
        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Login Options</h2>
          <div className="space-y-3">
            <div className="bg-white/40 p-5 rounded-3xl border border-brand-beige space-y-4">
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-3">
                    <div className="bg-brand-terracotta/10 p-2 rounded-xl">
                      <Lock size={18} className="text-brand-terracotta" />
                    </div>
                    <span className="text-sm font-bold">Change Password</span>
                 </div>
                 <ChevronRight size={18} className="text-brand-dark/30" />
               </div>
               <div className="border-t border-brand-beige pt-4 inline-flex items-center space-x-3 w-full opacity-60">
                  <div className="bg-blue-500/10 p-2 rounded-xl">
                    <Mail size={18} className="text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold">Primary Email</p>
                    <p className="text-xs font-medium">ananya@gmail.com</p>
                  </div>
                  <CheckCircle2 size={16} className="text-green-500" />
               </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Secondary Account</h2>
          <div className="bg-white/40 p-4 rounded-3xl border border-brand-beige flex items-center justify-between group cursor-pointer hover:bg-white/60 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="bg-brand-beige p-2 rounded-xl">
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="G" />
              </div>
              <div>
                <p className="text-sm font-bold">Secondary Gmail</p>
                <p className="text-[10px] text-brand-dark/50">Not connected</p>
              </div>
            </div>
            <button className="text-[10px] font-bold text-brand-terracotta bg-brand-terracotta/10 px-3 py-1 rounded-full">Connect</button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Safety</h2>
          <div className="space-y-2">
            {[
              { label: 'Two-Factor Auth', desc: 'Secure your account with code', checked: true },
              { label: 'Biometric Login', desc: 'FaceID or Fingerprint', checked: false }
            ].map((item, i) => (
              <div key={i} className="bg-white/40 p-4 rounded-3xl border border-brand-beige flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-[10px] text-brand-dark/50">{item.desc}</p>
                </div>
                <div className={cn("w-10 h-6 rounded-full relative transition-colors", item.checked ? "bg-brand-terracotta" : "bg-brand-tan/30")}>
                  <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all", item.checked ? "right-1" : "left-1")}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="pt-4">
        <button className="w-full text-center text-xs font-bold text-red-500 bg-red-500/5 py-4 rounded-2xl border border-red-500/10">Log out from all devices</button>
      </div>
    </motion.div>
  );
};

const SettingsHelpScreen = ({ setScreen }: { setScreen: (s: Screen) => void, key?: string }) => {
  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="p-6 h-full space-y-8">
      <div className="flex items-center space-x-4">
        <button onClick={() => setScreen('PROFILE')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">Help Center</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30" size={20} />
        <input 
          placeholder="Search for help..."
          className="w-full bg-brand-beige/50 rounded-2xl p-4 pl-12 text-sm outline-none"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest pl-1">Frequently Asked</h2>
        <div className="space-y-2">
          {[
            'How to set up a shop?',
            'What are the service fees?',
            'How do I ship internationally?',
            'Managing my craft orders',
            'Reporting a problem'
          ].map((q, i) => (
            <div key={i} className="bg-white/40 p-4 rounded-2xl border border-brand-beige flex items-center justify-between cursor-pointer group">
              <p className="text-sm font-medium group-hover:text-brand-terracotta transition-colors">{q}</p>
              <ChevronRight size={16} className="text-brand-dark/30" />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 space-y-4">
         <div className="bg-brand-terracotta text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-1 relative z-10">Still need help?</h3>
            <p className="text-xs opacity-80 mb-4 relative z-10">Our artisan support team is here 24/7</p>
            <Button variant="secondary" className="py-2.5 relative z-10">Contact Support</Button>
            <HelpCircle className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
         </div>
      </div>
    </motion.div>
  );
};

const ChatScreen = ({ setScreen, sharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData }) => {
  const chat = sharedData.activeChat || { n: 'User', i: '' };
  const [msg, setMsg] = useState('');
  
  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="h-full flex flex-col bg-brand-cream">
       <div className="p-4 flex items-center space-x-4 border-b border-brand-beige bg-brand-cream/80 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => setScreen('MESSAGES')} className="bg-brand-beige p-2 rounded-xl">
             <ArrowLeft size={18} />
          </button>
          <div className="flex items-center space-x-3 flex-1">
             <div className="w-10 h-10 rounded-full overflow-hidden border border-brand-beige">
                <img src={chat.i} className="w-full h-full object-cover" alt="U" />
             </div>
             <div>
                <p className="text-sm font-bold">{chat.n}</p>
                <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Now</p>
             </div>
          </div>
          <button className="bg-brand-beige p-2 rounded-xl text-brand-dark/60">
             <MoreHorizontal size={18} />
          </button>
       </div>

       <div className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
          <div className="flex justify-center">
             <p className="text-[9px] text-brand-dark/30 font-bold bg-brand-beige px-3 py-1 rounded-full uppercase tracking-tighter">Today, 10:30 AM</p>
          </div>
          
          <div className="flex space-x-3">
             <div className="w-8 h-8 rounded-full overflow-hidden self-end">
                <img src={chat.i} className="w-full h-full object-cover" alt="U" />
             </div>
             <div className="bg-brand-beige/50 p-4 rounded-3xl rounded-bl-none max-w-[80%]">
                <p className="text-xs font-medium leading-relaxed">Hey! I saw your latest craft post. Is the vintage ceramic pot still available for purchase?</p>
             </div>
          </div>

          <div className="flex justify-end">
             <div className="bg-brand-terracotta text-white p-4 rounded-3xl rounded-br-none max-w-[80%] shadow-lg shadow-brand-terracotta/10">
                <p className="text-xs font-medium leading-relaxed">Hi! Yes, it is. I just listed it properly in the marketplace section. You can check the price there!</p>
             </div>
          </div>
       </div>

       <div className="p-6 bg-brand-cream/80 backdrop-blur-md border-t border-brand-beige">
          <div className="flex items-center space-x-2 bg-brand-beige/30 p-2 rounded-3xl border border-brand-beige">
             <button className="p-2 text-brand-terracotta">
                <Plus size={20} />
             </button>
             <input 
               value={msg}
               onChange={(e) => setMsg(e.target.value)}
               placeholder="Type a message..." 
               className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-brand-dark/30 h-10 px-2"
             />
             <button className={cn("p-3 rounded-2xl transition-all", msg.trim() ? "bg-brand-terracotta text-white shadow-xl" : "bg-brand-tan/20 text-brand-dark/20")}>
                <Send size={18} />
             </button>
          </div>
       </div>
    </motion.div>
  );
};

const OtherProfileScreen = ({ setScreen, sharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const user = sharedData.activeProfile || { n: 'Artisan', i: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      ref={scrollRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto no-scrollbar pb-24"
    >
      <div className="p-6 flex items-center justify-between sticky top-0 bg-brand-cream/80 backdrop-blur-md z-20">
         <button onClick={() => setScreen('HOME')} className="bg-brand-beige p-3 rounded-2xl">
           <ArrowLeft size={20} />
         </button>
         <h1 className="text-xl font-display font-bold">Creator Profile</h1>
         <MoreVertical size={24} className="text-brand-dark/60 cursor-pointer" />
      </div>

      <div className="px-6 flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-terracotta p-1 bg-brand-cream ring-8 ring-brand-terracotta/5">
            <img src={user.avatar || user.i} className="w-full h-full object-cover rounded-full" alt="profile" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-brand-cream"></div>
        </div>
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold">{user.user || user.n}</h2>
          <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest flex items-center justify-center space-x-1">
            <Palette size={10} className="text-brand-terracotta" />
            <span>Master Craftsman</span>
          </p>
        </div>
        
        <div className="flex space-x-2 w-full">
           <Button className="flex-1 py-3">Follow</Button>
           <Button variant="outline" className="flex-1 py-3" onClick={() => setScreen('MESSAGES')}>Message</Button>
        </div>

        <div className="grid grid-cols-3 gap-6 w-full py-4 text-center">
          <div>
            <p className="text-sm font-bold">1.2K</p>
            <p className="text-[8px] text-brand-dark/40 font-bold uppercase">Followers</p>
          </div>
          <div>
            <p className="text-sm font-bold">48</p>
            <p className="text-[8px] text-brand-dark/40 font-bold uppercase">Crafts</p>
          </div>
          <div>
            <p className="text-sm font-bold">8.4K</p>
            <p className="text-[8px] text-brand-dark/40 font-bold uppercase">Likes</p>
          </div>
        </div>
      </div>

      <div className="px-6 mt-4 grid grid-cols-3 gap-2">
        {[
          'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=200',
          'https://images.unsplash.com/photo-1544413647-ad3474d0819a?auto=format&fit=crop&q=80&w=200',
          'https://images.unsplash.com/photo-1565193998248-d50c1c8a149c?auto=format&fit=crop&q=80&w=200',
          'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&q=80&w=200',
          'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?auto=format&fit=crop&q=80&w=200',
          'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=200',
        ].map((img, i) => (
          <div key={i} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:scale-95 transition-transform cursor-pointer">
            <img src={img} className="w-full h-full object-cover" alt="craft" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="PROFILE" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const NotificationsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const notifications = [
    { id: 1, type: 'follow', user: 'Kabir Art', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', time: '2m ago', desc: 'started following your workshop' },
    { id: 2, type: 'like', user: 'Meera Crafts', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100', time: '15m ago', desc: 'liked your "Vintage Ceramic Pot"', craft: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=100' },
    { id: 3, type: 'sale', user: 'Artisan Store', avatar: '', time: '1h ago', desc: 'Your listing was approved for Marketplace' },
    { id: 4, type: 'order', user: 'Rahul V.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100', time: '3h ago', desc: 'sent a purchase inquiry for "Clay Vase"', unread: true },
    { id: 5, type: 'follow', user: 'Zoya', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100', time: 'Yesterday', desc: 'is now following your collection' },
  ];

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="h-full flex flex-col">
       <div className="p-6 flex items-center justify-between border-b border-brand-beige bg-brand-cream/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button onClick={() => setScreen('HOME')} className="bg-brand-beige p-3 rounded-2xl">
               <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-display font-bold">Activity</h1>
          </div>
          <button className="text-[10px] font-bold text-brand-terracotta uppercase tracking-widest">Mark All Read</button>
       </div>

       <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar">
          {notifications.map((n) => (
             <div key={n.id} className={cn("flex items-start space-x-4 p-2 rounded-3xl transition-all", n.unread ? "bg-brand-terracotta/5 ring-1 ring-brand-terracotta/10" : "")}>
                <div className="relative">
                   {n.avatar ? (
                     <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-brand-beige">
                        <img src={n.avatar} className="w-full h-full object-cover" alt="U" />
                     </div>
                   ) : (
                     <div className="w-12 h-12 rounded-full bg-brand-terracotta/10 flex items-center justify-center border-2 border-brand-beige">
                        <Palette size={20} className="text-brand-terracotta" />
                     </div>
                   )}
                   <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm ring-1 ring-brand-beige">
                      {n.type === 'follow' && <Plus size={10} className="text-blue-500" />}
                      {n.type === 'like' && <Heart size={10} className="text-red-500 fill-red-500" />}
                      {n.type === 'sale' && <ShoppingBag size={10} className="text-green-500" />}
                      {n.type === 'order' && <Send size={10} className="text-brand-terracotta" />}
                   </div>
                </div>

                <div className="flex-1 space-y-1">
                   <p className="text-xs">
                      <span className="font-bold text-brand-dark">{n.user || 'System'}</span>
                      <span className="text-brand-dark/60 ml-1">{n.desc}</span>
                   </p>
                   <p className="text-[10px] font-bold text-brand-dark/30 uppercase tracking-tighter">{n.time}</p>
                </div>

                {n.craft && (
                   <div className="w-10 h-10 rounded-xl overflow-hidden border border-brand-beige">
                      <img src={n.craft} className="w-full h-full object-cover" alt="C" />
                   </div>
                )}
             </div>
          ))}
          
          <div className="pt-10 pb-20 text-center">
             <div className="bg-brand-beige/30 p-8 rounded-[40px] inline-block border border-brand-beige">
                <Palette size={32} className="text-brand-tan mx-auto mb-4 opacity-40" />
                <p className="text-[10px] font-bold text-brand-dark/40 uppercase tracking-widest leading-relaxed">You're all caught up with<br/>your artisan network!</p>
             </div>
          </div>
       </div>
    </motion.div>
  );
};

const BusinessAnalyticsScreen = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setShowScrollTop(scrollTop > 400);
  };

  const scrollToTop = () => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} className="h-full flex flex-col bg-brand-cream">
      <div className="p-6 flex items-center space-x-4 border-b border-brand-beige bg-brand-cream/80 backdrop-blur-md sticky top-0 z-10">
        <button onClick={() => setScreen('PROFILE')} className="bg-brand-beige p-3 rounded-2xl">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-display font-bold">Business Analytics</h1>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 p-6 space-y-8 overflow-y-auto no-scrollbar"
      >
        {/* Total Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[32px] border border-brand-beige shadow-sm space-y-2">
            <div className="w-10 h-10 bg-brand-terracotta/10 rounded-full flex items-center justify-center">
              <ShoppingBag size={18} className="text-brand-terracotta" />
            </div>
            <p className="text-2xl font-display font-bold">₹14.2K</p>
            <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest">Total Sales</p>
          </div>
          <div className="bg-white p-5 rounded-[32px] border border-brand-beige shadow-sm space-y-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Palette size={18} className="text-blue-500" />
            </div>
            <p className="text-2xl font-display font-bold">24</p>
            <p className="text-[10px] text-brand-dark/40 font-bold uppercase tracking-widest">Active Crafts</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="bg-white p-6 rounded-[40px] border border-brand-beige shadow-sm space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Profile Views</h3>
                <p className="text-[10px] text-green-500 font-bold">+12% this week</p>
              </div>
              <div className="flex space-x-1">
                 {['W', 'M', 'Y'].map(t => (
                   <button key={t} className={cn("px-3 py-1 rounded-full text-[10px] font-bold", t === 'W' ? "bg-brand-terracotta text-white" : "bg-brand-beige text-brand-dark/40")}>{t}</button>
                 ))}
              </div>
           </div>
           
           <div className="h-40 flex items-end space-x-3 pb-2 pt-4">
              {[40, 65, 45, 90, 55, 75, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-brand-beige/50 rounded-full relative group">
                   <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }}
                    className={cn("absolute bottom-0 left-0 right-0 rounded-full transition-all group-hover:bg-brand-terracotta", i === 3 ? "bg-brand-terracotta" : "bg-brand-tan/40")}
                   />
                </div>
              ))}
           </div>
           <div className="flex justify-between px-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={`${d}-${i}`} className="text-[10px] font-bold text-brand-dark/30">{d}</span>
              ))}
           </div>
        </div>

        {/* Audience Section */}
        <div className="space-y-4">
           <h3 className="text-sm font-bold px-2">Top Locations</h3>
           <div className="space-y-3">
              {[
                { city: 'Mumbai', value: '45%', color: 'bg-brand-terracotta' },
                { city: 'Delhi', value: '30%', color: 'bg-brand-tan' },
                { city: 'Bangalore', value: '15%', color: 'bg-brand-beige' },
                { city: 'Others', value: '10%', color: 'bg-brand-beige/50' },
              ].map((loc, i) => (
                <div key={i} className="bg-white/50 p-4 rounded-2xl border border-brand-beige flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                      <div className={cn("w-2 h-2 rounded-full", loc.color)}></div>
                      <span className="text-xs font-bold text-brand-dark/70">{loc.city}</span>
                   </div>
                   <span className="text-xs font-display font-bold">{loc.value}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
      
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 p-3 bg-brand-dark/10 backdrop-blur-xl border border-white/20 text-brand-dark rounded-full shadow-lg z-[60] hover:bg-brand-terracotta hover:text-white transition-colors"
          >
            <ChevronUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <BottomNav active="PROFILE" setScreen={setScreen} onActiveClick={scrollToTop} />
    </motion.div>
  );
};

const SuccessSplash = ({ setScreen }: { setScreen: (s: Screen) => void }) => {
  return (
    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="fixed inset-0 bg-brand-cream z-[100] flex flex-col items-center justify-center p-8 space-y-8">
       <div className="relative">
          <div className="bg-brand-beige p-8 rounded-3xl relative z-10 scale-110">
             <ShoppingBag size={48} className="text-brand-terracotta" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand-terracotta/10 rounded-full blur-2xl"></div>
          {/* Confetti-like bits could be added here */}
       </div>
       <div className="text-center space-y-2">
          <h1 className="text-3xl font-display font-bold">Congratulations!</h1>
          <p className="text-sm text-brand-dark/50 font-medium px-8 leading-relaxed">Your account is complete, welcome to Arsartive!</p>
       </div>
       <Button onClick={() => setScreen('SETUP_PROFILE')}>Continue</Button>
    </motion.div>
  );
};

const SetupProfileScreen = ({ setScreen, sharedData, setSharedData }: { setScreen: (s: Screen) => void, sharedData: SharedData, setSharedData: any }) => {
  const [formData, setFormData] = useState({
    firstName: sharedData.user.firstName,
    lastName: sharedData.user.lastName,
    username: sharedData.user.username
  });

  const handleComplete = () => {
    setSharedData((prev: any) => ({
      ...prev,
      user: {
        ...prev.user,
        ...formData
      }
    }));
    setScreen('HOME');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 h-full flex flex-col space-y-8 bg-brand-cream overflow-y-auto no-scrollbar">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold">Setup Profile</h1>
        <p className="text-brand-dark/50 text-sm italic">"Complete your artisan identity to start sharing"</p>
      </div>

      <div className="flex flex-col items-center space-y-4 py-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-brand-terracotta p-1 bg-brand-cream ring-8 ring-brand-terracotta/5">
            <img src={sharedData.user.avatar} className="w-full h-full object-cover rounded-full" alt="profile" />
          </div>
          <button className="absolute bottom-0 right-0 bg-brand-terracotta text-white p-2 rounded-full shadow-lg">
            <Camera size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-5 flex-1">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-dark/60 ml-1 uppercase tracking-tighter">First Name</label>
            <input 
              defaultValue={formData.firstName}
              placeholder="First name"
              className="w-full bg-white/50 border border-brand-beige rounded-2xl p-4 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none transition-all placeholder:text-brand-dark/20"
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-brand-dark/60 ml-1 uppercase tracking-tighter">Last Name</label>
            <input 
              defaultValue={formData.lastName}
              placeholder="Last name"
              className="w-full bg-white/50 border border-brand-beige rounded-2xl p-4 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none transition-all placeholder:text-brand-dark/20"
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-brand-dark/60 ml-1 uppercase tracking-tighter">Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 font-bold">@</span>
            <input 
              defaultValue={formData.username}
              placeholder="your_unique_id"
              className="w-full bg-white/50 border border-brand-beige rounded-2xl p-4 pl-8 text-sm font-bold text-brand-dark focus:ring-2 focus:ring-brand-terracotta outline-none transition-all placeholder:text-brand-dark/20"
              autoCapitalize="none"
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_') })}
            />
          </div>
        </div>

        <div className="pt-4">
           <div className="bg-brand-terracotta/5 p-4 rounded-2xl border border-brand-terracotta/10 flex items-start space-x-3">
              <Shield size={16} className="text-brand-terracotta mt-0.5" />
              <p className="text-[10px] text-brand-dark/60 leading-relaxed font-medium">Your username will be visible to other crafters. You can change this later in settings.</p>
           </div>
        </div>
      </div>

      <div className="pb-4">
        <Button onClick={handleComplete}>Complete Discovery</Button>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<Screen>('SPLASH');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  const [sharedData, setSharedData] = useState<SharedData>({
    user: {
      firstName: 'Ananya',
      lastName: 'Sharma',
      username: 'ananya_crafts',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
    },
    viewerCurrency: 'INR',
    upload: {
      name: 'Vintage Ceramic Pot',
      description: 'A hand-crafted piece inspired by ancient Mesopotamian techniques, finished with a rustic matte glaze.',
      isForSale: true,
      price: '1250',
      currency: 'INR',
      materials: 'Fine Clay, Hand-mixed Glaze',
      showPrice: true,
      tags: ['Ceramics', 'Handmade', 'Gift'],
      contentType: 'POST',
      photoCount: 3,
      reelDuration: 5,
      images: []
    },
    posts: [
      {
        id: 1,
        user: 'Riya Art',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
        time: '3h ago',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&q=80&w=1000',
        liked: true,
        likes: 124,
        isForSale: true,
        priceAmount: 1250,
        currency: 'INR'
      },
      {
        id: 2,
        user: 'CraftyHands',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
        time: '5h ago',
        image: 'https://images.unsplash.com/photo-1544413647-ad3474d0819a?auto=format&fit=crop&q=80&w=1000',
        liked: false,
        likes: 89,
        isForSale: false
      },
      {
        id: 3,
        user: 'Cerama_Studio',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
        time: '12h ago',
        image: 'https://images.unsplash.com/photo-1565193998248-d50c1c8a149c?auto=format&fit=crop&q=80&w=1000',
        liked: false,
        likes: 245,
        isForSale: true,
        priceAmount: 4800,
        currency: 'INR'
      }
    ],
    activeChat: null,
    activeProfile: null
  });

  const navigateToProfile = (user: any) => {
    setSharedData(prev => ({ ...prev, activeProfile: user }));
    setScreen('OTHER_PROFILE');
  };

  const navigateToChat = (chat: any) => {
    setSharedData(prev => ({ ...prev, activeChat: chat }));
    setScreen('CHAT');
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans selection:bg-brand-terracotta/20">
      <AnimatePresence mode="wait">
        {screen === 'SPLASH' && (
          <SplashScreen key="splash" onComplete={() => setScreen('ONBOARDING')} />
        )}

        {screen === 'ONBOARDING' && (
          <OnboardingScreen key="onboard" setScreen={setScreen} />
        )}

        {screen === 'AUTH_LOGIN' && (
          <LoginScreen key="login" setScreen={setScreen} />
        )}

        {screen === 'AUTH_SIGNUP' && (
          <SignupScreen key="signup" setScreen={setScreen} setSharedData={setSharedData} />
        )}

        {screen === 'AUTH_VERIFY' && (
          <VerifyScreen key="verify" setScreen={setScreen} />
        )}

        {screen === 'HOME' && (
          <HomeScreen key="home" setScreen={setScreen} navigateToProfile={navigateToProfile} sharedData={sharedData} setSharedData={setSharedData} />
        )}

        {screen === 'EXPLORE' && (
          <ExploreScreen key="explore" setScreen={setScreen} navigateToProfile={navigateToProfile} />
        )}

        {screen === 'MY_BUSINESS' && (
          <BusinessScreen key="business" setScreen={setScreen} />
        )}

        {screen === 'MESSAGES' && (
          <MessagesScreen key="messages" setScreen={setScreen} navigateToChat={navigateToChat} />
        )}

        {screen === 'PROFILE' && (
          <ProfileScreen key="profile" setScreen={setScreen} sharedData={sharedData} />
        )}

        {screen === 'UPLOAD' && (
          <UploadScreen key="upload" setScreen={setScreen} sharedData={sharedData} setSharedData={setSharedData} />
        )}

        {screen === 'UPLOAD_PREVIEW' && (
          <UploadPreviewScreen key="upload-preview" setScreen={setScreen} sharedData={sharedData} setSharedData={setSharedData} />
        )}

        {screen === 'SETTINGS_PRIVACY' && (
          <SettingsPrivacyScreen key="settings-privacy" setScreen={setScreen} />
        )}

        {screen === 'SETTINGS_EDIT_PROFILE' && (
          <SettingsEditProfileScreen key="settings-edit" setScreen={setScreen} sharedData={sharedData} setSharedData={setSharedData} />
        )}

        {screen === 'SETTINGS_HELP' && (
          <SettingsHelpScreen key="settings-help" setScreen={setScreen} />
        )}
        
        {screen === 'SETTINGS_SECURITY' && (
          <SettingsSecurityScreen key="settings-security" setScreen={setScreen} />
        )}
        
        {screen === 'BUSINESS_ANALYTICS' && (
          <BusinessAnalyticsScreen setScreen={setScreen} />
        )}

        {screen === 'NOTIFICATIONS' && (
          <NotificationsScreen setScreen={setScreen} />
        )}

        {screen === 'SETUP_PROFILE' && (
          <SetupProfileScreen setScreen={setScreen} sharedData={sharedData} setSharedData={setSharedData} />
        )}

        {screen === 'CHAT' && (
          <ChatScreen setScreen={setScreen} sharedData={sharedData} />
        )}

        {screen === 'OTHER_PROFILE' && (
          <OtherProfileScreen setScreen={setScreen} sharedData={sharedData} />
        )}
      </AnimatePresence>
      
      {/* Safe Area Padding for Mobile Bottom Nav */}
      {(['HOME', 'EXPLORE', 'MY_BUSINESS', 'MESSAGES', 'PROFILE', 'UPLOAD'].includes(screen)) && (
        <div className="h-20" />
      )}
    </div>
  );
}
