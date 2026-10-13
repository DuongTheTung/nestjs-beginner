import mongoose from 'mongoose';

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
    },
    {
        name: 'Fetch companies with paginate',
        apiPath: '/api/v1/companies',
        method: 'GET',
        module: 'COMPANIES',
    },
    {
        name: 'Fetch users with paginate',
        apiPath: '/api/v1/users',
        method: 'GET',
        module: 'USERS',
    },
    {
        name: 'Fetch jobs with paginate',
        apiPath: '/api/v1/jobs',
        method: 'GET',
        module: 'JOBS',
    },
    {
        name: 'Fetch resumes with paginate',
        apiPath: '/api/v1/resumes',
        method: 'GET',
        module: 'RESUMES',
    },
    {
        name: 'Fetch roles with paginate',
        apiPath: '/api/v1/roles',
        method: 'GET',
        module: 'ROLES',
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

export const INIT_COMPANIES = [
    {
        name: 'FPT Software',
        address: 'FPT Tower, Pham Van Bach, Cau Giay, Hanoi',
        description: 'The leading IT service provider in Vietnam.',
    },
    {
        name: 'VNG Corporation',
        address: 'Z06 Street 13, Tan Thuan Dong Ward, District 7, HCMC',
        description: 'Leading technology and internet company in Vietnam.',
    }
];

export const INIT_JOBS = [
    {
        name: 'Frontend Developer (ReactJS)',
        skills: ['React', 'TypeScript', 'Redux'],
        location: 'HANOI',
        salary: 1500,
        quantity: 5,
        level: 'MIDDLE',
        description: 'Looking for a skilled React Developer to join our team.',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true,
        company: {
            _id: new mongoose.Types.ObjectId(),
            name: 'FPT Software',
            logo: 'fpt.png'
        }
    },
    {
        name: 'Backend Developer (NestJS)',
        skills: ['NestJS', 'Node.js', 'MongoDB'],
        location: 'HOCHIMINH',
        salary: 2000,
        quantity: 3,
        level: 'SENIOR',
        description: 'Join us to build scalable backend systems.',
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        isActive: true,
        company: {
            _id: new mongoose.Types.ObjectId(),
            name: 'VNG Corporation',
            logo: 'vng.png'
        }
    }
];

export const INIT_RESUMES = [
    {
        email: 'user@gmail.com',
        url: 'https://example.com/cv.pdf',
        status: 'PENDING',
    }
];

export const INIT_SUBSCRIBERS = [
    {
        email: 'user@gmail.com',
        name: 'I am User',
        skills: ['React', 'NestJS'],
    }
];
