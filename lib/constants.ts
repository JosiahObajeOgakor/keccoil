export const API_BASE_URL = 'https://api.keceoil.com';

export const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || '234 812 345 6789';

export const WHATSAPP_BUSINESS_NUMBER = '2348123456789';

/** Convert kobo to formatted Naira string */
export function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
