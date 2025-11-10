import React, { useState, useEffect } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Globe,
  Search,
  Menu,
  X,
  Clock,
  Radio,
  Zap,
  Users,
  Tv,
  Crown,
  Star,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { useLanguage } from "../context/LanguageContext";
import { useNews } from "../context/NewsContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMyNewsPreferences, setHasMyNewsPreferences] = useState(false);
  const { currentLanguage, setLanguage, languages, translations } = useLanguage();
  const { lastUpdated, articles, refreshNews } = useNews();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const categories = [
    { name: "Home", path: "/", key: "home" },
    { name: "India", path: "/category/india", key: "india" },
    { name: "World", path: "/category/world", key: "world" },
    { name: "Business", path: "/category/business", key: "business" },
    { name: "Technology", path: "/category/technology", key: "technology" },
    { name: "Sports", path: "/category/sports", key: "sports" },
    { name: "Entertainment", path: "/category/entertainment", key: "entertainment" },
    { name: "Health", path: "/category/health", key: "health" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/news/search?q=${encodeURIComponent(searchQuery)}&lang=${currentLanguage}&t=${Date.now()}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

    if (diff < 60) return `Updated ${diff}s ago`;
    if (diff < 120) return `Updated 1m ago`;
    if (diff < 3600) return `Updated ${Math.floor(diff / 60)}m ago`;
    return `Updated ${Math.floor(diff / 3600)}h ago`;
  };

  const isActivePath = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return location.pathname.startsWith(path) && path !== "/";
  };

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`myNewsCategories_${user.id}`);
      setHasMyNewsPreferences(!!saved);
    } else {
      setHasMyNewsPreferences(false);
    }
  }, [user]);

  return (
    <header className="fixed top-0 left-0 right-0 bbc-header z-40">
      {/* Top Bar */}
      <div className="bbc-breaking text-white py-2 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="bbc-live flex items-center space-x-2">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>LIVE</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 bg-white/20 px-3 py-1">
                <Clock className="w-3 h-3" />
                <span>{formatLastUpdated()}</span>
              </div>

              <div className="flex items-center space-x-1 bg-white/20 px-3 py-1">
                <Users className="w-3 h-3" />
                <span>{articles.length}+ Articles</span>
              </div>

              <button
                onClick={refreshNews}
                className="bbc-button flex items-center space-x-1 px-3 py-1 text-white bg-white/20 hover:bg-white/30 transition-all"
              >
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={currentLanguage}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/20 text-white text-xs border-none outline-none cursor-pointer px-3 py-1"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.code}
                    className="bg-black text-white"
                  >
                    {lang.nativeName}
                  </option>
                ))}
              </select>

              <Link
                to="/subscription"
                className="hidden md:flex items-center space-x-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-3 py-1 transition-all"
              >
                <Crown className="w-3 h-3" />
                <span className="text-xs font-bold">Premium</span>
              </Link>

              <div className="hidden md:block bg-white/20 px-3 py-1">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bbc-nav">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="bg-red-600 p-2">
                    <Tv className="w-8 h-8 text-white group-hover:text-red-200 transition-colors" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-600 animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-black group-hover:text-red-600 transition-colors">
                    Cambliss
                  </h1>
                  <p className="text-xs font-medium -mt-1 uppercase tracking-wider text-gray-500">
                    NEWS
                  </p>
                </div>
              </Link>

              <nav className="hidden lg:flex space-x-2">
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    to={category.path}
                    className={`bbc-nav-item px-5 py-2 text-sm font-medium transition-all duration-200 ${
                      isActivePath(category.path) ? "active" : ""
                    }`}
                  >
                    {translations[category.key] || category.name}
                  </Link>
                ))}

                {hasMyNewsPreferences && (
                  <Link
                    to="/my-news"
                    className={`bbc-nav-item px-5 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                      location.pathname === "/my-news" ? "active" : ""
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    <span>My News</span>
                  </Link>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-3">
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={translations.searchPlaceholder}
                    className="bbc-search pl-10 pr-4 py-2.5 w-56 transition-all"
                  />
                </div>
              </form>

              {/* Clerk Auth */}
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bbc-button-primary text-white px-4 py-2 font-medium text-sm">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden bbc-button p-2 text-black transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bbc-nav border-t border-gray-200 shadow-lg">
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={translations.searchPlaceholder}
                    className="bbc-search w-full pl-10 pr-4 py-2"
                  />
                </div>
              </form>

              <nav className="space-y-1">
                {categories.map((category) => (
                  <Link
                    key={category.key}
                    to={category.path}
                    className={`bbc-nav-item block px-3 py-2 text-base font-medium transition-colors mb-2 ${
                      isActivePath(category.path) ? "active" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {translations[category.key] || category.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
