'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { exportToExcel } from '@/lib/excel-export';
import {
  RupeeIcon,
  TrendingUpIcon,
  BuildingBankIcon,
  OrdersIcon,
  CreatorsIcon,
  DownloadIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon,
  FilterIcon,
  InvoiceIcon,
  PrinterIcon
} from '@/components/admin/AdminIcons';

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'organic' | 'creator'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);
  const [loadingInvoiceId, setLoadingInvoiceId] = useState(null);

  useEffect(() => {
    if (!user) return;
    user.getIdToken().then((token) => {
      fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.orders) setOrders(data.orders);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    });
  }, [user]);

  const organicOrders = orders.filter((o) => !o.creator_id);
  const creatorOrders = orders.filter((o) => Boolean(o.creator_id));

  const filteredByChannel = filter === 'organic'
    ? organicOrders
    : filter === 'creator'
    ? creatorOrders
    : orders;

  const filteredOrders = filteredByChannel.filter((o) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const noteId = (o.note_id || o.id || '').toLowerCase();
    const creatorId = (o.creator_id || '').toLowerCase();
    const coupon = (o.coupon_code || '').toLowerCase();
    const template = (o.template_id || '').toLowerCase();
    return noteId.includes(term) || creatorId.includes(term) || coupon.includes(term) || template.includes(term);
  });

  // Razorpay: 2% + 18% GST = 2.36%, capped at ₹2500 (250000 paise)
  const calcRazorpayFee = (amountPaise) => Math.min(Math.ceil((amountPaise || 0) * 0.0236), 250000);

  const totalRevenuePaise = orders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const totalFeePaise = orders.reduce((sum, o) => sum + calcRazorpayFee(o.final_amount || 0), 0);
  const totalNetPaise = totalRevenuePaise - totalFeePaise;

  const organicRevenuePaise = organicOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);
  const creatorRevenuePaise = creatorOrders.reduce((sum, o) => sum + (o.final_amount || 0), 0);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportExcel = () => {
    const formatted = filteredOrders.map((o) => {
      const fee = calcRazorpayFee(o.final_amount || 0);
      return {
        'Date': o.paid_at ? new Date(o.paid_at).toLocaleString() : 'Recent',
        'Order / Note ID': o.note_id || o.id,
        'Sales Channel': o.creator_id ? 'Creator Referral' : 'Organic / Direct User',
        'Template Name': o.template_id || 'Standard',
        'Gross Amount (₹)': ((o.final_amount || 0) / 100).toFixed(2),
        'Razorpay Fee (₹)': (fee / 100).toFixed(2),
        'Net Amount (₹)': (((o.final_amount || 0) - fee) / 100).toFixed(2),
        'Coupon Code': o.coupon_code || 'None',
        'Discount Applied (%)': o.discount_percent ? `${o.discount_percent}%` : '0%',
        'Attributed Creator ID': o.creator_id || 'Direct / Organic Customer',
        'Payment Method': o.payment_method || 'Razorpay',
        'Order Status': o.payment_status || 'Paid',
      };
    });
    exportToExcel(formatted, `orders_ledger_${filter}`, 'Orders');
  };

  const handleOpenInvoice = async (order) => {
    const orderRefId = order.id || order.note_id;
    setLoadingInvoiceId(orderRefId);
    try {
      if (user) {
        const token = await user.getIdToken();
        const res = await fetch(`/api/admin/finance/invoices?orderId=${encodeURIComponent(orderRefId)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.invoices && data.invoices.length > 0) {
          setActiveInvoice(data.invoices[0]);
          return;
        }
      }
      // Fallback synthetic invoice from order snapshot
      const amountPaise = order.final_amount || 0;
      const amountRupees = Number((amountPaise / 100).toFixed(2));
      const templateName = (order.template_id || 'Proposal').charAt(0).toUpperCase() + (order.template_id || 'Proposal').slice(1) + ' Interactive Experience';
      setActiveInvoice({
        invoiceNumber: `LC-INV-${new Date(order.paid_at || Date.now()).getFullYear()}-${(order.id || 'ORDER').substring(0, 6).toUpperCase()}`,
        customerName: order.customer_name || 'LovelyCrafts Customer',
        customerEmail: order.customer_email || '',
        customerPhone: order.customer_phone || '',
        items: [{
          description: templateName,
          quantity: 1,
          unitPrice: amountRupees,
          total: amountRupees,
        }],
        subtotal: amountRupees,
        discount: 0,
        couponCode: order.coupon_code || '',
        taxRate: 0,
        taxAmount: 0,
        cgst: 0,
        sgst: 0,
        totalAmount: amountRupees,
        status: order.payment_status || 'paid',
        issuedDate: order.paid_at ? new Date(order.paid_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        orderId: orderRefId,
        paymentMethod: order.payment_method || 'UPI / Razorpay',
        paidAt: order.paid_at || new Date().toISOString(),
        notes: order.coupon_code ? `Coupon applied: ${order.coupon_code}` : 'Thank you for choosing LovelyCrafts!',
        terms: '1. Access to digital interactive experience granted.\n2. Invoiced amount inclusive of applicable digital taxes (CGST 0%, SGST 0%).',
        type: 'auto'
      });
    } catch (err) {
      console.error('Failed to load invoice:', err);
    } finally {
      setLoadingInvoiceId(null);
    }
  };

  const handlePrintInvoice = (inv) => {
    if (!inv) return;
    const itemsRows = (inv.items || []).map((item) => `
      <tr>
        <td style="padding:10px 12px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">${item.description || ''}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #f1f5f9">${item.quantity || 1}</td>
        <td style="padding:10px 12px;text-align:right;border-bottom:1px solid #f1f5f9">₹${Number(item.unitPrice || 0).toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px;text-align:right;font-weight:700;border-bottom:1px solid #f1f5f9">₹${Number(item.total || ((item.quantity || 1) * (item.unitPrice || 0))).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const discountRow = Number(inv.discount) > 0
      ? `<div style="display:flex;justify-content:space-between;color:#16a34a"><span>Discount ${inv.couponCode ? `(${inv.couponCode})` : ''}</span><span>-₹${Number(inv.discount).toLocaleString('en-IN')}</span></div>` : '';
    const cgstRow = `<div style="display:flex;justify-content:space-between;color:#64748b"><span>CGST (9%)</span><span>₹0</span></div>`;
    const sgstRow = `<div style="display:flex;justify-content:space-between;color:#64748b"><span>SGST (9%)</span><span>₹0</span></div>`;

    const statusBg = inv.status === 'paid' ? '#dcfce7' : '#fef3c7';
    const statusColor = inv.status === 'paid' ? '#15803d' : '#b45309';
    const statusLabel = inv.status === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${inv.invoiceNumber} — LovelyCrafts</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 14mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #0f172a; background: #fff; font-size: 13px; line-height: 1.5; width: 210mm; min-height: 297mm; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2.5px solid #ec4899; padding-bottom: 16px; margin-bottom: 22px; }
    .brand-name { font-size: 22px; font-weight: 900; color: #ec4899; }
    .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead tr { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
    th { padding: 9px 12px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #475569; text-align: left; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .totals-inner { width: 260px; display: flex; flex-direction: column; gap: 5px; font-size: 13px; }
    .total-row { display: flex; justify-content: space-between; color: #64748b; }
    .total-final { display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 7px; font-size: 15px; font-weight: 800; color: #0f172a; }
  </style>
</head>
<body style="padding:20px">
  <div class="header">
    <div>
      <div class="brand-name">LovelyCrafts</div>
      <div style="font-size:11px;color:#64748b;margin-top:2px">Digital Interactive Notes &amp; Bespoke Crafts</div>
      <div style="font-size:10.5px;color:#94a3b8;margin-top:1px">support@lovelycrafts.shop • lovelycrafts.shop</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:18px;font-weight:800">INVOICE</div>
      <div style="font-size:13px;font-weight:700;color:#475569">${inv.invoiceNumber}</div>
      <div style="font-size:11px;color:#64748b">Date: ${inv.issuedDate || ''}</div>
    </div>
  </div>
  <div class="billing-grid">
    <div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:4px">Billed To</div>
      <div style="font-size:15px;font-weight:700">${inv.customerName || 'LovelyCrafts Customer'}</div>
      ${inv.orderId ? `<div style="font-size:11px;color:#be185d;font-weight:600;margin-top:4px">Order Reference: #${inv.orderId}</div>` : ''}
    </div>
    <div style="text-align:right">
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:#94a3b8;margin-bottom:4px">Status</div>
      <div style="display:inline-block;padding:4px 12px;border-radius:6px;font-size:12px;font-weight:800;background:${statusBg};color:${statusColor}">${statusLabel}</div>
      ${inv.paymentMethod ? `<div style="font-size:11px;color:#64748b;margin-top:4px">Method: ${inv.paymentMethod}</div>` : ''}
    </div>
  </div>
  <table>
    <thead><tr><th>Item Description</th><th style="text-align:center">Qty</th><th style="text-align:right">Rate (₹)</th><th style="text-align:right">Amount (₹)</th></tr></thead>
    <tbody>${itemsRows}</tbody>
  </table>
  <div class="totals">
    <div class="totals-inner">
      <div class="total-row"><span>Subtotal</span><span>₹${Number(inv.subtotal || 0).toLocaleString('en-IN')}</span></div>
      ${discountRow}
      <div class="total-row"><span>Final Amount</span><span style="font-weight:600">₹${Number(inv.totalAmount || 0).toLocaleString('en-IN')}</span></div>
      ${cgstRow}
      ${sgstRow}
      <div class="total-final"><span>Total Payable</span><span>₹${Number(inv.totalAmount || 0).toLocaleString('en-IN')}</span></div>
    </div>
  </div>
  <script>window.onload = function() { window.print(); };</script>
</body>
</html>`;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* HEADER & EXPORT */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            Customer Orders &amp; Sales Ledger
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
            Real-time transaction log for direct organic website users and creator-sponsored campaigns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Link
            href="/admin/finance"
            style={{
              background: '#ec4899',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(236, 72, 153, 0.25)',
            }}
          >
            <InvoiceIcon size={16} />
            <span>Finance & Invoicing</span>
          </Link>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={loading || filteredOrders.length === 0}
            style={{
              background: '#0f172a',
              color: '#ffffff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: loading || filteredOrders.length === 0 ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)',
              opacity: loading || filteredOrders.length === 0 ? 0.6 : 1,
              transition: 'all 0.15s ease'
            }}
          >
            <DownloadIcon size={16} />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* REVENUE METRIC TILES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Gross Revenue */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RupeeIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            ₹{(totalRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{orders.length} total orders</div>
        </div>

        {/* Net Take-home */}
        <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', padding: '20px', borderRadius: '16px', border: '1px solid #bbf7d0', boxShadow: '0 2px 6px rgba(34,197,94,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Margin</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', letterSpacing: '-0.02em' }}>
            ₹{(totalNetPaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#166534', marginTop: '6px', fontWeight: 600 }}>Actual take-home profit</div>
        </div>

        {/* Gateway Charges */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>RZP Fees</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BuildingBankIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#c2410c', letterSpacing: '-0.02em' }}>
            −₹{(totalFeePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9a3412', marginTop: '6px' }}>2.36% (incl. 18% GST)</div>
        </div>

        {/* Organic Split */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#0f172a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Organic Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OrdersIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
            ₹{(organicRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{organicOrders.length} direct orders</div>
        </div>

        {/* Creator Referral Split */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Creator Sales</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreatorsIcon size={14} />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#7c3aed', letterSpacing: '-0.02em' }}>
            ₹{(creatorRevenuePaise / 100).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6b21a8', marginTop: '6px' }}>{creatorOrders.length} sponsored orders</div>
        </div>

      </div>

      {/* FILTER TABS & SEARCH BAR */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* CHANNEL PILLS */}
        <div style={{ display: 'flex', gap: '6px', background: '#ffffff', padding: '4px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? '#0f172a' : 'transparent',
              color: filter === 'all' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            All ({orders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('organic')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'organic' ? '#0f172a' : 'transparent',
              color: filter === 'organic' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Organic ({organicOrders.length})
          </button>

          <button
            type="button"
            onClick={() => setFilter('creator')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'creator' ? '#0f172a' : 'transparent',
              color: filter === 'creator' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Creator Referred ({creatorOrders.length})
          </button>
        </div>

        {/* SEARCH INPUT */}
        <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', display: 'flex' }}>
            <SearchIcon size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by Note ID, Coupon, Creator..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              fontSize: '0.82rem',
              color: '#0f172a',
              outline: 'none',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          />
        </div>

      </div>

      {/* ORDERS DATA TABLE */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#0284c7', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Loading transactions ledger...</p>
        </div>
      ) : (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order / Note ID</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sales Channel</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gross (Paise)</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>RZP Fee (2.36%)</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Take-Home</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coupon</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>No matching orders found</div>
                      <div style={{ fontSize: '0.8rem' }}>Try adjusting your search query or filter selection.</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => {
                    const isOrganic = !o.creator_id;
                    const fee = calcRazorpayFee(o.final_amount || 0);
                    const net = (o.final_amount || 0) - fee;
                    const noteId = o.note_id || o.id;

                    return (
                      <tr key={o.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.1s ease' }}>
                        
                        {/* ORDER & NOTE ID */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                              {noteId?.substring(0, 16)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(noteId)}
                              title="Copy Note ID"
                              style={{ background: 'transparent', border: 'none', color: copiedId === noteId ? '#16a34a' : '#94a3b8', cursor: 'pointer', padding: '2px', display: 'flex' }}
                            >
                              {copiedId === noteId ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                            </button>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '4px' }}>
                            {o.paid_at ? new Date(o.paid_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Recent'}
                          </div>
                        </td>

                        {/* CHANNEL */}
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: isOrganic ? '#f0fdf4' : '#f5f3ff',
                              color: isOrganic ? '#15803d' : '#7c3aed',
                              border: `1px solid ${isOrganic ? '#bbf7d0' : '#ddd6fe'}`,
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOrganic ? '#22c55e' : '#8b5cf6' }} />
                            {isOrganic ? 'Organic Direct' : `Creator: ${o.creator_id.substring(0, 8)}...`}
                          </span>
                        </td>

                        {/* TEMPLATE */}
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                          <span style={{ textTransform: 'capitalize' }}>{o.template_id || 'Proposal'}</span>
                        </td>

                        {/* GROSS */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                            ₹{((o.final_amount || 0) / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            {o.payment_method || 'razorpay'}
                          </div>
                        </td>

                        {/* RZP FEE */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 700, color: '#c2410c', fontSize: '0.9rem' }}>
                            −₹{(fee / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#ea580c' }}>2.36%</div>
                        </td>

                        {/* NET AMOUNT */}
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: 800, color: '#15803d', fontSize: '0.95rem' }}>
                            ₹{(net / 100).toFixed(2)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#16a34a' }}>net take-home</div>
                        </td>

                        {/* COUPON */}
                        <td style={{ padding: '16px 20px' }}>
                          {o.coupon_code ? (
                            <div>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '3px 8px', borderRadius: '6px', fontSize: '0.78rem' }}>
                                {o.coupon_code}
                              </span>
                              <div style={{ fontSize: '0.72rem', color: '#0369a1', marginTop: '3px' }}>
                                -{o.discount_percent}% off
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>

                        {/* STATUS */}
                        <td style={{ padding: '16px 20px' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 10px',
                              borderRadius: '999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: o.payment_status === 'paid' ? '#dcfce7' : '#fee2e2',
                              color: o.payment_status === 'paid' ? '#15803d' : '#b91c1c',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: o.payment_status === 'paid' ? '#22c55e' : '#ef4444' }} />
                            <span style={{ textTransform: 'capitalize' }}>{o.payment_status || 'paid'}</span>
                          </span>
                        </td>

                        {/* INVOICE ACTION */}
                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenInvoice(o)}
                            disabled={loadingInvoiceId === (o.id || o.note_id)}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background: '#fdf2f8',
                              border: '1px solid #fbcfe8',
                              color: '#db2777',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              opacity: loadingInvoiceId === (o.id || o.note_id) ? 0.6 : 1,
                            }}
                          >
                            <InvoiceIcon size={13} />
                            <span>{loadingInvoiceId === (o.id || o.note_id) ? 'Opening...' : 'Invoice'}</span>
                          </button>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* INLINE INVOICE MODAL */}
      {activeInvoice && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  Invoice: {activeInvoice.invoiceNumber}
                </h2>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: activeInvoice.status === 'paid' ? '#dcfce7' : '#fef3c7',
                  color: activeInvoice.status === 'paid' ? '#15803d' : '#b45309',
                }}>
                  {activeInvoice.status?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(activeInvoice)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <PrinterIcon size={15} />
                  <span>Print / PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveInvoice(null)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#fff',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px', background: '#f8fafc', padding: '16px', borderRadius: '10px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Billed To</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{activeInvoice.customerName}</div>
                {activeInvoice.orderId && <div style={{ fontSize: '0.75rem', color: '#be185d', fontWeight: 600, marginTop: '2px' }}>Order: #{activeInvoice.orderId}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}>Details</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Date: {activeInvoice.issuedDate}</div>
                {activeInvoice.paymentMethod && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Method: {activeInvoice.paymentMethod}</div>}
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.75rem' }}>
                  <th style={{ padding: '8px 10px' }}>Item</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center' }}>Qty</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Rate (₹)</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {(activeInvoice.items || []).map((it, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{it.description}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{it.quantity || 1}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>₹{it.unitPrice}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{it.total || (it.quantity * it.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* TOTALS */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
              <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Subtotal</span>
                  <span>₹{activeInvoice.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {Number(activeInvoice.discount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Discount {activeInvoice.couponCode ? `(${activeInvoice.couponCode})` : ''}</span>
                    <span>-₹{activeInvoice.discount}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a', fontWeight: 600 }}>
                  <span>Final Amount</span>
                  <span>₹{activeInvoice.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>CGST (9%)</span>
                  <span>₹0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>SGST (9%)</span>
                  <span>₹0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '6px', fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                  <span>Total Payable</span>
                  <span>₹{activeInvoice.totalAmount?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {activeInvoice.notes && (
              <div style={{ fontSize: '0.78rem', color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
                <strong>Notes:</strong> {activeInvoice.notes}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
