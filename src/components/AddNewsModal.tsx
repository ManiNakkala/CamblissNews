import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AddNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddNewsModal: React.FC<AddNewsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated, addCamblissPoints } = useAuth();
  const { currentLanguage } = useLanguage();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    category: 'breaking',
    source: 'Cambliss Community',
    tags: ''
  });

  const categories = [
    { value: 'breaking', label: 'Breaking News', icon: '🚨' },
    { value: 'politics', label: 'Politics', icon: '🏛️' },
    { value: 'india', label: 'India', icon: '🇮🇳' },
    { value: 'world', label: 'World', icon: '🌍' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'technology', label: 'Technology', icon: '💻' },
    { value: 'sports', label: 'Sports', icon: '⚽' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'health', label: 'Health', icon: '🏥' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const calculateReadTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (formData.title.length < 10) {
      setError('Title must be at least 10 characters');
      return false;
    }
    if (!formData.summary.trim()) {
      setError('Summary is required');
      return false;
    }
    if (formData.summary.length < 20) {
      setError('Summary must be at least 20 characters');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Content is required');
      return false;
    }
    if (formData.content.length < 100) {
      setError('Content must be at least 100 characters');
      return false;
    }
    if (!formData.imageUrl.trim()) {
      setError('Image URL is required');
      return false;
    }
    if (!formData.imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i)) {
      setError('Please provide a valid image URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      setError('You must be logged in to add news');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Placeholder for future fake news detection integration
      // This is where AI-based fact-checking would be integrated
      // checkFakeNewsPlaceholder(formData);

      const readTime = calculateReadTime(formData.content);
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Get Supabase connection details from environment
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Database configuration not found');
      }

      const newArticle = {
        title: formData.title.trim(),
        summary: formData.summary.trim(),
        content: formData.content.trim(),
        image_url: formData.imageUrl.trim(),
        category: formData.category,
        source: formData.source.trim() || 'Cambliss Community',
        author: user.fullName,
        author_id: user.id,
        language: currentLanguage,
        tags: tagsArray,
        is_premium: false,
        read_time: readTime,
        published_at: new Date().toISOString(),
        is_verified: false,
        verification_score: 0.00
      };

      // Insert into Supabase
      const response = await fetch(`${supabaseUrl}/rest/v1/user_articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(newArticle)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to publish article');
      }

      const createdArticle = await response.json();

      // Award Cambliss Points for publishing
      addCamblissPoints(50, 'Published news article');

      // Update published stories count
      if (user.publishedStories !== undefined) {
        const updatedUser = { ...user, publishedStories: user.publishedStories + 1 };
        localStorage.setItem('cambliss-user', JSON.stringify(updatedUser));
      }

      setSuccess(true);

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 2000);

    } catch (err: any) {
      console.error('Error publishing article:', err);
      setError(err.message || 'Failed to publish article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      imageUrl: '',
      category: 'breaking',
      source: 'Cambliss Community',
      tags: ''
    });
    setError('');
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add News Article</h2>
                <p className="text-red-100 text-sm mt-1">Share news with the Cambliss community</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-6 m-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-green-800 font-semibold">Article published successfully!</h3>
                <p className="text-green-700 text-sm mt-1">You earned 50 Cambliss Points</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      formData.category === cat.value
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-red-300 text-gray-700'
                    }`}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <div className="text-xs font-medium">{cat.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter a compelling headline..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length} characters (minimum 10)</p>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label htmlFor="summary" className="block text-sm font-semibold text-gray-900 mb-2">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Brief summary of the article (shown in previews)..."
                rows={3}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.summary.length} characters (minimum 20)</p>
            </div>

            {/* Content */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Article Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your full article content here..."
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length} characters (minimum 100) •
                Estimated read time: {calculateReadTime(formData.content)} min
              </p>
            </div>

            {/* Image URL */}
            <div className="mb-6">
              <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-900 mb-2">
                Image URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {formData.imageUrl && formData.imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i) && (
                <div className="mt-3">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    onError={() => setError('Invalid image URL')}
                  />
                </div>
              )}
            </div>

            {/* Source */}
            <div className="mb-6">
              <label htmlFor="source" className="block text-sm font-semibold text-gray-900 mb-2">
                Source (optional)
              </label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source}
                onChange={handleChange}
                placeholder="Cambliss Community"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isSubmitting}
              />
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="breaking, politics, delhi, government"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
            </div>

            {/* Fake News Detection Placeholder */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> All articles will be reviewed for accuracy.
                Future integration will include AI-powered fake news detection.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-all"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" />
                    <span>Publish Article</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddNewsModal;
