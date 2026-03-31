'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
import type { InvoiceData, TemplateStyle } from '@/lib/invoice/types';
import { formatCurrency, formatDate } from '@/lib/invoice/utils';

const colors: Record<TemplateStyle, { primary: string; accent: string }> = {
  classic: { primary: '#2563eb', accent: '#dbeafe' },
  modern: { primary: '#0f172a', accent: '#f1f5f9' },
  minimal: { primary: '#374151', accent: '#f9fafb' },
};

const s = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: 'Helvetica', color: '#1f2937' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', letterSpacing: 2 },
  senderName: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  small: { fontSize: 8, color: '#6b7280', marginBottom: 2 },
  sectionTitle: { fontSize: 8, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 6 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  tableHeader: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderRadius: 4, marginBottom: 4 },
  tableRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 8, borderBottom: '1px solid #f3f4f6' },
  colDesc: { flex: 3 },
  colQty: { flex: 1, textAlign: 'right' },
  colPrice: { flex: 1, textAlign: 'right' },
  colAmount: { flex: 1, textAlign: 'right' },
  totalsContainer: { alignItems: 'flex-end', marginTop: 16 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', width: 200, marginBottom: 4 },
  totalLabel: { color: '#6b7280' },
  totalValue: { fontWeight: 'bold' },
  divider: { borderBottom: '1px solid #d1d5db', marginVertical: 6, width: 200 },
  notesBox: { marginTop: 24, padding: 12, borderRadius: 4 },
  notesTitle: { fontSize: 8, fontWeight: 'bold', color: '#9ca3af', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4 },
});

interface Props {
  data: InvoiceData;
  template: TemplateStyle;
}

export default function InvoicePDF({ data, template }: Props) {
  const c = colors[template];

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.headerRow}>
          <View>
            <Text style={s.senderName}>{data.senderName || 'Your Business'}</Text>
            {data.senderAddress ? <Text style={s.small}>{data.senderAddress}</Text> : null}
            {data.senderEmail ? <Text style={s.small}>{data.senderEmail}</Text> : null}
            {data.senderPhone ? <Text style={s.small}>{data.senderPhone}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[s.title, { color: c.primary }]}>INVOICE</Text>
            <Text style={[s.small, { marginTop: 6 }]}>{data.invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill To + Dates */}
        <View style={s.billRow}>
          <View>
            <Text style={s.sectionTitle}>Bill To</Text>
            <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{data.clientName || 'Client Name'}</Text>
            {data.clientCompany ? <Text style={s.small}>{data.clientCompany}</Text> : null}
            {data.clientAddress ? <Text style={s.small}>{data.clientAddress}</Text> : null}
            {data.clientEmail ? <Text style={s.small}>{data.clientEmail}</Text> : null}
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={s.small}>Invoice Date: {formatDate(data.invoiceDate)}</Text>
            <Text style={s.small}>Due Date: {formatDate(data.dueDate)}</Text>
            <Text style={s.small}>Terms: {data.paymentTerms}</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={[s.tableHeader, { backgroundColor: c.accent }]}>
          <Text style={[s.colDesc, { fontWeight: 'bold', color: '#6b7280', fontSize: 8 }]}>Description</Text>
          <Text style={[s.colQty, { fontWeight: 'bold', color: '#6b7280', fontSize: 8 }]}>Qty</Text>
          <Text style={[s.colPrice, { fontWeight: 'bold', color: '#6b7280', fontSize: 8 }]}>Price</Text>
          <Text style={[s.colAmount, { fontWeight: 'bold', color: '#6b7280', fontSize: 8 }]}>Amount</Text>
        </View>

        {/* Table Rows */}
        {data.items.map((item) => (
          <View key={item.id} style={s.tableRow}>
            <Text style={s.colDesc}>{item.description || '—'}</Text>
            <Text style={s.colQty}>{item.quantity}</Text>
            <Text style={s.colPrice}>{formatCurrency(item.unitPrice, data.currency)}</Text>
            <Text style={s.colAmount}>{formatCurrency(item.quantity * item.unitPrice, data.currency)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsContainer}>
          <View style={s.totalsRow}>
            <Text style={s.totalLabel}>Subtotal</Text>
            <Text>{formatCurrency(data.subtotal, data.currency)}</Text>
          </View>
          {data.discountAmount > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalLabel}>Discount</Text>
              <Text style={{ color: '#dc2626' }}>-{formatCurrency(data.discountAmount, data.currency)}</Text>
            </View>
          )}
          {data.taxAmount > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalLabel}>Tax ({data.taxRate}%)</Text>
              <Text>{formatCurrency(data.taxAmount, data.currency)}</Text>
            </View>
          )}
          <View style={s.divider} />
          <View style={s.totalsRow}>
            <Text style={s.totalValue}>Total</Text>
            <Text style={[s.totalValue, { color: c.primary }]}>{formatCurrency(data.total, data.currency)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes ? (
          <View style={[s.notesBox, { backgroundColor: c.accent }]}>
            <Text style={s.notesTitle}>Notes</Text>
            <Text style={{ fontSize: 9, color: '#374151' }}>{data.notes}</Text>
          </View>
        ) : null}

        {/* Signature */}
        {data.signature ? (
          <View style={{ marginTop: 30, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#1f2937', marginBottom: 4 }}>{data.signature}</Text>
            <View style={{ borderBottom: '1px solid #9ca3af', width: 160, marginBottom: 4 }} />
            <Text style={{ fontSize: 8, color: '#9ca3af' }}>Authorized Signature</Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
}
