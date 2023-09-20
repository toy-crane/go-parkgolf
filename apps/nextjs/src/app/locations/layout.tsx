export const runtime = "edge";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <main className="container mx-auto contents h-full w-full px-4 sm:px-6 lg:px-8">
      {props.children}
    </main>
  );
}
