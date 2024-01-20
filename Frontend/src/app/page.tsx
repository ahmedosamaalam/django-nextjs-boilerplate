export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Website page</h1>
      <button className="btn bg-slate-500 p-4">
        <a href="/dashboard"> dashboard</a>
      </button>
    </main>
  );
}
