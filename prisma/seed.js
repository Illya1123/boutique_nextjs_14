import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()
const prisma = new PrismaClient()

async function main() {
    // Hash password từ env
    const passwordAdmin = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10)
    const passwordCustomer = await bcrypt.hash(process.env.CUSTOMER_PASSWORD, 10)
    const passwordEmployee = await bcrypt.hash(process.env.EMPLOYEE_PASSWORD, 10)

    // Seed admin
    const admin = await prisma.account.upsert({
        where: { email: process.env.ADMIN_EMAIL },
        update: {},
        create: {
            name: 'Admin User',
            email: process.env.ADMIN_EMAIL,
            phone: '0123456789',
            role: 'admin',
            password: passwordAdmin,
            avatar: null,
        },
    })

    // Seed customer
    const customer = await prisma.account.upsert({
        where: { email: process.env.CUSTOMER_EMAIL },
        update: {},
        create: {
            name: 'Customer User',
            email: process.env.CUSTOMER_EMAIL,
            phone: '0987654321',
            role: 'customer',
            password: passwordCustomer,
            avatar: null,
        },
    })

    // Seed employee
    const employee = await prisma.account.upsert({
        where: { email: process.env.EMPLOYEE_EMAIL },
        update: {},
        create: {
            name: 'Employee User',
            email: process.env.EMPLOYEE_EMAIL,
            phone: '0111222333',
            role: 'employee',
            password: passwordEmployee,
            avatar: null,
        },
    })

    console.log({ admin, customer, employee })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
