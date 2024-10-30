import AdminGuard from "@/components/AdminGuard";
import PostsMasonryLayout from "@/components/MasonryGrid";

import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { Navbar } from "../../components/NavBar";
import { Toaster } from "sonner";

export default function Masonry() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-32">
        <PostsMasonryLayout />
      </div>
    </div>
  );
}

//hi
