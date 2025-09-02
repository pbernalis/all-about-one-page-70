import { useState, useEffect } from 'react';

export function useMobileGuard() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isDesktop;
}