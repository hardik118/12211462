/**
 * Function: generateCode
 * -----------------------
 * Generates a random alphanumeric string to be used as a unique shortcode
 * for shortened URLs.
 * 
 * Parameters:
 * - length: number (optional, default = 6)
 *   Specifies the desired length of the shortcode.
 * 
 * Logic:
 * - Uses characters a-z, A-Z, and 0-9.
 * - Iterates `length` times, appending a random character to the result string.
 * - Ensures that all generated codes are URL-safe and valid for redirection purposes.
 * 
 * Returns:
 * - A string of given length that can be used as a unique identifier in URLs.
 * 
 * Note:
 * - The function does not check for uniqueness in storage; it should be
 *   validated externally (e.g., in the service layer) before use.
 */


export function generateCode(length = 6): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
