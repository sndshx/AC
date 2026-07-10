/**
 * Toast utility for displaying notifications
 * This is a simple implementation that can be enhanced with a toast provider
 */

type Toast = {
  title: string;
  description?: string;
  tone?: "success" | "error" | "info" | "warning";
};

/**
 * Show a toast notification
 * For now, this uses browser alert as a fallback
 * In a production app, this would integrate with a toast provider/system
 */
export function showToast(toast: Toast) {
  // Fallback implementation using browser alert
  // This should be replaced with proper toast implementation
  const message = toast.description 
    ? `${toast.title}: ${toast.description}` 
    : toast.title;
  
  // In a browser environment, use alert as fallback
  if (typeof window !== 'undefined') {
    alert(message);
  } else {
    // On server side, log the message
    console.log(`Toast: ${message}`);
  }
}

// Export default implementation
const toastUtils = {
  showToast
};

export default toastUtils;