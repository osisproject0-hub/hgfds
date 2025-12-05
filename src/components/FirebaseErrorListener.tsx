'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It logs the detailed error to the console for developers but does not show a toast.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      // Log the detailed, developer-friendly error message to the console.
      // This prevents showing a disruptive toast to the end-user for permission issues
      // while still providing debugging information for developers.
      console.error("Caught Firestore Permission Error:", error.message);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component renders nothing.
  return null;
}
