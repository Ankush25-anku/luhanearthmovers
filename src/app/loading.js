import Loader from "@/components/common/Loader";

/**
 * Next.js App Router's built-in route-transition loading UI — automatically
 * shown (inside an automatic Suspense boundary) while a route segment is
 * loading, and automatically removed the instant it's ready. No manual
 * mount/unmount logic needed here, unlike InitialLoader.
 */
export default function Loading() {
  return <Loader />;
}
