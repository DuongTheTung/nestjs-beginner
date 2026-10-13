import mongoose from 'mongoose';

export const INIT_PERMISSIONS = [
  {
    "name": "Create a new user",
    "apiPath": "/api/v1/users",
    "method": "POST",
    "module": "USERS"
  },
  {
    "name": "fetch user with paginate",
    "apiPath": "/api/v1/users",
    "method": "GET",
    "module": "USERS"
  },
  {
    "name": "fetch user by id",
    "apiPath": "/api/v1/users/:id",
    "method": "GET",
    "module": "USERS"
  },
  {
    "name": "Update a user",
    "apiPath": "/api/v1/users/:id",
    "method": "PATCH",
    "module": "USERS"
  },
  {
    "name": "Delete a user",
    "apiPath": "/api/v1/users/:id",
    "method": "DELETE",
    "module": "USERS"
  },
  {
    "name": "Create a new subscriber",
    "apiPath": "/api/v1/subscribers",
    "method": "POST",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Get subscriber skills",
    "apiPath": "/api/v1/subscribers/skills",
    "method": "POST",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Fetch subscribers with paginate",
    "apiPath": "/api/v1/subscribers",
    "method": "GET",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Fetch a subscriber by id",
    "apiPath": "/api/v1/subscribers/:id",
    "method": "GET",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Update a subscriber",
    "apiPath": "/api/v1/subscribers",
    "method": "PATCH",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Delete a subscriber",
    "apiPath": "/api/v1/subscribers/:id",
    "method": "DELETE",
    "module": "SUBSCRIBERS"
  },
  {
    "name": "Create a new role",
    "apiPath": "/api/v1/roles",
    "method": "POST",
    "module": "ROLES"
  },
  {
    "name": "Fetch roles with paginate",
    "apiPath": "/api/v1/roles",
    "method": "GET",
    "module": "ROLES"
  },
  {
    "name": "Fetch a role by id",
    "apiPath": "/api/v1/roles/:id",
    "method": "GET",
    "module": "ROLES"
  },
  {
    "name": "Update a role",
    "apiPath": "/api/v1/roles/:id",
    "method": "PATCH",
    "module": "ROLES"
  },
  {
    "name": "Delete a role",
    "apiPath": "/api/v1/roles/:id",
    "method": "DELETE",
    "module": "ROLES"
  },
  {
    "name": "Create a new resume",
    "apiPath": "/api/v1/resumes",
    "method": "POST",
    "module": "RESUMES"
  },
  {
    "name": "Get Resumes by User",
    "apiPath": "/api/v1/resumes/by-user",
    "method": "POST",
    "module": "RESUMES"
  },
  {
    "name": "Fetch all resumes with paginate",
    "apiPath": "/api/v1/resumes",
    "method": "GET",
    "module": "RESUMES"
  },
  {
    "name": "Fetch a resume by id",
    "apiPath": "/api/v1/resumes/:id",
    "method": "GET",
    "module": "RESUMES"
  },
  {
    "name": "Update status resume",
    "apiPath": "/api/v1/resumes/:id",
    "method": "PATCH",
    "module": "RESUMES"
  },
  {
    "name": "Delete a resume by id",
    "apiPath": "/api/v1/resumes/:id",
    "method": "DELETE",
    "module": "RESUMES"
  },
  {
    "name": "Create a new permission",
    "apiPath": "/api/v1/permissions",
    "method": "POST",
    "module": "PERMISSIONS"
  },
  {
    "name": "Fetch permissions with paginate",
    "apiPath": "/api/v1/permissions",
    "method": "GET",
    "module": "PERMISSIONS"
  },
  {
    "name": "Fetch a permission by id",
    "apiPath": "/api/v1/permissions/:id",
    "method": "GET",
    "module": "PERMISSIONS"
  },
  {
    "name": "Update a permission",
    "apiPath": "/api/v1/permissions/:id",
    "method": "PATCH",
    "module": "PERMISSIONS"
  },
  {
    "name": "Delete a permission",
    "apiPath": "/api/v1/permissions/:id",
    "method": "DELETE",
    "module": "PERMISSIONS"
  },
  {
    "name": "Create a new job",
    "apiPath": "/api/v1/jobs",
    "method": "POST",
    "module": "JOBS"
  },
  {
    "name": "Fetch jobs with pagination",
    "apiPath": "/api/v1/jobs",
    "method": "GET",
    "module": "JOBS"
  },
  {
    "name": "Fetch a job by id",
    "apiPath": "/api/v1/jobs/:id",
    "method": "GET",
    "module": "JOBS"
  },
  {
    "name": "Update a job",
    "apiPath": "/api/v1/jobs/:id",
    "method": "PATCH",
    "module": "JOBS"
  },
  {
    "name": "Delete a job",
    "apiPath": "/api/v1/jobs/:id",
    "method": "DELETE",
    "module": "JOBS"
  },
  {
    "name": "Test email",
    "apiPath": "/api/v1/mail",
    "method": "GET",
    "module": "MAIL"
  },
  {
    "name": "Upload Single File",
    "apiPath": "/api/v1/files/upload",
    "method": "POST",
    "module": "FILES"
  },
  {
    "name": "Đăng nhập thành công",
    "apiPath": "/api/v1/auth/login",
    "method": "POST",
    "module": "AUTH"
  },
  {
    "name": "Register a new user",
    "apiPath": "/api/v1/auth/register",
    "method": "POST",
    "module": "AUTH"
  },
  {
    "name": "Get user information",
    "apiPath": "/api/v1/auth/account",
    "method": "GET",
    "module": "AUTH"
  },
  {
    "name": "Get user refresh token",
    "apiPath": "/api/v1/auth/refresh",
    "method": "GET",
    "module": "AUTH"
  },
  {
    "name": "Logout user",
    "apiPath": "/api/v1/auth/logout",
    "method": "POST",
    "module": "AUTH"
  },
  {
    "name": "Create a new company",
    "apiPath": "/api/v1/companies",
    "method": "POST",
    "module": "COMPANIES"
  },
  {
    "name": "Fetch list company with paginate",
    "apiPath": "/api/v1/companies",
    "method": "GET",
    "module": "COMPANIES"
  },
  {
    "name": "Fetch a company by id",
    "apiPath": "/api/v1/companies/:id",
    "method": "GET",
    "module": "COMPANIES"
  },
  {
    "name": "Update a company",
    "apiPath": "/api/v1/companies/:id",
    "method": "PATCH",
    "module": "COMPANIES"
  },
  {
    "name": "Delete a company",
    "apiPath": "/api/v1/companies/:id",
    "method": "DELETE",
    "module": "COMPANIES"
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
