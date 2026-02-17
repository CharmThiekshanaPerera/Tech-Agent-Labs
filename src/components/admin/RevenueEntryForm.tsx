import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const AGENT_OPTIONS = [
  "Support Agent",
  "Marketing Agent",
  "Analytics Agent",
  "Operations Agent",
  "Sales Agent",
  "Content Agent",
  "Web Agent",
  "Custom Agent",
];

export type RevenueFormData = {
  type: string;
  agent_name: string;
  customer_name: string;
  customer_email: string;
  amount: string;
  is_recurring: boolean;
  recurring_interval: string;
  status: string;
  notes: string;
  sale_date: string;
};

interface RevenueEntryFormProps {
  form: RevenueFormData;
  setForm: (form: RevenueFormData) => void;
  onSubmit: () => void;
  isPending: boolean;
  submitLabel: string;
  pendingLabel: string;
}

const RevenueEntryForm = ({ form, setForm, onSubmit, isPending, submitLabel, pendingLabel }: RevenueEntryFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Type</Label>
          <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sale">Sale</SelectItem>
              <SelectItem value="subscription">Subscription</SelectItem>
              <SelectItem value="custom_build">Custom Build</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Agent</Label>
          <Select value={form.agent_name} onValueChange={(v) => setForm({ ...form, agent_name: v })}>
            <SelectTrigger><SelectValue placeholder="Select agent" /></SelectTrigger>
            <SelectContent>
              {AGENT_OPTIONS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Amount ($)</Label>
          <Input type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        </div>
        <div>
          <Label>Date</Label>
          <Input type="date" value={form.sale_date} onChange={(e) => setForm({ ...form, sale_date: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Customer Name</Label>
          <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
        </div>
        <div>
          <Label>Customer Email</Label>
          <Input type="email" value={form.customer_email} onChange={(e) => setForm({ ...form, customer_email: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <label className="flex items-center gap-2 text-sm pb-2">
            <input type="checkbox" checked={form.is_recurring} onChange={(e) => setForm({ ...form, is_recurring: e.target.checked })} className="rounded" />
            Recurring
          </label>
          {form.is_recurring && (
            <Select value={form.recurring_interval} onValueChange={(v) => setForm({ ...form, recurring_interval: v })}>
              <SelectTrigger className="w-28"><SelectValue placeholder="Interval" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} />
      </div>
      <Button
        className="w-full"
        onClick={onSubmit}
        disabled={!form.agent_name || !form.amount || isPending}
      >
        {isPending ? pendingLabel : submitLabel}
      </Button>
    </div>
  );
};

export default RevenueEntryForm;
