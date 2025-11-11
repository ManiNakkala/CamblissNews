import React, { useState } from 'react';
import { Play, Clock, Headphones, Crown } from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { usePremium } from '../hooks/usePremium';
import MiniPlayer from '../components/MiniPlayer';

interface PodcastEpisode {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  imageUrl: string;
  publishedAt: Date;
}

const PodcastsPage: React.FC = () => {
  const { articles } = useNews();
  const { isPremium } = usePremium();
  const [currentEpisode, setCurrentEpisode] = useState<PodcastEpisode | null>(null);

  const episodes: PodcastEpisode[] = articles.slice(0, 6).map((article, index) => ({
    id: article.id,
    title: `${article.title} (Audio)`,
    duration: 754 + Math.floor(Math.random() * 600),
    audioUrl: `https://fakeaudio.com/${article.id}.mp3`,
    imageUrl: article.imageUrl,
    publishedAt: article.publishedAt
  }));

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    setCurrentEpisode(episode);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Headphones className="w-10 h-10" />
                <h1 className="text-4xl md:text-5xl font-bold">Podcasts</h1>
              </div>
              <p className="text-xl text-purple-100">
                Listen to news stories narrated by our team
              </p>
            </div>

            {!isPremium && (
              <div className="hidden md:block bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <Crown className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-semibold">Premium</p>
                <p className="text-xs text-purple-100">Full Access</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!isPremium && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <Crown className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Free Preview Available</h3>
                <p className="text-gray-700 text-sm">
                  Listen to the first 60 seconds of any episode. Subscribe to Premium for full access to all episodes.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Episodes</h2>
          <p className="text-gray-600 mt-1">{episodes.length} episodes available</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {episodes.map((episode) => (
            <div
              key={episode.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={episode.imageUrl}
                  alt={episode.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handlePlayEpisode(episode)}
                    className="bg-red-600 hover:bg-red-700 p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
                {!isPremium && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    60s Preview
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                  {episode.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formatDuration(episode.duration)}
                  </span>
                  <span className="text-xs">
                    {new Date(episode.publishedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Cambliss News</span>
                  <button
                    onClick={() => handlePlayEpisode(episode)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {isPremium && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center">
            <Crown className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You have Premium Access</h3>
            <p className="text-gray-600">
              Enjoy unlimited listening to all podcast episodes
            </p>
          </div>
        )}
      </div>

      <MiniPlayer
        episode={currentEpisode}
        onClose={() => setCurrentEpisode(null)}
      />
    </div>
  );
};

export default PodcastsPage;
