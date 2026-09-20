export async function generateInvoiceNumber(db) {
  const year = new Date().getFullYear();
  try {
    const snap = await db.collection('finance_invoices').count().get();
    const total = snap.data().count || 0;
    const seq = String(total + 1).padStart(4, '0');
    return `LC-INV-${year}-${seq}`;
  } catch {
    const seq = String(Date.now()).slice(-5);
    return `LC-INV-${year}-${seq}`;
  }
}

const TEMPLATE_NAMES = {
  proposal: 'Proposal Interactive Experience',
  birthday: 'Birthday Interactive Experience',
  anniversary: 'Anniversary Interactive Experience',
  'emotional-apology': 'Apology Interactive Letter',
};

export async function createAutoInvoice({
  db,
  orderId,
  noteData = {},
  amountInRupees = 0,
  couponCode = '',
  discountPercent = 0,
  paymentMethod = 'UPI / Razorpay',
}) {
  try {
    const invoiceNumber = await generateInvoiceNumber(db);
    const templateId = noteData.template || 'proposal';
    const templateName = TEMPLATE_NAMES[templateId] || `${templateId.charAt(0).toUpperCase() + templateId.slice(1)} Digital Experience`;
    
    // User name from note creator
    const customerName = (
      noteData.custom_details?.sender_name ||
      noteData.sender_name ||
      noteData.author_name ||
      noteData.recipient_name ||
      'LovelyCrafts Customer'
    ).trim();

    // Base subtotal (base price before discount, or fallback to amount)
    const basePrice = 219;
    const subtotal = discountPercent > 0 ? basePrice : (amountInRupees || basePrice);
    const discountAmount = discountPercent > 0 
      ? Number((subtotal * (discountPercent / 100)).toFixed(2)) 
      : 0;
    const finalAmount = Number((subtotal - discountAmount).toFixed(2));

    const today = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();

    const invoiceData = {
      invoiceNumber,
      customerName,
      customerEmail: noteData.customer_email || noteData.email || '',
      customerPhone: noteData.customer_phone || noteData.phone || '',
      customerAddress: '',
      customerGstin: '',
      items: [
        {
          description: templateName,
          quantity: 1,
          unitPrice: subtotal,
          total: subtotal,
        },
      ],
      subtotal,
      discount: discountAmount,
      couponCode: couponCode || '',
      discountPercent: discountPercent || 0,
      taxRate: 0,
      taxAmount: 0,
      cgst: 0,
      sgst: 0,
      totalAmount: finalAmount,
      currency: 'INR',
      status: 'paid',
      type: 'auto',
      issuedDate: today,
      dueDate: today,
      notes: couponCode ? `Coupon applied: ${couponCode} (${discountPercent}% off)` : 'Thank you for choosing LovelyCrafts!',
      terms: '1. Access to digital interactive experience granted.\n2. Invoiced amount inclusive of applicable digital taxes (CGST 0%, SGST 0%).',
      orderId,
      paymentMethod,
      paidAt: nowIso,
      createdAt: nowIso,
      createdBy: 'system_auto',
    };

    const docRef = await db.collection('finance_invoices').add(invoiceData);
    return { id: docRef.id, ...invoiceData };
  } catch (error) {
    console.error('Failed to create auto invoice:', error);
    return null;
  }
}
