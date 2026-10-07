export const INIT_PERMISSIONS = [
    {
        name: 'Create a new Permission',
        apiPath: '/api/v1/permissions',
        method: 'POST',
        module: 'PERMISSIONS',
    },
    {
        name: 'Fetch permissions with paginate',
        apiPath: '/api/v1/permissions',
        method: 'GET',
        module: 'PERMISSIONS',
    },
    {
        name: 'Fetch a permission by id',
        apiPath: '/api/v1/permissions/:id',
        method: 'GET',
        module: 'PERMISSIONS',
    },
    {
        name: 'Update a permission',
        apiPath: '/api/v1/permissions/:id',
        method: 'PATCH',
        module: 'PERMISSIONS',
    },
    {
        name: 'Delete a permission',
        apiPath: '/api/v1/permissions/:id',
        method: 'DELETE',
        module: 'PERMISSIONS',
    }
];

export const INIT_ROLES = [
    {
        name: 'ADMIN',
        description: 'Admin role',
        isActive: true,
    },
    {
        name: 'USER',
        description: 'User role',
        isActive: true,
    }
];

export const INIT_USERS = [
    {
        name: 'I am Admin',
        email: 'admin@gmail.com',
        age: 30,
        gender: 'MALE',
        address: 'Vietnam',
        role: 'ADMIN',
    },
    {
        name: 'I am User',
        email: 'user@gmail.com',
        age: 20,
        gender: 'MALE',
        address: 'Vietnam',
        role: 'USER',
    }
];
