'use server'

import { createClient } from '../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/inbox')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function getTasks() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return []
  }

  return tasks ?? []
}

export async function addTask(formData: FormData) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const dueDate = formData.get('dueDate') as string
  const priority = parseInt(formData.get('priority') as string) || 4
  const projectId = formData.get('projectId') as string

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    description: description || null,
    due_date: dueDate || null,
    priority,
    project_id: projectId || null,
    completed: false,
  } as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/inbox')
  revalidatePath('/today')
  revalidatePath('/upcoming')
  return { success: true }
}

export async function updateTaskStatus(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  const completed = formData.get('completed') === 'true'

  const { error } = await supabase
    .from('tasks')
    .update({ completed } as any)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/inbox')
  revalidatePath('/today')
  revalidatePath('/upcoming')
  return { success: true }
}

export async function deleteTask(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/inbox')
  revalidatePath('/today')
  revalidatePath('/upcoming')
  return { success: true }
}