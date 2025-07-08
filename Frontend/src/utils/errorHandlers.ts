import { toast } from 'react-hot-toast';

export const getFirstErrorMessage = (errors: Record<string, string[]>): string => {
  const firstField = Object.keys(errors)[0];
  return errors[firstField][0];
};

export const handleApiError = (response: any): void => {
  // Show most specific error available: field errors > general message > fallback
  if (response.errors) {
    const firstErrorField = Object.keys(response.errors)[0];
    const firstError = response.errors[firstErrorField][0];
    toast.error(firstError);
  } else {
    toast.error(response.message || 'An error occurred');
  }
};

export const handleCatchError = (err: any): void => {
  const backendResponse = err?.response?.data;
  
  if (backendResponse?.errors) {
    toast.error(getFirstErrorMessage(backendResponse.errors));
  } else if (backendResponse?.message) {
    toast.error(backendResponse.message);
  } else {
    toast.error('Something went wrong. Please try again later.');
  }
  
  console.error('Failed to add student:', err);
};