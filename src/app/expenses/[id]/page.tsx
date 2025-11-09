import { EditExpensePageClient } from "@/components/pages/EditExpensePageClient";

interface EditExpensePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
  const { id } = await params;
  return <EditExpensePageClient id={id} />;
}

