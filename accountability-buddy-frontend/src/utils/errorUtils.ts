export function isAxiosError(
  error: unknown
): error is { response: { data: { message: string } } } {
  return (
    typeof error === 'object' && // Ensure error is an object
    error !== null && // Ensure error is not null
    'response' in error && // Check if the 'response' property exists
    typeof (error as { response?: unknown }).response === 'object' && // Ensure response is an object
    (error as { response?: { data?: unknown } }).response?.data !== undefined
  );
}
