import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Button variant={"brand-primary"}>
        <Link href={"/"}>Go to Home</Link>
      </Button>
    </div>
  );
}
