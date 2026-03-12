import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Todo } from '@/entities/Todo';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);

    const todo = await repo.findOneBy({ id });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    if (typeof body.completed === 'boolean') {
      todo.completed = body.completed;
    }
    if (typeof body.title === 'string' && body.title.trim() !== '') {
      todo.title = body.title.trim();
    }
    if (body.description !== undefined) {
      todo.description = body.description?.trim() || null;
    }

    const updated = await repo.save(todo);
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PATCH /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Todo);

    const todo = await repo.findOneBy({ id });
    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    await repo.remove(todo);
    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/todos/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete todo' },
      { status: 500 }
    );
  }
}
