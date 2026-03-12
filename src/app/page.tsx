import TodoList from '@/components/TodoList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">My Todo List</h1>
          <p className="text-slate-500">Stay organized and get things done</p>
        </div>
        <TodoList />
      </div>
    </main>
  );
}
