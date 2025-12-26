"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NavBarSimple } from "@/components/NavBarSimple";
import { useToast } from "@/context/ToastContext";
import { useSession } from "@/hooks/useSession";
import type {
  BranchRecord,
  ContactRecord,
  CustomerRecord,
  ToolCustomerRecord,
  ToolRecord,
} from "@/lib/content-types";

type ApiState = {
  branches: BranchRecord[];
  tools: ToolRecord[];
  contacts: ContactRecord[];
  customers: CustomerRecord[];
  toolsCustomers: ToolCustomerRecord[];
};

const normalizeStatus = (status?: string | null): ToolRecord["status"] => {
  if (status === "In Prüfung" || status === "Entwurf") return status as ToolRecord["status"];
  return "Aktiv";
};

async function apiJson<T>(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    const msg = await res.json().catch(() => ({}));
    throw new Error(msg.error ?? `Anfrage fehlgeschlagen: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export default function AdminPage() {
  const { session, loading } = useSession();
  const router = useRouter();
  const [data, setData] = useState<ApiState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchRecord | null>(null);
  const [editingTool, setEditingTool] = useState<ToolRecord | null>(null);
  const [editingContact, setEditingContact] = useState<ContactRecord | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<CustomerRecord | null>(null);
  const toast = useToast();

  const load = async () => {
    try {
      const res = await apiJson<ApiState>("/api/content");
      setData(res);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Laden fehlgeschlagen");
    }
  };

  useEffect(() => {
    if (session && session.role !== "admin") {
      router.push("/");
      return;
    }
    if (session?.role === "admin") {
      load();
    }
  }, [session, router]);

  if (!session && !loading) {
    router.push("/login");
    return null;
  }
  if (session && session.role !== "admin") return null;

  const runWithFeedback = async (fn: () => Promise<void>, successMessage: string) => {
    setBusy(true);
    try {
      await fn();
      toast?.addToast({ type: "success", text: successMessage });
      await load();
    } catch (err) {
      toast?.addToast({
        type: "error",
        text: err instanceof Error ? err.message : "Unerwarteter Fehler",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const handleBranchCreate = async (form: FormData) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/branches", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            summary: form.get("summary"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Bereich erstellt",
    );
  };

  const handleBranchDelete = async (id: number) => {
    await runWithFeedback(
      () => apiJson("/api/admin/branches", { method: "DELETE", body: JSON.stringify({ id }) }),
      "Bereich gelöscht",
    );
  };

  const handleBranchUpdate = async (form: FormData, id: number) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/branches", {
          method: "PUT",
          body: JSON.stringify({
            id,
            name: form.get("name"),
            summary: form.get("summary"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Bereich aktualisiert",
    );
    setEditingBranch(null);
  };

  const handleToolCreate = async (form: FormData) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/tools", {
          method: "POST",
          body: JSON.stringify({
            branchId: form.get("branchId") ? Number(form.get("branchId")) : null,
            title: form.get("title"),
            description: form.get("description"),
            previewUrl: form.get("previewUrl") ? String(form.get("previewUrl")) : null,
            videoUrl: form.get("videoUrl") ? String(form.get("videoUrl")) : null,
            status: form.get("status"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Tool erstellt",
    );
  };

  const handleToolDelete = async (id: number) => {
    await runWithFeedback(
      () => apiJson("/api/admin/tools", { method: "DELETE", body: JSON.stringify({ id }) }),
      "Tool gelöscht",
    );
  };

  const handleToolUpdate = async (form: FormData, id: number) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/tools", {
          method: "PUT",
          body: JSON.stringify({
            id,
            branchId: form.get("branchId") ? Number(form.get("branchId")) : null,
            title: form.get("title"),
            description: form.get("description"),
            previewUrl: form.get("previewUrl") ? String(form.get("previewUrl")) : null,
            videoUrl: form.get("videoUrl") ? String(form.get("videoUrl")) : null,
            status: form.get("status"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Tool aktualisiert",
    );
    setEditingTool(null);
  };

  const handleContactCreate = async (form: FormData) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/contacts", {
          method: "POST",
          body: JSON.stringify({
            label: form.get("label"),
            value: form.get("value"),
            kind: form.get("kind"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Kontakt erstellt",
    );
  };

  const handleContactDelete = async (id: number) => {
    await runWithFeedback(
      () => apiJson("/api/admin/contacts", { method: "DELETE", body: JSON.stringify({ id }) }),
      "Kontakt gelöscht",
    );
  };

  const handleContactUpdate = async (form: FormData, id: number) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/contacts", {
          method: "PUT",
          body: JSON.stringify({
            id,
            label: form.get("label"),
            value: form.get("value"),
            kind: form.get("kind"),
            sortOrder: Number(form.get("sortOrder") || 0),
          }),
        }),
      "Kontakt aktualisiert",
    );
    setEditingContact(null);
  };

  const handleCustomerCreate = async (form: FormData) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/customers", {
          method: "POST",
          body: JSON.stringify({
            name: form.get("name"),
            contactEmail: form.get("contactEmail") || null,
            contactPhone: form.get("contactPhone") || null,
          }),
        }),
      "Kunde erstellt",
    );
  };

  const handleCustomerDelete = async (id: number) => {
    await runWithFeedback(
      () => apiJson("/api/admin/customers", { method: "DELETE", body: JSON.stringify({ id }) }),
      "Kunde gelöscht",
    );
  };

  const handleCustomerUpdate = async (form: FormData, id: number) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/customers", {
          method: "PUT",
          body: JSON.stringify({
            id,
            name: form.get("name"),
            contactEmail: form.get("contactEmail") || null,
            contactPhone: form.get("contactPhone") || null,
          }),
        }),
      "Kunde aktualisiert",
    );
    setEditingCustomer(null);
  };

  const handleLinkCreate = async (form: FormData) => {
    await runWithFeedback(
      () =>
        apiJson("/api/admin/tool-customers", {
          method: "POST",
          body: JSON.stringify({
            toolId: Number(form.get("toolId")),
            customerId: Number(form.get("customerId")),
          }),
        }),
      "Verknüpfung erstellt",
    );
  };

  const handleLinkDelete = async (id: number) => {
    await runWithFeedback(
      () => apiJson("/api/admin/tool-customers", { method: "DELETE", body: JSON.stringify({ id }) }),
      "Verknüpfung gelöscht",
    );
  };

  const branchNameById = new Map((data?.branches ?? []).map((b) => [b.id, b.name]));

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-16 md:px-10 md:py-20">
      <NavBarSimple />
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-stone-900">Admin-Bereich</h1>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-stone-200 px-4 py-2 text-sm text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
        >
          Abmelden
        </button>
      </div>
      {busy && <div className="text-sm text-stone-600">Aktiv...</div>}
      {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-amber-800">{error}</div>}

      {data && (
        <>
          <AdminSection title="Bereiche" count={data.branches.length}>
            <BranchForm
              titleText={editingBranch ? "Bereich bearbeiten" : "Bereich anlegen"}
              initial={editingBranch ?? undefined}
              onSubmit={(form) =>
                editingBranch ? handleBranchUpdate(form, editingBranch.id) : handleBranchCreate(form)
              }
              onCancel={editingBranch ? () => setEditingBranch(null) : undefined}
            />
            <ItemList
              items={data.branches}
              render={(b) => (
                <SimpleCard
                  title={b.name}
                  subtitle={b.summary}
                  meta={`Reihenfolge: ${b.sortOrder}`}
                  onEdit={() => setEditingBranch(b)}
                  onDelete={() => handleBranchDelete(b.id)}
                />
              )}
            />
          </AdminSection>

          <AdminSection title="Tools" count={data.tools.length}>
            <ToolForm
              titleText={editingTool ? "Tool bearbeiten" : "Tool anlegen"}
              branches={data.branches}
              initial={editingTool ?? undefined}
              onSubmit={(form) => (editingTool ? handleToolUpdate(form, editingTool.id) : handleToolCreate(form))}
              onCancel={editingTool ? () => setEditingTool(null) : undefined}
            />
            <ItemList
              items={data.tools}
              render={(t) => (
                <SimpleCard
                  title={t.title}
                  subtitle={t.description}
                  meta={`${normalizeStatus(t.status)} - Bereich ${branchNameById.get(t.branchId ?? -1) ?? "Nicht zugeordnet"}`}
                  actions={
                    <>
                      <Link href={`/tools/${t.id}`} className="text-emerald-700 hover:text-emerald-800">
                        Details
                      </Link>
                      {t.previewUrl && (
                        <a href={t.previewUrl} className="text-emerald-700 hover:text-emerald-800" target="_blank" rel="noreferrer">
                          Demo
                        </a>
                      )}
                      {t.videoUrl && (
                        <a href={t.videoUrl} className="text-emerald-700 hover:text-emerald-800" target="_blank" rel="noreferrer">
                          Video
                        </a>
                      )}
                    </>
                  }
                  onEdit={() => setEditingTool(t)}
                  onDelete={() => handleToolDelete(t.id)}
                />
              )}
            />
          </AdminSection>

          <AdminSection title="Kontakte" count={data.contacts.length}>
            <ContactForm
              titleText={editingContact ? "Kontakt bearbeiten" : "Kontakt anlegen"}
              initial={editingContact ?? undefined}
              onSubmit={(form) =>
                editingContact ? handleContactUpdate(form, editingContact.id) : handleContactCreate(form)
              }
              onCancel={editingContact ? () => setEditingContact(null) : undefined}
            />
            <ItemList
              items={data.contacts}
              render={(c) => (
                <SimpleCard
                  title={`${c.label}: ${c.value}`}
                  subtitle={c.kind === "phone" ? "Telefon" : c.kind === "email" ? "E-Mail" : "Link"}
                  meta={`Reihenfolge: ${c.sortOrder}`}
                  onEdit={() => setEditingContact(c)}
                  onDelete={() => handleContactDelete(c.id)}
                />
              )}
            />
          </AdminSection>

          <AdminSection title="Kunden" count={data.customers.length}>
            <CustomerForm
              titleText={editingCustomer ? "Kunde bearbeiten" : "Kunde anlegen"}
              initial={editingCustomer ?? undefined}
              onSubmit={(form) =>
                editingCustomer ? handleCustomerUpdate(form, editingCustomer.id) : handleCustomerCreate(form)
              }
              onCancel={editingCustomer ? () => setEditingCustomer(null) : undefined}
            />
            <ItemList
              items={data.customers}
              render={(c) => (
                <SimpleCard
                  title={c.name}
                  subtitle={`${c.contactEmail ?? ""} ${c.contactPhone ?? ""}`}
                  onEdit={() => setEditingCustomer(c)}
                  onDelete={() => handleCustomerDelete(c.id)}
                />
              )}
            />
          </AdminSection>

          <AdminSection title="Tool -> Kunde" count={data.toolsCustomers.length}>
            <CreateLinkForm tools={data.tools} customers={data.customers} onSubmit={handleLinkCreate} />
            <ItemList
              items={data.toolsCustomers}
              render={(link) => {
                const tool = data.tools.find((t) => t.id === link.toolId);
                const customer = data.customers.find((c) => c.id === link.customerId);
                return (
                  <SimpleCard
                    title={`${tool?.title ?? "Tool"} -> ${customer?.name ?? "Kunde"}`}
                    onDelete={() => handleLinkDelete(link.id)}
                  />
                );
              }}
            />
          </AdminSection>
        </>
      )}
    </main>
  );
}

function AdminSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-stone-900">{title}</h2>
        <span className="text-sm text-stone-500">{count} Einträge</span>
      </div>
      <div className="grid gap-4">{children}</div>
    </div>
  );
}

function BranchForm({
  titleText,
  initial,
  onSubmit,
  onCancel,
}: {
  titleText: string;
  initial?: BranchRecord;
  onSubmit: (form: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  return (
    <FormCard title={titleText}>
      <form
        key={initial?.id ?? "new-branch"}
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          await onSubmit(new FormData(form));
          form.reset();
        }}
      >
        <TextInput name="name" label="Name" required defaultValue={initial?.name} />
        <TextArea name="summary" label="Kurzbeschreibung" required defaultValue={initial?.summary} />
        <NumberInput name="sortOrder" label="Reihenfolge" defaultValue={initial?.sortOrder} />
        <SubmitButton />
        {onCancel && (
          <button type="button" className="text-xs text-stone-600 underline" onClick={onCancel}>
            Bearbeitung abbrechen
          </button>
        )}
      </form>
    </FormCard>
  );
}

function ToolForm({
  branches,
  titleText,
  initial,
  onSubmit,
  onCancel,
}: {
  branches: BranchRecord[];
  titleText: string;
  initial?: ToolRecord;
  onSubmit: (form: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  return (
    <FormCard title={titleText}>
      <form
        key={initial?.id ?? "new-tool"}
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          await onSubmit(new FormData(form));
          form.reset();
        }}
      >
        <Select name="branchId" label="Bereich" defaultValue={initial?.branchId ?? ""}>
          <option value="">Keiner</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </Select>
        <TextInput name="title" label="Titel" required defaultValue={initial?.title} />
        <TextArea name="description" label="Beschreibung" required defaultValue={initial?.description} />
        <TextInput name="previewUrl" label="Preview-URL (optional)" defaultValue={initial?.previewUrl ?? undefined} />
        <TextInput name="videoUrl" label="Video-URL (optional)" defaultValue={initial?.videoUrl ?? undefined} />
        <Select name="status" label="Status" required defaultValue={normalizeStatus(initial?.status)}>
          <option value="Aktiv">Aktiv</option>
          <option value="In Prüfung">In Prüfung</option>
          <option value="Entwurf">Entwurf</option>
        </Select>
        <NumberInput name="sortOrder" label="Reihenfolge" defaultValue={initial?.sortOrder} />
        <SubmitButton />
        {onCancel && (
          <button type="button" className="text-xs text-stone-600 underline" onClick={onCancel}>
            Bearbeitung abbrechen
          </button>
        )}
      </form>
    </FormCard>
  );
}

function ContactForm({
  titleText,
  initial,
  onSubmit,
  onCancel,
}: {
  titleText: string;
  initial?: ContactRecord;
  onSubmit: (form: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  return (
    <FormCard title={titleText}>
      <form
        key={initial?.id ?? "new-contact"}
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          await onSubmit(new FormData(form));
          form.reset();
        }}
      >
        <TextInput name="label" label="Beschriftung" required defaultValue={initial?.label} />
        <TextInput name="value" label="Wert" required defaultValue={initial?.value} />
        <Select name="kind" label="Art" required defaultValue={initial?.kind ?? "email"}>
          <option value="email">E-Mail</option>
          <option value="phone">Telefon</option>
          <option value="link">Link</option>
        </Select>
        <NumberInput name="sortOrder" label="Reihenfolge" defaultValue={initial?.sortOrder} />
        <SubmitButton />
        {onCancel && (
          <button type="button" className="text-xs text-stone-600 underline" onClick={onCancel}>
            Bearbeitung abbrechen
          </button>
        )}
      </form>
    </FormCard>
  );
}

function CustomerForm({
  titleText,
  initial,
  onSubmit,
  onCancel,
}: {
  titleText: string;
  initial?: CustomerRecord;
  onSubmit: (form: FormData) => Promise<void>;
  onCancel?: () => void;
}) {
  return (
    <FormCard title={titleText}>
      <form
        key={initial?.id ?? "new-customer"}
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          await onSubmit(new FormData(form));
          form.reset();
        }}
      >
        <TextInput name="name" label="Name" required defaultValue={initial?.name} />
        <TextInput name="contactEmail" label="Kontakt E-Mail" defaultValue={initial?.contactEmail ?? undefined} />
        <TextInput name="contactPhone" label="Kontakt Telefon" defaultValue={initial?.contactPhone ?? undefined} />
        <SubmitButton />
        {onCancel && (
          <button type="button" className="text-xs text-stone-600 underline" onClick={onCancel}>
            Bearbeitung abbrechen
          </button>
        )}
      </form>
    </FormCard>
  );
}

function CreateLinkForm({
  tools,
  customers,
  onSubmit,
}: {
  tools: ToolRecord[];
  customers: CustomerRecord[];
  onSubmit: (form: FormData) => Promise<void>;
}) {
  return (
    <FormCard title="Tool mit Kunde verknüpfen">
      <form
        className="flex flex-col gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.currentTarget;
          await onSubmit(new FormData(form));
          form.reset();
        }}
      >
        <Select name="toolId" label="Tool" required>
          <option value="">Wählen</option>
          {tools.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </Select>
        <Select name="customerId" label="Kunde" required>
          <option value="">Wählen</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <SubmitButton />
      </form>
    </FormCard>
  );
}

function ItemList<T>({
  items,
  render,
  getKey,
}: {
  items: T[];
  render: (item: T) => React.ReactNode;
  getKey?: (item: T) => React.Key;
}) {
  return (
    <div className="grid gap-2">
      {items.map((item, idx) => {
        const key =
          getKey?.(item) ??
          (typeof item === "object" && item && "id" in (item as Record<string, unknown>)
            ? String((item as Record<string, unknown>).id)
            : idx);
        return <div key={key}>{render(item)}</div>;
      })}
    </div>
  );
}

function FormCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="text-sm font-semibold text-stone-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function SimpleCard({
  title,
  subtitle,
  meta,
  actions,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  actions?: React.ReactNode;
  onEdit?: () => void;
  onDelete: () => Promise<void>;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4">
      <div className="text-sm font-semibold text-stone-900">{title}</div>
      {subtitle && <div className="text-sm text-stone-700">{subtitle}</div>}
      {meta && <div className="text-xs text-stone-500">{meta}</div>}
      {actions && <div className="mt-2 flex flex-wrap gap-2 text-sm">{actions}</div>}
      <div className="mt-2 flex gap-2">
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
          >
            Bearbeiten
          </button>
        )}
        <button
          type="button"
          onClick={onDelete}
          className="rounded-full border border-stone-200 px-3 py-1 text-xs text-stone-800 transition hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-sm"
        >
          Löschen
        </button>
      </div>
    </div>
  );
}

function TextInput({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-stone-700">
      {label}
      <input
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function NumberInput({ name, label, defaultValue }: { name: string; label: string; defaultValue?: number }) {
  return (
    <label className="flex flex-col gap-1 text-sm text-stone-700">
      {label}
      <input
        type="number"
        name={name}
        defaultValue={defaultValue}
        className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function TextArea({
  name,
  label,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-stone-700">
      {label}
      <textarea
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
      />
    </label>
  );
}

function Select({
  name,
  label,
  children,
  required,
  defaultValue,
}: {
  name: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  defaultValue?: string | number;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm text-stone-700">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="rounded-2xl border border-stone-200 px-3 py-2 text-stone-900 outline-none transition focus:border-emerald-400"
      >
        {children}
      </select>
    </label>
  );
}

function SubmitButton() {
  return (
    <button
      type="submit"
      className="mt-2 w-fit rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_10px_25px_rgba(16,185,129,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(16,185,129,0.28)]"
    >
      Speichern
    </button>
  );
}
