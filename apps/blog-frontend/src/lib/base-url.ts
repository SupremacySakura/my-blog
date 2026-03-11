export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }
  return process.env.INTERNAL_API_URL || 'http://backend:5050';
}
