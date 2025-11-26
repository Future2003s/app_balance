import type { Metadata } from "next";
import SmartScheduleUltimate from "@/components/pages/SmartScheduleUltimate";

export const metadata: Metadata = {
  title: "Master Schedule: Height & Face Aesthetics",
};

export default function MasterSchedulePage() {
  return <SmartScheduleUltimate />;
}
