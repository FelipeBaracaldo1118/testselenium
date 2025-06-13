import DOMPurify from 'dompurify';

// Input sanitization utility
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove potentially dangerous characters and scripts
  const cleaned = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  return cleaned.trim();
};

// Validate subject data
export const validateSubject = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.subjectName || data.subjectName.trim().length < 2) {
    errors.push('Subject name must be at least 2 characters long');
  }
  
  if (!data.credits || data.credits < 1 || data.credits > 10) {
    errors.push('Credits must be between 1 and 10');
  }
  
  if (!data.professor || data.professor.trim().length < 2) {
    errors.push('Professor name must be at least 2 characters long');
  }
  
  if (!data.department || data.department.trim().length < 2) {
    errors.push('Department must be at least 2 characters long');
  }
  
  if (!data.description || data.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate secure subject ID
export const generateSubjectId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `SUBJ_${timestamp}_${randomStr}`.toUpperCase();
};

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const checkRateLimit = (ip: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean => {
  const now = Date.now();
  const key = `rate_limit_${ip}`;
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (existing.count >= limit) {
    return false;
  }
  
  existing.count++;
  return true;
};

// Security headers
export const getSecurityHeaders = () => ({
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
});