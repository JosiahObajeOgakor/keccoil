export const API_BASE_URL = 'https://api.keceoil.com';

export const ADMIN_PHONE = process.env.NEXT_PUBLIC_ADMIN_PHONE || '234 703 998 6047';

export const WHATSAPP_BUSINESS_NUMBER = '2347039986047';

/** Convert kobo to formatted Naira string */
export function formatPrice(kobo: number): string {
  return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
