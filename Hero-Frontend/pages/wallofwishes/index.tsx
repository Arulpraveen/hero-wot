import AdminGuard from "@/components/AdminGuard";
import PostsMasonryLayout from "@/components/MasonryGrid";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Navbar } from "../../components/NavBar";
import { Toaster } from "sonner";

export default function Masonry() {
  // Function to disable right-click context menu
  const disableRightClick = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="min-h-screen select-none" // Prevent text selection with Tailwind
      onContextMenu={disableRightClick} // Disable right-click
    >
      <Navbar />
      <div className="pt-32">
        <PostsMasonryLayout />
      </div>
    </div>
  );
}
