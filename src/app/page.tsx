import { Button } from "@/components/ui/button";
import { TestComponent } from "@/features/test";

export default function Home() {
  return (
    <div>
      <Button variant="test" size="lg">
        Click me
      </Button>
      <p className="text-red-500 font-semibold">Alex</p>
      <TestComponent />
    </div>
  );
}
