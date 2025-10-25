"use client"

export async function createUser(userData: any) {
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to create user:', error);
    return { success: false, error: 'Failed to create user' };
  }
}

export async function getUsers(filters?: { organization_id?: number; department_id?: number; search?: string }) {
  try {
    const params = new URLSearchParams();
    if (filters?.organization_id) params.append('organization_id', filters.organization_id.toString());
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await fetch(`/api/users?${params.toString()}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to get users:', error);
    return { success: false, error: 'Failed to get users', data: [] };
  }
}

export async function updateUser(id: number, userData: any) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to update user:', error);
    return { success: false, error: 'Failed to update user' };
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to delete user:', error);
    return { success: false, error: 'Failed to delete user' };
  }
}

export async function getUserAsOwner(searchTerm: string) {
  try {
    const response = await fetch(`/api/users?search=${encodeURIComponent(searchTerm)}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to search owners:', error);
    return { success: false, error: 'Failed to search owners', data: [] };
  }
}