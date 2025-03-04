import { redirectToLoginIfNoUser } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

const Page = async () => {
  await redirectToLoginIfNoUser();

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default Page;
