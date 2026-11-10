import { sqlDb } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, name = '', nameAr = '', role = 'resident') {
  try {
    const result = await sqlDb
      .insert(users)
      .values({
        uid,
        email,
        name,
        nameAr,
        role,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(name ? { name } : {}),
          ...(nameAr ? { nameAr } : {}),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getUsers() {
  try {
    return await sqlDb.select().from(users);
  } catch (error) {
    console.error('Database query failed:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}
