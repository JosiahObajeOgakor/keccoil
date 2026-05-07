export type DeliveryMethod = 'pickup' | 'dispatch';

export function generateWhatsAppLink(
  phoneNumber: string,
  productName: string,
  productId: string,
  quantity: number = 1,
  deliveryMethod?: DeliveryMethod
): string {
  let msg = `Hello Kece Oil, I'm interested in ordering:\n\n📦 ${productName}\n💬 Quantity: ${quantity}`;

  if (deliveryMethod === 'pickup') {
    msg += `\n🏪 Delivery: Pickup from shop`;
  } else if (deliveryMethod === 'dispatch') {
    msg += `\n🚚 Delivery: Dispatch to my address`;
  }

  msg += `\n\nPlease provide more details and pricing information please.`;

  const message = encodeURIComponent(msg);
  
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
