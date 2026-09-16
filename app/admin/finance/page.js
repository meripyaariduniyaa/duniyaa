'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import {
  RupeeIcon,
  TrendingUpIcon,
  OrdersIcon,
  RefreshIcon,
  FinanceIcon,
  InvoiceIcon,
  ReceiptIcon,
  RecurringIcon,
  AdSenseIcon,
  PrinterIcon,
  DownloadIcon,
  PlusCircleIcon,
  TrashIcon,
  CopyIcon,
  PercentIcon
} from '@/components/admin/AdminIcons';

const CATEGORY_META = {
  hosting: { label: 'Vercel / Hosting', color: '#0284c7', bg: '#e0f2fe' },
  database: { label: 'Firebase / Database', color: '#f59e0b', bg: '#fef3c7' },
  storage: { label: 'Cloudinary / CDN', color: '#8b5cf6', bg: '#ede9fe' },
  gateway: { label: 'Payment Gateway (2%)', color: '#ec4899', bg: '#fce7f3' },
  marketing: { label: 'Google / Meta Ads', color: '#10b981', bg: '#d1fae5' },
  domains: { label: 'Domains & SSL', color: '#06b6d4', bg: '#cffafe' },
  software: { label: 'SaaS / Tools', color: '#6366f1', bg: '#e0e7ff' },
  creator_payouts: { label: 'Creator Payouts', color: '#f97316', bg: '#ffedd5' },
  freelance: { label: 'Freelancers / Dev', color: '#14b8a6', bg: '#ccfbf1' },
  misc: { label: 'Miscellaneous', color: '#64748b', bg: '#f1f5f9' },
};

const INCOME_SOURCES = {
  store_sales: { label: 'Store Note Sales', color: '#ec4899' },
  google_adsense: { label: 'Google AdSense Ads', color: '#10b981' },
  custom_order: { label: 'Bespoke / Custom Order', color: '#0284c7' },
  affiliate_margin: { label: 'Affiliate Margin Split', color: '#8b5cf6' },
  sponsorship: { label: 'Sponsorship / Brand', color: '#f59e0b' },
  other: { label: 'Other Revenue', color: '#64748b' },
};

function FinanceDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const targetOrderId = searchParams?.get('orderId');

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'invoices' | 'expenses' | 'income' | 'recurring'
  const [overviewData, setOverviewData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Search & Filter States
  const [expenseFilter, setExpenseFilter] = useState('all');
  const [expenseSearch, setExpenseSearch] = useState('');
  const [incomeFilter, setIncomeFilter] = useState('all');
  const [incomeSearch, setIncomeSearch] = useState('');
  const [invoiceFilter, setInvoiceFilter] = useState('all');
  const [invoiceSearch, setInvoiceSearch] = useState('');

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState(null);

  // Forms State
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'hosting',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    vendor: '',
    receiptUrl: '',
    notes: '',
  });

  const [incomeForm, setIncomeForm] = useState({
    title: '',
    source: 'google_adsense',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    referenceId: '',
    impressions: '',
    clicks: '',
    cpm: '',
    ctr: '',
    notes: '',
  });

  const [recurringForm, setRecurringForm] = useState({
    title: '',
    category: 'hosting',
    amount: '',
    frequency: 'monthly',
    billingDay: '1',
    vendor: '',
    website: '',
    notes: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    customerGstin: '',
    status: 'paid',
    discount: '0',
    taxRate: '18',
    orderId: '',
    notes: 'Thank you for choosing LovelyCrafts! For instant support, write to support@lovelycrafts.shop',
    terms: '1. Complete access to digital crafts granted.\n2. Invoiced amount inclusive of applicable digital taxes.',
    items: [{ description: 'LovelyCrafts Interactive Digital Experience', quantity: 1, unitPrice: 199 }],
  });

  // Fetch all financial data
  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const token = await user.getIdToken();
      const headers = { Authorization: `Bearer ${token}` };

      const [resOverview, resExp, resInc, resRec, resInv] = await Promise.all([
        fetch('/api/admin/finance/overview', { headers }),
        fetch('/api/admin/finance/expenses', { headers }),
        fetch('/api/admin/finance/income', { headers }),
        fetch('/api/admin/finance/recurring', { headers }),
        fetch('/api/admin/finance/invoices?fetchPaidOrders=true', { headers }),
      ]);

      if (!resOverview.ok) throw new Error('Failed to load financial overview');

      const dataOverview = await resOverview.json();
      const dataExp = await resExp.json();
      const dataInc = await resInc.json();
      const dataRec = await resRec.json();
      const dataInv = await resInv.json();

      setOverviewData(dataOverview);
      setExpenses(dataExp.expenses || []);
      setIncome(dataInc.income || []);
      setRecurring(dataRec.recurring || []);
      setInvoices(dataInv.invoices || []);
      setPaidOrders(dataInv.paidOrders || []);

      // If URL had orderId, open invoice modal prefilled for that order
      if (targetOrderId && dataInv.paidOrders) {
        const matchingOrder = dataInv.paidOrders.find((o) => o.id === targetOrderId || o.note_id === targetOrderId);
        if (matchingOrder) {
          handlePopulateFromOrder(matchingOrder);
          setActiveTab('invoices');
        }
      }
    } catch (err) {
      setError(err.message || 'Error fetching financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [user, targetOrderId]);

  const showToast = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // AUTO-POPULATE INVOICE FORM FROM PAID CHECKOUT ORDER
  const handlePopulateFromOrder = (order) => {
    if (!order) return;
    const amountVal = Number(order.amount) || 199;
    const discountVal = order.discount_percent ? String(Math.round(amountVal * (Number(order.discount_percent) / 100))) : '0';

    setInvoiceForm({
      customerName: order.customer_name || 'LovelyCrafts Customer',
      customerEmail: order.customer_email || '',
      customerPhone: order.customer_phone || '',
      customerAddress: '',
      customerGstin: '',
      status: 'paid',
      discount: discountVal,
      taxRate: '18',
      orderId: order.id || order.note_id || '',
      notes: `Order Ref #${order.note_id || order.id} (Payment: ${order.payment_id || 'Razorpay'}). Thank you for creating with LovelyCrafts!`,
      terms: '1. Access to personalized digital crafts experience confirmed.\n2. Invoice inclusive of applicable digital taxes.',
      items: [
        {
          description: `LovelyCrafts Digital Experience - ${order.template_id || 'Classic Craft'}`,
          quantity: 1,
          unitPrice: amountVal,
        }
      ],
    });
    setIsInvoiceModalOpen(true);
  };

  // CREATE EXPENSE
  const handleCreateExpense = async (e) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expenseForm),
      });
      if (!res.ok) throw new Error('Failed to record expense');
      setIsExpenseModalOpen(false);
      setExpenseForm({
        title: '',
        category: 'hosting',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        paymentMethod: 'Credit Card',
        vendor: '',
        receiptUrl: '',
        notes: '',
      });
      showToast('Expense recorded successfully!');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE EXPENSE
  const handleDeleteExpense = async (id) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/finance/expenses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete expense');
      showToast('Expense removed');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // CREATE INCOME
  const handleCreateIncome = async (e) => {
    e.preventDefault();
    if (!incomeForm.title || !incomeForm.amount) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(incomeForm),
      });
      if (!res.ok) throw new Error('Failed to log income');
      setIsIncomeModalOpen(false);
      setIncomeForm({
        title: '',
        source: 'google_adsense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        referenceId: '',
        impressions: '',
        clicks: '',
        cpm: '',
        ctr: '',
        notes: '',
      });
      showToast('Income entry logged successfully!');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE INCOME
  const handleDeleteIncome = async (id) => {
    if (!confirm('Are you sure you want to delete this income entry?')) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/finance/income?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete income entry');
      showToast('Income entry deleted');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // CREATE RECURRING
  const handleCreateRecurring = async (e) => {
    e.preventDefault();
    if (!recurringForm.title || !recurringForm.amount) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/recurring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recurringForm),
      });
      if (!res.ok) throw new Error('Failed to add recurring cost');
      setIsRecurringModalOpen(false);
      setRecurringForm({
        title: '',
        category: 'hosting',
        amount: '',
        frequency: 'monthly',
        billingDay: '1',
        vendor: '',
        website: '',
        notes: '',
      });
      showToast('Recurring subscription added!');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // LOG RECURRING AS EXPENSE FOR CURRENT MONTH
  const handleLogRecurringAsExpense = async (recurringItem) => {
    if (!confirm(`Record ₹${recurringItem.amount} for "${recurringItem.title}" as an expense for this month?`)) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/recurring', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: recurringItem.id, logAsExpenseForMonth: true }),
      });
      if (!res.ok) throw new Error('Failed to log recurring expense');
      showToast(`Expense for "${recurringItem.title}" recorded!`);
      fetchAllData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE RECURRING
  const handleDeleteRecurring = async (id) => {
    if (!confirm('Are you sure you want to remove this recurring item?')) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/finance/recurring?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete recurring subscription');
      showToast('Recurring item deleted');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // INVOICE ITEM CONTROLS
  const addInvoiceItem = () => {
    setInvoiceForm({
      ...invoiceForm,
      items: [...invoiceForm.items, { description: '', quantity: 1, unitPrice: 0 }],
    });
  };

  const updateInvoiceItem = (index, field, value) => {
    const next = [...invoiceForm.items];
    next[index][field] = value;
    setInvoiceForm({ ...invoiceForm, items: next });
  };

  const removeInvoiceItem = (index) => {
    if (invoiceForm.items.length <= 1) return;
    const next = invoiceForm.items.filter((_, i) => i !== index);
    setInvoiceForm({ ...invoiceForm, items: next });
  };

  // CREATE INVOICE
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!invoiceForm.customerName || invoiceForm.items.length === 0) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(invoiceForm),
      });
      if (!res.ok) throw new Error('Failed to generate invoice');
      const data = await res.json();
      setIsInvoiceModalOpen(false);
      showToast('Invoice generated successfully!');
      setPreviewInvoice(data.invoice);
      fetchAllData();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE INVOICE STATUS
  const handleUpdateInvoiceStatus = async (id, newStatus) => {
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/finance/invoices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update invoice status');
      showToast(`Invoice status set to ${newStatus}`);
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE INVOICE
  const handleDeleteInvoice = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/admin/finance/invoices?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete invoice');
      showToast('Invoice deleted');
      fetchAllData();
    } catch (err) {
      alert(err.message);
    }
  };

  // EXPORT CSV UTILITIES
  const exportExpensesCSV = () => {
    if (expenses.length === 0) return alert('No expenses to export');
    const headers = ['Date', 'Title', 'Category', 'Amount (INR)', 'Vendor', 'Payment Method', 'Notes'];
    const rows = expenses.map((e) => [
      `"${e.date || ''}"`,
      `"${(e.title || '').replace(/"/g, '""')}"`,
      `"${e.category || ''}"`,
      e.amount || 0,
      `"${(e.vendor || '').replace(/"/g, '""')}"`,
      `"${e.paymentMethod || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LovelyCrafts_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportInvoicesCSV = () => {
    if (invoices.length === 0) return alert('No invoices to export');
    const headers = ['Invoice No', 'Issued Date', 'Customer Name', 'Customer Email', 'Status', 'Subtotal', 'Tax', 'Total (INR)'];
    const rows = invoices.map((inv) => [
      `"${inv.invoiceNumber || ''}"`,
      `"${inv.issuedDate || ''}"`,
      `"${(inv.customerName || '').replace(/"/g, '""')}"`,
      `"${inv.customerEmail || ''}"`,
      `"${inv.status || ''}"`,
      inv.subtotal || 0,
      inv.taxAmount || 0,
      inv.totalAmount || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LovelyCrafts_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PRINT / DOWNLOAD INVOICE ACTION — opens a dedicated A4 print window
  const handlePrintInvoice = (targetInvoice) => {
    // If passed a React Event object or invalid object, fallback to previewInvoice
    const inv = (targetInvoice && targetInvoice.invoiceNumber) ? targetInvoice : previewInvoice;
    if (!inv) return;

    const itemsRows = (inv.items || []).map((item) => `
      <tr>
        <td style="padding:10px 12px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">${item.description || ''}</td>
        <td style="padding:10px 12px;text-align:center;border-bottom:1px solid #f1f5f9">${item.quantity}</td>
        <td style="padding:10px 12px;text-align:right;border-bottom:1px solid #f1f5f9">₹${Number(item.unitPrice).toLocaleString('en-IN')}</td>
        <td style="padding:10px 12px;text-align:right;font-weight:700;border-bottom:1px solid #f1f5f9">₹${Number(item.total || item.quantity * item.unitPrice).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const discountRow = Number(inv.discount) > 0
      ? `<div style="display:flex;justify-content:space-between;color:#16a34a"><span>Discount</span><span>-₹${Number(inv.discount).toLocaleString('en-IN')}</span></div>` : '';
    const taxRow = Number(inv.taxAmount) > 0
      ? `<div style="display:flex;justify-content:space-between;color:#475569"><span>GST (${inv.taxRate}%)</span><span>₹${Number(inv.taxAmount).toLocaleString('en-IN')}</span></div>` : '';

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
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 13px;
      line-height: 1.5;
      width: 210mm;
      min-height: 297mm;
    }
    .page { padding: 0; }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2.5px solid #ec4899;
      padding-bottom: 16px;
      margin-bottom: 22px;
    }
    .brand-name { font-size: 22px; font-weight: 900; color: #ec4899; letter-spacing: -0.5px; }
    .brand-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    .brand-contact { font-size: 10.5px; color: #94a3b8; margin-top: 1px; }
    .inv-label { font-size: 18px; font-weight: 800; color: #0f172a; }
    .inv-number { font-size: 13px; font-weight: 700; color: #475569; margin-top: 2px; }
    .inv-date { font-size: 11px; color: #64748b; margin-top: 2px; }
    .billing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
    .section-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 5px; }
    .customer-name { font-size: 15px; font-weight: 700; color: #0f172a; }
    .customer-detail { font-size: 12px; color: #475569; margin-top: 2px; }
    .order-ref { font-size: 11px; color: #be185d; font-weight: 600; margin-top: 5px; }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 800;
      background: ${statusBg};
      color: ${statusColor};
    }
    .payment-method { font-size: 11px; color: #64748b; margin-top: 5px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead tr { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
    th { padding: 9px 12px; font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: #475569; text-align: left; }
    th.right { text-align: right; }
    th.center { text-align: center; }
    td { font-size: 12.5px; }
    .totals { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .totals-inner { width: 260px; display: flex; flex-direction: column; gap: 5px; font-size: 13px; }
    .total-row { display: flex; justify-content: space-between; color: #64748b; }
    .total-final { display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 7px; font-size: 15px; font-weight: 800; color: #0f172a; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11.5px; color: #64748b; }
    .footer-label { font-weight: 700; color: #334155; margin-bottom: 4px; }
    .footer-terms { margin-top: 8px; opacity: 0.8; white-space: pre-line; }
    .watermark {
      text-align: center;
      margin-top: 28px;
      font-size: 10px;
      color: #cbd5e1;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    @media print {
      body { width: 100%; }
      button { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- HEADER -->
    <div class="header">
      <div>
        <div class="brand-name">LovelyCrafts</div>
        <div class="brand-sub">Digital Interactive Notes &amp; Bespoke Crafts</div>
        <div class="brand-contact">support@lovelycrafts.shop &nbsp;•&nbsp; lovelycrafts.shop</div>
      </div>
      <div style="text-align:right">
        <div class="inv-label">INVOICE</div>
        <div class="inv-number">${inv.invoiceNumber}</div>
        <div class="inv-date">Date: ${inv.issuedDate || ''}</div>
        ${inv.dueDate ? `<div class="inv-date">Due: ${inv.dueDate}</div>` : ''}
      </div>
    </div>

    <!-- BILLED TO + STATUS -->
    <div class="billing-grid">
      <div>
        <div class="section-label">Billed To</div>
        <div class="customer-name">${inv.customerName || ''}</div>
        ${inv.customerEmail ? `<div class="customer-detail">${inv.customerEmail}</div>` : ''}
        ${inv.customerPhone ? `<div class="customer-detail">${inv.customerPhone}</div>` : ''}
        ${inv.customerAddress ? `<div class="customer-detail" style="margin-top:4px">${inv.customerAddress}</div>` : ''}
        ${inv.customerGstin ? `<div class="customer-detail">GSTIN: ${inv.customerGstin}</div>` : ''}
        ${inv.orderId ? `<div class="order-ref">Order Reference: #${inv.orderId}</div>` : ''}
      </div>
      <div style="text-align:right">
        <div class="section-label">Payment Status</div>
        <div class="status-badge">${statusLabel}</div>
        ${inv.paymentMethod ? `<div class="payment-method">Method: ${inv.paymentMethod}</div>` : ''}
        ${inv.paidAt ? `<div class="payment-method">Paid: ${new Date(inv.paidAt).toLocaleDateString('en-IN')}</div>` : ''}
      </div>
    </div>

    <!-- LINE ITEMS TABLE -->
    <table>
      <thead>
        <tr>
          <th>Item Description</th>
          <th class="center">Qty</th>
          <th class="right">Rate (₹)</th>
          <th class="right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <!-- TOTALS -->
    <div class="totals">
      <div class="totals-inner">
        <div class="total-row"><span>Subtotal</span><span>₹${Number(inv.subtotal || 0).toLocaleString('en-IN')}</span></div>
        ${discountRow}
        ${taxRow}
        <div class="total-final"><span>Total Payable</span><span>₹${Number(inv.totalAmount || 0).toLocaleString('en-IN')}</span></div>
      </div>
    </div>

    <!-- FOOTER: NOTES & TERMS -->
    <div class="footer">
      <div class="footer-label">Notes &amp; Instructions:</div>
      <div>${inv.notes || ''}</div>
      ${inv.terms ? `<div class="footer-terms">${inv.terms}</div>` : ''}
    </div>

    <div class="watermark">LovelyCrafts &nbsp;•&nbsp; Generated ${new Date().toLocaleDateString('en-IN')} &nbsp;•&nbsp; lovelycrafts.shop</div>
  </div>

  <script>
    window.onload = function() { window.print(); };
  <\/script>
</body>
</html>`;

    const printWin = window.open('', '_blank', 'width=900,height=700');
    if (!printWin) {
      alert('Pop-up blocked! Please allow pop-ups for this site to download the invoice.');
      return;
    }
    printWin.document.write(html);
    printWin.document.close();
  };

  // Filtered lists
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchCategory = expenseFilter === 'all' || e.category === expenseFilter;
      const matchSearch =
        !expenseSearch ||
        (e.title && e.title.toLowerCase().includes(expenseSearch.toLowerCase())) ||
        (e.vendor && e.vendor.toLowerCase().includes(expenseSearch.toLowerCase())) ||
        (e.notes && e.notes.toLowerCase().includes(expenseSearch.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [expenses, expenseFilter, expenseSearch]);

  const filteredIncome = useMemo(() => {
    return income.filter((i) => {
      const matchSource = incomeFilter === 'all' || i.source === incomeFilter;
      const matchSearch =
        !incomeSearch ||
        (i.title && i.title.toLowerCase().includes(incomeSearch.toLowerCase())) ||
        (i.referenceId && i.referenceId.toLowerCase().includes(incomeSearch.toLowerCase())) ||
        (i.notes && i.notes.toLowerCase().includes(incomeSearch.toLowerCase()));
      return matchSource && matchSearch;
    });
  }, [income, incomeFilter, incomeSearch]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchStatus = invoiceFilter === 'all' || inv.status === invoiceFilter;
      const matchSearch =
        !invoiceSearch ||
        (inv.invoiceNumber && inv.invoiceNumber.toLowerCase().includes(invoiceSearch.toLowerCase())) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(invoiceSearch.toLowerCase())) ||
        (inv.customerEmail && inv.customerEmail.toLowerCase().includes(invoiceSearch.toLowerCase())) ||
        (inv.orderId && inv.orderId.toLowerCase().includes(invoiceSearch.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }, [invoices, invoiceFilter, invoiceSearch]);

  const summary = overviewData?.summary || {
    grossRevenue: 0,
    totalStoreSales: 0,
    totalPaidOrdersCount: 0,
    totalAdSenseIncome: 0,
    totalAdImpressions: 0,
    totalOtherIncome: 0,
    totalExpenses: 0,
    totalLoggedExpenses: 0,
    totalPayoutsAmount: 0,
    netProfit: 0,
    netMarginPercent: 0,
    monthlyBurnRate: 0,
    projectedAnnualRunRate: 0,
    invoices: { totalCount: 0, totalAmount: 0, pendingAmount: 0, paidAmount: 0 },
  };

  const categoryTotals = overviewData?.categoryTotals || {};

  if (loading && !overviewData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: '12px', color: '#64748b' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#ec4899', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontWeight: 600, fontSize: '0.85rem', margin: 0 }}>Compiling LovelyCrafts Financial Ledgers & AdSense metrics...</p>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* TOAST SUCCESS BANNER */}
      {successMsg && (
        <div style={{
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 600,
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
          animation: 'fadeIn 0.2s ease-in-out',
        }}>
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg('')} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>×</button>
        </div>
      )}

      {/* PAGE HEADER */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#ec4899' }}>
              Finance & Invoicing Master Ledger
            </span>
            <span style={{ color: '#cbd5e1' }}>•</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Live Ledger • Every Penny Accounted For
            </span>
          </div>
          <h1 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Financial Hub & Billing
          </h1>
        </div>

        {/* TOP ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={fetchAllData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              color: '#334155',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
            }}
          >
            <RefreshIcon size={15} />
            Sync Ledgers
          </button>

          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#ef4444',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
            }}
          >
            <PlusCircleIcon size={15} />
            + Log Expense
          </button>

          <button
            type="button"
            onClick={() => setIsIncomeModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              background: '#10b981',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
            }}
          >
            <PlusCircleIcon size={15} />
            + Record AdSense/Income
          </button>

          <button
            type="button"
            onClick={() => {
              setInvoiceForm({
                customerName: '',
                customerEmail: '',
                customerPhone: '',
                customerAddress: '',
                customerGstin: '',
                status: 'paid',
                discount: '0',
                taxRate: '18',
                orderId: '',
                notes: 'Thank you for choosing LovelyCrafts! For instant support, write to support@lovelycrafts.shop',
                terms: '1. Complete access to digital crafts granted.\n2. Invoiced amount inclusive of applicable digital taxes.',
                items: [{ description: 'LovelyCrafts Interactive Digital Experience', quantity: 1, unitPrice: 199 }],
              });
              setIsInvoiceModalOpen(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 2px 10px rgba(236, 72, 153, 0.3)',
            }}
          >
            <InvoiceIcon size={15} />
            + New Invoice
          </button>
        </div>
      </div>

      {/* TOP 5 EXECUTIVE KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        
        {/* GROSS REVENUE */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gross Revenue</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RupeeIcon size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            ₹{summary.grossRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <span>Store: ₹{summary.totalStoreSales}</span>
            <span>•</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>AdSense: ₹{summary.totalAdSenseIncome}</span>
          </div>
        </div>

        {/* TOTAL EXPENSES */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total Expenses</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ReceiptIcon size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444' }}>
            ₹{summary.totalExpenses.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
            Operational Ledger Expenses
          </div>
        </div>

        {/* NET PROFIT */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Net Profit</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: summary.netProfit >= 0 ? '#ecfdf5' : '#fef2f2', color: summary.netProfit >= 0 ? '#059669' : '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUpIcon size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: summary.netProfit >= 0 ? '#059669' : '#dc2626' }}>
            ₹{summary.netProfit.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
            Profit Margin: <strong style={{ color: summary.netProfit >= 0 ? '#059669' : '#dc2626' }}>{summary.netMarginPercent}%</strong>
          </div>
        </div>

        {/* MONTHLY RECURRING BURN */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Monthly Recurring Burn</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RecurringIcon size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0284c7' }}>
            ₹{summary.monthlyBurnRate.toLocaleString('en-IN')}
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/mo</span>
          </div>
          <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
            Annual Run Rate: ₹{summary.projectedAnnualRunRate.toLocaleString('en-IN')}
          </div>
        </div>

        {/* INVOICING PIPELINE */}
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Invoices Billed</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fce7f3', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <InvoiceIcon size={17} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            ₹{summary.invoices?.totalAmount?.toLocaleString('en-IN') || 0}
          </div>
          <div style={{ fontSize: '0.73rem', color: '#64748b' }}>
            {summary.invoices?.totalCount || 0} issued • Pending: <strong style={{ color: '#d97706' }}>₹{summary.invoices?.pendingAmount || 0}</strong>
          </div>
        </div>

      </div>

      {/* NAVIGATION TABS */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: 'Financial Overview & P&L', icon: TrendingUpIcon },
          { id: 'invoices', label: `Invoices & Billing (${invoices.length})`, icon: InvoiceIcon },
          { id: 'expenses', label: `Expense Tracker (${expenses.length})`, icon: ReceiptIcon },
          { id: 'income', label: `Income & AdSense (${income.length})`, icon: AdSenseIcon },
          { id: 'recurring', label: `Subscriptions & Website Costs (${recurring.length})`, icon: RecurringIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: isActive ? '3px solid #ec4899' : '3px solid transparent',
                background: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#ec4899' : '#64748b',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s',
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW & P&L */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '18px' }}>
            
            {/* EXPENSE BREAKDOWN BY CATEGORY */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>Expense Distribution</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Every Penny Breakdown</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.entries(CATEGORY_META).map(([key, meta]) => {
                  const amount = categoryTotals[key] || 0;
                  const percent = summary.totalExpenses > 0 ? Math.round((amount / summary.totalExpenses) * 100) : 0;
                  return (
                    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <span style={{ color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: meta.color }} />
                          {meta.label}
                        </span>
                        <span style={{ color: '#64748b' }}>
                          ₹{amount.toLocaleString('en-IN')} <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>({percent}%)</span>
                        </span>
                      </div>
                      <div style={{ height: '6px', width: '100%', background: '#f1f5f9', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${percent}%`, background: meta.color, borderRadius: '999px', transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INCOME STREAMS BREAKDOWN */}
            <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>Revenue Streams</h3>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Monetization Channels</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Store Sales */}
                <div style={{ background: '#fff5f9', border: '1px solid #fce7f3', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#be185d' }}>LovelyCrafts Store Orders</div>
                    <div style={{ fontSize: '0.75rem', color: '#9d174d' }}>{summary.totalPaidOrdersCount} paid note creations</div>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#be185d' }}>
                    ₹{summary.totalStoreSales.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Google AdSense */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d' }}>Google AdSense Banner Ads</div>
                    <div style={{ fontSize: '0.75rem', color: '#166534' }}>{summary.totalAdImpressions.toLocaleString()} ad impressions recorded</div>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                    ₹{summary.totalAdSenseIncome.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Other Revenue */}
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>Custom Orders & Brand Sponsorships</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Bespoke digital design & collaborations</div>
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155' }}>
                    ₹{summary.totalOtherIncome.toLocaleString('en-IN')}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RECENT EXPENSES & TRANSACTIONS */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: '#0f172a' }}>Recent Ledger Activity</h3>
              <button onClick={() => setActiveTab('expenses')} style={{ background: 'transparent', border: 'none', color: '#ec4899', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
                View All Expenses →
              </button>
            </div>
            {expenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '0.85rem' }}>
                No expenses recorded yet. Click "+ Log Expense" to start tracking.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '8px 10px' }}>Date</th>
                      <th style={{ padding: '8px 10px' }}>Expense Details</th>
                      <th style={{ padding: '8px 10px' }}>Category</th>
                      <th style={{ padding: '8px 10px' }}>Vendor / Payee</th>
                      <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.slice(0, 5).map((e) => {
                      const cat = CATEGORY_META[e.category] || CATEGORY_META.misc;
                      return (
                        <tr key={e.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '10px', color: '#64748b' }}>{e.date}</td>
                          <td style={{ padding: '10px', fontWeight: 600, color: '#0f172a' }}>{e.title}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ background: cat.bg, color: cat.color, padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                              {cat.label}
                            </span>
                          </td>
                          <td style={{ padding: '10px', color: '#475569' }}>{e.vendor || '—'}</td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                            -₹{e.amount}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: 2. INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* QUICK GENERATE INVOICE FROM CLOSED CHECKOUTS SECTION */}
          {paidOrders.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%)', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <InvoiceIcon size={18} className="text-pink-600" />
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#9d174d' }}>
                    Generate Invoices from Closed Paid Checkouts
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#be185d', fontWeight: 600 }}>
                  {paidOrders.length} Paid Order Checkouts Available
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {paidOrders.slice(0, 8).map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => handlePopulateFromOrder(order)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #f472b6',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      minWidth: '200px',
                      boxShadow: '0 1px 3px rgba(236, 72, 153, 0.1)',
                      transition: 'transform 0.1s, box-shadow 0.1s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: '#be185d' }}>
                        #{order.note_id?.substring(0, 10)}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d' }}>
                        ₹{order.amount}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                      {order.customer_name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                      {order.template_id} • ⚡ Click to Invoice
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SEARCH & FILTERS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search invoice #, customer name, email, order ID..."
                value={invoiceSearch}
                onChange={(e) => setInvoiceSearch(e.target.value)}
                style={{ width: '100%', maxWidth: '380px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <select
                value={invoiceFilter}
                onChange={(e) => setInvoiceFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={exportInvoicesCSV}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <DownloadIcon size={14} />
                Export CSV
              </button>
              <button
                onClick={() => {
                  setInvoiceForm({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    customerAddress: '',
                    customerGstin: '',
                    status: 'paid',
                    discount: '0',
                    taxRate: '18',
                    orderId: '',
                    notes: 'Thank you for choosing LovelyCrafts! For instant support, write to support@lovelycrafts.shop',
                    terms: '1. Complete access to digital crafts granted.\n2. Invoiced amount inclusive of applicable digital taxes.',
                    items: [{ description: 'LovelyCrafts Interactive Digital Experience', quantity: 1, unitPrice: 199 }],
                  });
                  setIsInvoiceModalOpen(true);
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#ec4899', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <PlusCircleIcon size={14} />
                + Create Invoice
              </button>
            </div>
          </div>

          {/* INVOICES TABLE */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {filteredInvoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <InvoiceIcon size={40} className="mx-auto mb-2 opacity-40" />
                <p style={{ margin: '8px 0 4px', fontWeight: 600, color: '#64748b' }}>No invoices found</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Create your first client invoice using the button or checkout cards above.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Invoice No</th>
                      <th style={{ padding: '12px 14px' }}>Issued Date</th>
                      <th style={{ padding: '12px 14px' }}>Customer & Ref</th>
                      <th style={{ padding: '12px 14px' }}>Status</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Total Amount</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv) => {
                      const isPaid = inv.status === 'paid';
                      return (
                        <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>
                            {inv.invoiceNumber}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>
                            {inv.issuedDate}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{inv.customerName}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              {inv.customerEmail || inv.customerPhone || '—'}
                              {inv.orderId ? ` • Order #${inv.orderId.substring(0, 10)}` : ''}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <select
                              value={inv.status}
                              onChange={(e) => handleUpdateInvoiceStatus(inv.id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background: isPaid ? '#dcfce7' : inv.status === 'overdue' ? '#fee2e2' : '#fef3c7',
                                color: isPaid ? '#15803d' : inv.status === 'overdue' ? '#b91c1c' : '#b45309',
                                cursor: 'pointer',
                              }}
                            >
                              <option value="paid">Paid</option>
                              <option value="pending">Pending</option>
                              <option value="overdue">Overdue</option>
                              <option value="draft">Draft</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 800, color: '#0f172a' }}>
                            ₹{inv.totalAmount?.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <button
                                onClick={() => setPreviewInvoice(inv)}
                                title="View & Download PDF Invoice"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  border: '1px solid #e2e8f0',
                                  background: '#ffffff',
                                  color: '#0284c7',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                <PrinterIcon size={14} />
                                View / PDF
                              </button>
                              <button
                                onClick={() => handleDeleteInvoice(inv.id)}
                                title="Delete Invoice"
                                style={{
                                  padding: '6px',
                                  borderRadius: '6px',
                                  border: '1px solid #fee2e2',
                                  background: '#fef2f2',
                                  color: '#ef4444',
                                  cursor: 'pointer',
                                }}
                              >
                                <TrashIcon size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: 3. EXPENSES */}
      {activeTab === 'expenses' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* CONTROLS */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                placeholder="Search vendor, title, notes..."
                value={expenseSearch}
                onChange={(e) => setExpenseSearch(e.target.value)}
                style={{ width: '100%', maxWidth: '340px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
              <select
                value={expenseFilter}
                onChange={(e) => setExpenseFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
              >
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_META).map(([k, meta]) => (
                  <option key={k} value={k}>{meta.label}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={exportExpensesCSV}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <DownloadIcon size={14} />
                Export CSV
              </button>
              <button
                onClick={() => setIsExpenseModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
              >
                <PlusCircleIcon size={14} />
                + Record Expense
              </button>
            </div>
          </div>

          {/* EXPENSES TABLE */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            {filteredExpenses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                <ReceiptIcon size={40} className="mx-auto mb-2 opacity-40" />
                <p style={{ margin: '8px 0 4px', fontWeight: 600, color: '#64748b' }}>No expense records found</p>
                <p style={{ margin: 0, fontSize: '0.8rem' }}>Log all your Vercel, Firebase, domain, and API costs here.</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Title & Notes</th>
                      <th style={{ padding: '12px 14px' }}>Category</th>
                      <th style={{ padding: '12px 14px' }}>Vendor</th>
                      <th style={{ padding: '12px 14px' }}>Method</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((exp) => {
                      const cat = CATEGORY_META[exp.category] || CATEGORY_META.misc;
                      return (
                        <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {exp.date}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{exp.title}</div>
                            {exp.notes && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{exp.notes}</div>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ background: cat.bg, color: cat.color, padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600 }}>
                              {cat.label}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#334155' }}>
                            {exp.vendor || '—'}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.78rem' }}>
                            {exp.paymentMethod || 'UPI'}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                            -₹{exp.amount?.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <TrashIcon size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: 4. INCOME & GOOGLE ADSENSE */}
      {activeTab === 'income' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* ADSENSE STATS BANNER */}
          <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '12px', padding: '20px 24px', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.2)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <AdSenseIcon size={20} />
                <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>Google AdSense Monetization</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>
                ₹{summary.totalAdSenseIncome.toLocaleString('en-IN')} Recorded Ad Revenue
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', opacity: 0.9 }}>
                {summary.totalAdImpressions.toLocaleString()} Total Ad Impressions • Google Publisher Monetization
              </p>
            </div>
            <button
              onClick={() => {
                setIncomeForm({ ...incomeForm, source: 'google_adsense', title: 'Google AdSense Monthly Payout' });
                setIsIncomeModalOpen(true);
              }}
              style={{
                background: '#ffffff',
                color: '#059669',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              + Log AdSense Payout / RPM
            </button>
          </div>

          {/* INCOME LIST */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>All Income Streams</h3>
              <button
                onClick={() => setIsIncomeModalOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
              >
                <PlusCircleIcon size={14} />
                + Add Revenue Stream
              </button>
            </div>

            {income.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', color: '#94a3b8' }}>
                <AdSenseIcon size={36} className="mx-auto mb-2 opacity-40" />
                <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>No income entries logged yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      <th style={{ padding: '12px 14px' }}>Date</th>
                      <th style={{ padding: '12px 14px' }}>Title & Ref</th>
                      <th style={{ padding: '12px 14px' }}>Source</th>
                      <th style={{ padding: '12px 14px' }}>Ad Metrics (Impressions / CPM)</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {income.map((inc) => {
                      const src = INCOME_SOURCES[inc.source] || INCOME_SOURCES.other;
                      return (
                        <tr key={inc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', color: '#64748b' }}>{inc.date}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{inc.title}</div>
                            {inc.referenceId && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ref: {inc.referenceId}</div>}
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <span style={{ color: src.color, fontWeight: 600, fontSize: '0.78rem' }}>
                              {src.label}
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569', fontSize: '0.78rem' }}>
                            {inc.source === 'google_adsense' ? (
                              <span>{inc.impressions ? `${inc.impressions.toLocaleString()} views` : '—'} {inc.cpm ? `• CPM ₹${inc.cpm}` : ''}</span>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#059669' }}>
                            +₹{inc.amount?.toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteIncome(inc.id)}
                              style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                            >
                              <TrashIcon size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB CONTENT: 5. RECURRING SUBSCRIPTIONS */}
      {activeTab === 'recurring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* RECURRING BURN RATE SUMMARY */}
          <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                Website Fixed Costing & Infrastructure
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '3px 0' }}>
                ₹{summary.monthlyBurnRate.toLocaleString('en-IN')} / month
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Annualized Hosting & SaaS Cost: <strong>₹{summary.projectedAnnualRunRate.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <button
              onClick={() => setIsRecurringModalOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <PlusCircleIcon size={15} />
              + Add Recurring Cost
            </button>
          </div>

          {/* RECURRING ITEMS LIST */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
            {recurring.map((item) => {
              const cat = CATEGORY_META[item.category] || CATEGORY_META.hosting;
              return (
                <div key={item.id} style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ background: cat.bg, color: cat.color, padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {cat.label}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>
                      {item.frequency === 'yearly' ? 'Annual Renewal' : `Day ${item.billingDay || 1} Monthly`}
                    </span>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{item.title}</h4>
                    {item.vendor && <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Vendor: {item.vendor}</p>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0284c7' }}>₹{item.amount}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/{item.frequency === 'yearly' ? 'year' : 'month'}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    <button
                      onClick={() => handleLogRecurringAsExpense(item)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #e0f2fe',
                        background: '#f0f9ff',
                        color: '#0284c7',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      ⚡ Record This Month's Bill
                    </button>
                    <button
                      onClick={() => handleDeleteRecurring(item.id)}
                      style={{ padding: '6px', borderRadius: '6px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: CREATE EXPENSE */}
      {/* ========================================================================= */}
      {isExpenseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Log Operational Expense</h3>
              <button onClick={() => setIsExpenseModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Expense Title / Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel Pro Plan, Cloudinary Plus"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    {Object.entries(CATEGORY_META).map(([k, meta]) => (
                      <option key={k} value={k}>{meta.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 1650"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Payment Method</label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="Credit Card">Credit Card</option>
                    <option value="UPI">UPI</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Vendor / Payee</label>
                  <input
                    type="text"
                    placeholder="e.g. Vercel Inc., Google"
                    value={expenseForm.vendor}
                    onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Receipt URL / Link</label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/..."
                    value={expenseForm.receiptUrl}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receiptUrl: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows={2}
                  placeholder="Additional tax info or details..."
                  value={expenseForm.notes}
                  onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {actionLoading ? 'Recording...' : 'Record Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: RECORD INCOME / ADSENSE */}
      {/* ========================================================================= */}
      {isIncomeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Record Revenue Stream</h3>
              <button onClick={() => setIsIncomeModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateIncome} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Income Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google AdSense August Earnings, Custom Retro Design"
                  value={incomeForm.title}
                  onChange={(e) => setIncomeForm({ ...incomeForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Income Stream *</label>
                  <select
                    value={incomeForm.source}
                    onChange={(e) => setIncomeForm({ ...incomeForm, source: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    {Object.entries(INCOME_SOURCES).map(([k, meta]) => (
                      <option key={k} value={k}>{meta.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 5400"
                    value={incomeForm.amount}
                    onChange={(e) => setIncomeForm({ ...incomeForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {incomeForm.source === 'google_adsense' && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#166534', marginBottom: '2px' }}>Ad Impressions</label>
                    <input
                      type="number"
                      placeholder="e.g. 45000"
                      value={incomeForm.impressions}
                      onChange={(e) => setIncomeForm({ ...incomeForm, impressions: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#166534', marginBottom: '2px' }}>Avg CPM / RPM (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 120"
                      value={incomeForm.cpm}
                      onChange={(e) => setIncomeForm({ ...incomeForm, cpm: e.target.value })}
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #86efac', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    value={incomeForm.date}
                    onChange={(e) => setIncomeForm({ ...incomeForm, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Payout / UTR Ref</label>
                  <input
                    type="text"
                    placeholder="e.g. ADS-2026-08"
                    value={incomeForm.referenceId}
                    onChange={(e) => setIncomeForm({ ...incomeForm, referenceId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes or campaign details..."
                  value={incomeForm.notes}
                  onChange={(e) => setIncomeForm({ ...incomeForm, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {actionLoading ? 'Saving...' : 'Record Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD RECURRING SUBSCRIPTION */}
      {/* ========================================================================= */}
      {isRecurringModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Add Website Recurring Subscription</h3>
              <button onClick={() => setIsRecurringModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateRecurring} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Service / Tool Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vercel Pro Hosting, Domain lovelycrafts.shop"
                  value={recurringForm.title}
                  onChange={(e) => setRecurringForm({ ...recurringForm, title: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Category *</label>
                  <select
                    value={recurringForm.category}
                    onChange={(e) => setRecurringForm({ ...recurringForm, category: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    {Object.entries(CATEGORY_META).map(([k, meta]) => (
                      <option key={k} value={k}>{meta.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Amount (₹ INR) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 1650"
                    value={recurringForm.amount}
                    onChange={(e) => setRecurringForm({ ...recurringForm, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Frequency</label>
                  <select
                    value={recurringForm.frequency}
                    onChange={(e) => setRecurringForm({ ...recurringForm, frequency: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly (Annual)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Billing Day (1 - 31)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={recurringForm.billingDay}
                    onChange={(e) => setRecurringForm({ ...recurringForm, billingDay: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Vendor / Website</label>
                <input
                  type="text"
                  placeholder="e.g. vercel.com"
                  value={recurringForm.vendor}
                  onChange={(e) => setRecurringForm({ ...recurringForm, vendor: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setIsRecurringModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {actionLoading ? 'Adding...' : 'Add Subscription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE CUSTOM INVOICE WITH AUTO-FILL FROM PAID ORDERS */}
      {/* ========================================================================= */}
      {isInvoiceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '660px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 2px', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Generate Client Invoice</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Create a printable and downloadable PDF-ready invoice</p>
              </div>
              <button onClick={() => setIsInvoiceModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            {/* AUTO-FILL FROM CLOSED CHECKOUT SELECTOR */}
            {paidOrders.length > 0 && (
              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', padding: '10px 14px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#be185d' }}>
                  ⚡ Auto-fill Details from Paid Customer Order:
                </label>
                <select
                  value={invoiceForm.orderId || ''}
                  onChange={(e) => {
                    const selected = paidOrders.find((o) => o.id === e.target.value || o.note_id === e.target.value);
                    if (selected) handlePopulateFromOrder(selected);
                  }}
                  style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #f472b6', fontSize: '0.82rem', background: '#fff', color: '#0f172a' }}
                >
                  <option value="">-- Choose a closed customer order --</option>
                  {paidOrders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.customer_name} • #{o.note_id?.substring(0, 10)} • ₹{o.amount} ({o.template_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* CUSTOMER DETAILS */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#ec4899', letterSpacing: '0.04em' }}>Customer & Billing Info</span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Customer Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={invoiceForm.customerName}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, customerName: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Customer Email</label>
                    <input
                      type="email"
                      placeholder="e.g. john@example.com"
                      value={invoiceForm.customerEmail}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, customerEmail: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Phone Number</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210"
                      value={invoiceForm.customerPhone}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, customerPhone: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Status</label>
                    <select
                      value={invoiceForm.status}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                      style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                    >
                      <option value="paid">Paid (Receipt)</option>
                      <option value="pending">Pending Payment</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Billing Address / GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="Address or GSTIN number if applicable"
                    value={invoiceForm.customerAddress}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, customerAddress: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* LINE ITEMS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Itemized Services / Products</span>
                  <button
                    type="button"
                    onClick={addInvoiceItem}
                    style={{ background: '#fce7f3', border: 'none', color: '#ec4899', fontSize: '0.75rem', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    + Add Item Line
                  </button>
                </div>

                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      required
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateInvoiceItem(idx, 'description', e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateInvoiceItem(idx, 'quantity', e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Price (₹)"
                      value={item.unitPrice}
                      onChange={(e) => updateInvoiceItem(idx, 'unitPrice', e.target.value)}
                      style={{ padding: '6px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeInvoiceItem(idx)}
                      disabled={invoiceForm.items.length <= 1}
                      style={{ padding: '6px', borderRadius: '4px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', opacity: invoiceForm.items.length <= 1 ? 0.4 : 1 }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* TAXES & TOTAL CALCULATOR */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>Discount (₹)</label>
                  <input
                    type="number"
                    value={invoiceForm.discount}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#334155', marginBottom: '2px' }}>GST / Tax Rate (%)</label>
                  <select
                    value={invoiceForm.taxRate}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: e.target.value })}
                    style={{ width: '100%', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#fff' }}
                  >
                    <option value="0">0% (Zero Tax / Digital Export)</option>
                    <option value="5">5% GST</option>
                    <option value="12">12% GST</option>
                    <option value="18">18% GST (Standard)</option>
                    <option value="28">28% GST</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#ec4899', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {actionLoading ? 'Generating...' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: PRINTABLE / PDF-READY INVOICE VIEW */}
      {/* ========================================================================= */}
      {previewInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', width: '100%', maxWidth: '720px', maxHeight: '92vh', overflowY: 'auto', padding: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* MODAL CONTROLS (HIDDEN DURING PRINT) */}
            <div className="no-print" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Invoice Preview: {previewInvoice.invoiceNumber}</span>
                <span style={{
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: previewInvoice.status === 'paid' ? '#dcfce7' : '#fef3c7',
                  color: previewInvoice.status === 'paid' ? '#15803d' : '#b45309',
                }}>
                  {previewInvoice.status?.toUpperCase()}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handlePrintInvoice(previewInvoice)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    background: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  <PrinterIcon size={16} />
                  Print / Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewInvoice(null)}
                  style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE BODY */}
            <div id="printable-invoice" style={{ background: '#ffffff', padding: '24px', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              
              {/* HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #ec4899', paddingBottom: '18px', marginBottom: '20px' }}>
                <div>
                  <h1 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 900, color: '#ec4899', letterSpacing: '-0.02em' }}>LovelyCrafts</h1>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>Digital Interactive Notes & Bespoke Crafts</p>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>support@lovelycrafts.shop • lovelycrafts.shop</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>INVOICE</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{previewInvoice.invoiceNumber}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Date: {previewInvoice.issuedDate}</div>
                </div>
              </div>

              {/* BILLED TO */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>Billed To</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{previewInvoice.customerName}</div>
                  {previewInvoice.customerEmail && <div style={{ fontSize: '0.8rem', color: '#475569' }}>{previewInvoice.customerEmail}</div>}
                  {previewInvoice.customerPhone && <div style={{ fontSize: '0.8rem', color: '#475569' }}>{previewInvoice.customerPhone}</div>}
                  {previewInvoice.customerAddress && <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>{previewInvoice.customerAddress}</div>}
                  {previewInvoice.orderId && <div style={{ fontSize: '0.75rem', color: '#be185d', fontWeight: 600, marginTop: '4px' }}>Order Reference: #{previewInvoice.orderId}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.05em', marginBottom: '4px' }}>Payment Status</div>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    background: previewInvoice.status === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: previewInvoice.status === 'paid' ? '#15803d' : '#b45309',
                  }}>
                    {previewInvoice.status === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
                  </div>
                  {previewInvoice.paymentMethod && (
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Method: {previewInvoice.paymentMethod}</div>
                  )}
                </div>
              </div>

              {/* ITEMS TABLE */}
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', color: '#475569', textAlign: 'left', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '10px' }}>Item Description</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Rate (₹)</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {(previewInvoice.items || []).map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '10px', fontWeight: 600 }}>{item.description}</td>
                      <td style={{ padding: '10px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>₹{item.unitPrice}</td>
                      <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{item.total || (item.quantity * item.unitPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTALS CALCULATION */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                <div style={{ width: '260px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                    <span>Subtotal</span>
                    <span>₹{previewInvoice.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  {Number(previewInvoice.discount) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                      <span>Discount</span>
                      <span>-₹{previewInvoice.discount}</span>
                    </div>
                  )}
                  {Number(previewInvoice.taxAmount) > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                      <span>GST ({previewInvoice.taxRate}%)</span>
                      <span>₹{previewInvoice.taxAmount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #0f172a', paddingTop: '6px', fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    <span>Total Payable</span>
                    <span>₹{previewInvoice.totalAmount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* TERMS & NOTES */}
              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', fontSize: '0.75rem', color: '#64748b' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#334155' }}>Notes & Instructions:</p>
                <p style={{ margin: '0 0 8px', whiteSpace: 'pre-line' }}>{previewInvoice.notes}</p>
                {previewInvoice.terms && (
                  <p style={{ margin: 0, whiteSpace: 'pre-line', opacity: 0.8 }}>{previewInvoice.terms}</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Print styles moved to dedicated print window — no longer needed here */}

    </div>
  );
}

export default function AdminFinancePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: '#64748b', fontSize: '0.9rem' }}>
        Loading Financial Hub...
      </div>
    }>
      <FinanceDashboardContent />
    </Suspense>
  );
}
