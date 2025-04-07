'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function DatabaseInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Only run once on the client side
    if (!initialized) {
      const initializeDatabase = async () => {
        try {
          console.log('Initializing database with triggers...');
          const response = await fetch('/api/init');
          const data = await response.json();
          
          if (data.success) {
            console.log('Database initialized successfully');
            toast.success('Database initialized with all triggers', {
              duration: 3000,
              id: 'db-init',
            });
          } else {
            console.error('Database initialization failed:', data.message);
            toast.error('Database initialization failed. Check console for details.', {
              duration: 5000,
              id: 'db-init-error',
            });
          }
        } catch (error) {
          console.error('Error initializing database:', error);
          toast.error('Failed to connect to database initialization service', {
            duration: 5000,
            id: 'db-init-error',
          });
        }
        
        setInitialized(true);
      };

      // Run the initialization
      initializeDatabase();
    }
  }, [initialized]);

  // This component doesn't render anything
  return null;
}