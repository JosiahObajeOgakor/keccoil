export function generateWhatsAppLink(
  phoneNumber: string,
  productName: string,
  productId: string,
  quantity: number = 1
): string {
  const message = encodeURIComponent(
    `Hello, I&apos;m interested in ordering:\n\n📦 ${productName}\n💬 Quantity: ${quantity}\n\nPlease provide more details and pricing information.`
  );
  
  // Remove spaces and special characters from phone number, keep only digits
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  return `https://wa.me/${cleanPhone}?text=${message}`;
}

export function formatPhoneNumber(phone: string): string {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3');
}

export function generateCustomMessage(productName: string, details?: string): string {
  let message = `Hi, I&apos;m interested in: ${productName}`;
  if (details) {
    message += `\n\nDetails: ${details}`;
  }
  return message;
}
