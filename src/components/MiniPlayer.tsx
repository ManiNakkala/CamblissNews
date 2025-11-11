import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePremium } from '../hooks/usePremium';

interface MiniPlayerProps {
  episode: {
    id: string;
    title: string;
    duration: number;
    audioUrl: string;
  } | null;
  onClose: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ episode, onClose }) => {
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const FREE_LIMIT = 60;

  useEffect(() => {
    if (!episode) {
      setIsPlaying(false);
      setCurrentTime(0);
      setShowUpgradePrompt(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
    }

    audioRef.current.src = episode.audioUrl;
    setIsPlaying(true);
    audioRef.current.play();

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [episode]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      if (!isPremium && time >= FREE_LIMIT) {
        audioRef.current.pause();
        setIsPlaying(false);
        setShowUpgradePrompt(true);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !episode) return;

    if (!isPremium && currentTime >= FREE_LIMIT) {
      setShowUpgradePrompt(true);
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !episode) return;
    if (!isPremium && currentTime >= FREE_LIMIT) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * (isPremium ? episode.duration : FREE_LIMIT);

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleUpgrade = () => {
    navigate('/subscription');
  };

  const handleClosePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!episode) return null;

  const maxDuration = isPremium ? episode.duration : FREE_LIMIT;
  const progress = (currentTime / maxDuration) * 100;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-2xl z-50 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <button
              onClick={togglePlayPause}
              className="bg-red-600 hover:bg-red-700 p-3 rounded-full transition-all"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{episode.title}</h4>
              <p className="text-xs text-gray-400">Cambliss News</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 flex-1">
            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatTime(currentTime)}
            </span>

            <div className="flex-1 relative">
              <div
                onClick={handleProgressClick}
                className="h-2 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
              >
                <div
                  className="h-full bg-red-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {!isPremium && (
                <div
                  className="absolute top-0 h-2 w-0.5 bg-yellow-500"
                  style={{ left: `${(FREE_LIMIT / episode.duration) * 100}%` }}
                />
              )}
            </div>

            <span className="text-xs text-gray-400 whitespace-nowrap">
              {formatTime(maxDuration)}
            </span>
          </div>

          <button
            onClick={handleClosePlayer}
            className="p-2 hover:bg-gray-700 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {showUpgradePrompt && (
          <div className="mt-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6" />
              <div>
                <p className="font-semibold text-sm">Subscribe to Continue</p>
                <p className="text-xs text-white/90">Get full access to all episodes</p>
              </div>
            </div>
            <button
              onClick={handleUpgrade}
              className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Upgrade Now
            </button>
          </div>
        )}

        {!isPremium && !showUpgradePrompt && currentTime < FREE_LIMIT && (
          <div className="mt-2 text-center">
            <p className="text-xs text-yellow-400">
              Free preview: {formatTime(FREE_LIMIT - currentTime)} remaining
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniPlayer;
