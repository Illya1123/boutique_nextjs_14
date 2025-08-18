'use server'

import { auth, signIn, signOut } from './auth'
import { getBookings } from './data-service'
import { pool } from './db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signInAction() {
    await signIn('google', { redirectTo: '/account' })
}

export async function signOutAction() {
    await signOut({ redirectTo: '/' })
}
