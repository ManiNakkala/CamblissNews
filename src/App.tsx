import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import MyNewsPage from "./pages/MyNewsPage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import SocialPage from "./pages/SocialPage";
import UserDashboard from "./components/UserDashboard";
import FullArticle from "./components/FullArticle";
import Chatbot from "./components/Chatbot";
import VoiceReader from "./components/VoiceReader";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import { NewsProvider } from "./context/NewsContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { SubscriptionProvider } from "./context/SubscriptionContext";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";

function App() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [showFullArticle, setShowFullArticle] = useState(false);

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <NewsProvider>
          <LanguageProvider>
            <div className="min-h-screen bg-gray-50">
              <Header />
              <main className="pt-20">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage onArticleClick={(article) => {
                      setSelectedArticle(article);
                      setShowFullArticle(true);
                    }} />} />
                  <Route path="/social" element={<SocialPage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage onArticleClick={(article) => {
                      setSelectedArticle(article);
                      setShowFullArticle(true);
                    }} />} />
                  <Route path="/news/:type" element={<SearchPage onArticleClick={(article) => {
                      setSelectedArticle(article);
                      setShowFullArticle(true);
                    }} />} />

                  {/* Clerk Auth Routes */}
                  <Route path="/sign-in/*" element={<SignInPage />} />
                  <Route path="/sign-up/*" element={<SignUpPage />} />

                  {/* Protected Routes */}
                  <Route
                    path="/my-news"
                    element={
                      <SignedIn>
                        <MyNewsPage
                          onArticleClick={(article) => {
                            setSelectedArticle(article);
                            setShowFullArticle(true);
                          }}
                        />
                      </SignedIn>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <SignedIn>
                        <UserDashboard />
                      </SignedIn>
                    }
                  />
                  <Route
                    path="/subscription"
                    element={
                      <SignedIn>
                        <SubscriptionPage />
                      </SignedIn>
                    }
                  />
                  <Route
                    path="/subscription/success"
                    element={
                      <SignedIn>
                        <SubscriptionSuccess />
                      </SignedIn>
                    }
                  />

                  {/* Redirect signed-out users */}
                  <Route
                    path="/protected"
                    element={
                      <SignedOut>
                        <RedirectToSignIn />
                      </SignedOut>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>

              <Footer />

              {showFullArticle && selectedArticle && (
                <FullArticle
                  article={selectedArticle}
                  onClose={() => setShowFullArticle(false)}
                />
              )}

              <VoiceReader />
              <Chatbot />
            </div>
          </LanguageProvider>
        </NewsProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
