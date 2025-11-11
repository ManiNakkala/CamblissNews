import { useState, useEffect } from 'react';
import { useSubscription } from '../context/SubscriptionContext';

export const usePremium = () => {
  const { isPremium: subscriptionIsPremium } = useSubscription();
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const checkPremium = () => {
      const localPremium = localStorage.getItem('isPremium') === 'true';
      setIsPremium(subscriptionIsPremium || localPremium);
    };

    checkPremium();

    const handleStorageChange = () => {
      checkPremium();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('premiumStatusChanged', checkPremium);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('premiumStatusChanged', checkPremium);
    };
  }, [subscriptionIsPremium]);

  return { isPremium };
};
