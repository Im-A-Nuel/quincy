import Link from "next/link";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="rounded-2xl bg-quincy-600 px-6 py-10 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to ship a task?</h2>
        <p className="mx-auto mt-2 max-w-md text-quincy-50">
          Open MiniPay, connect in one tap, and post your first escrow-backed
          bounty in under a minute.
        </p>
        <Link
          href="/create"
          className="btn mt-6 bg-white text-quincy-700 hover:bg-quincy-50"
        >
          Post a bounty
        </Link>
      </div>
    </section>
  );
}
