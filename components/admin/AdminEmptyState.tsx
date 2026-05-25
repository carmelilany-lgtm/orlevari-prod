type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function AdminEmptyState({ title, description, action }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-blue-900/40 bg-blue-950/20 px-6 py-12 text-center">
      <p className="text-base font-medium text-slate-300">{title}</p>
      {description && (
        <p className="mt-2 text-sm text-slate-500">{description}</p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}
