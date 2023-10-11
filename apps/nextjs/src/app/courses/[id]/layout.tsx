import type { Metadata } from "next";
import { fetchCourse } from "@/libs/fetch";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8">
      {props.children}
    </div>
  );
};

export default Layout;
