import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: number;
  difference: number;
}

export const AnalyticsCard = ({
  title,
  value,
  difference,
}: AnalyticsCardProps) => {
  const Icon = difference > 0 ? FaCaretUp : FaCaretDown;

  return (
    <Card className="shadow-none border-none w-full">
      <CardHeader>
        <div className="flex items-center gap-x-2.5">
          <CardDescription className="flex items-center gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-base">{title}</span>
          </CardDescription>
          {difference !== 0 && (
            <div className="flex items-center gap-x-1">
              <Icon
                className={cn(
                  difference > 0 ? "text-emerald-500" : "text-red-500",
                  "size-4"
                )}
              />
              <span
                className={cn(
                  difference > 0 ? "text-emerald-500" : "text-red-500",
                  "truncate text-base font-medium"
                )}
              >
                {difference}
              </span>
            </div>
          )}
        </div>
        <CardTitle className="3xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
