// Web Crypto API utilities for zero-knowledge encryption
// Based on AES-256-GCM with PBKDF2 key derivation

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  authTag: string;
}

/**
 * Generate cryptographic salt for key derivation
 */
export const generateSalt = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(16));
};

/**
 * Generate initialization vector for encryption
 */
export const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(12));
};

/**
 * Derive encryption key from master password using PBKDF2
 * @param password - Master password
 * @param salt - Cryptographic salt
 * @param iterations - Number of iterations (default: 100000)
 */
export const deriveKey = async (
  password: string,
  salt: Uint8Array,
  iterations: number = 100000
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Import password as key material
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  // Derive AES-GCM key
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

/**
 * Encrypt plaintext using AES-256-GCM
 * @param plaintext - Data to encrypt
 * @param masterPassword - User's master password
 */
export const encryptSecret = async (
  plaintext: string,
  masterPassword: string
): Promise<EncryptedData> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Generate random salt and IV
  const salt = generateSalt();
  const iv = generateIV();

  // Derive encryption key
  const key = await deriveKey(masterPassword, salt);

  // Encrypt data
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    data
  );

  // Extract ciphertext and auth tag
  const encryptedArray = new Uint8Array(encryptedBuffer);
  const ciphertext = encryptedArray.slice(0, -16);
  const authTag = encryptedArray.slice(-16);

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    iv: arrayBufferToBase64(iv),
    salt: arrayBufferToBase64(salt),
    authTag: arrayBufferToBase64(authTag),
  };
};

/**
 * Decrypt ciphertext using AES-256-GCM
 * @param encryptedData - Encrypted data object
 * @param masterPassword - User's master password
 */
export const decryptSecret = async (
  encryptedData: EncryptedData,
  masterPassword: string
): Promise<string> => {
  try {
    const salt = base64ToArrayBuffer(encryptedData.salt);
    const iv = base64ToArrayBuffer(encryptedData.iv);
    const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
    const authTag = base64ToArrayBuffer(encryptedData.authTag);

    // Combine ciphertext and auth tag
    const combined = new Uint8Array(ciphertext.length + authTag.length);
    combined.set(new Uint8Array(ciphertext), 0);
    combined.set(new Uint8Array(authTag), ciphertext.length);

    // Derive decryption key
    const key = await deriveKey(masterPassword, new Uint8Array(salt));

    // Decrypt data
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: new Uint8Array(iv),
        tagLength: 128,
      },
      key,
      combined
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    throw new Error('Decryption failed. Invalid password or corrupted data.');
  }
};

/**
 * Convert ArrayBuffer to Base64 string
 */
const arrayBufferToBase64 = (buffer: Uint8Array): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
};

/**
 * Convert Base64 string to ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Calculate password strength score (0-100)
 */
export const calculatePasswordStrength = (password: string): number => {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;

  if (/[a-z]/.test(password)) score += 15;
  if (/[A-Z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;

  return Math.min(score, 100);
};

/**
 * Generate AI-based password feedback
 */
export const generatePasswordFeedback = (password: string): string[] => {
  const feedback: string[] = [];

  if (password.length < 12) {
    feedback.push('Password should be at least 12 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    feedback.push('Add uppercase letters for better security');
  }

  if (!/[0-9]/.test(password)) {
    feedback.push('Include numbers to increase entropy');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    feedback.push('Use special characters (!@#$%^&*) for stronger protection');
  }

  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters');
  }

  if (/^(123|abc|qwerty|password)/i.test(password)) {
    feedback.push('Avoid common patterns and dictionary words');
  }

  if (feedback.length === 0) {
    feedback.push('Strong password! Consider adding more entropy.');
  }

  return feedback;
};
