import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import fs from 'fs'

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Next.js API Docs',
            version: '1.0.0',
            description: 'Tài liệu API cho dự án Next.js 14',
        },
        servers: [
            {
                url: 'http://localhost:3000/api', // base url API
            },
        ],
    },
    apis: [path.join(process.cwd(), 'app/api/**/*.js')], // đường dẫn tới route API
}

const swaggerSpec = swaggerJsdoc(options)

swaggerSpec.tags = swaggerSpec.tags || []

for (const pathKey in swaggerSpec.paths) {
    const parts = pathKey.split('/').filter(Boolean)
    if (parts.length > 0) {
        const tag = parts[0] // lấy thư mục đầu tiên làm tag
        // thêm tag nếu chưa tồn tại
        if (!swaggerSpec.tags.find((t) => t.name === tag)) {
            swaggerSpec.tags.push({ name: tag, description: `API cho ${tag}` })
        }
        // gán tag cho tất cả method
        for (const method in swaggerSpec.paths[pathKey]) {
            swaggerSpec.paths[pathKey][method].tags = [tag]
        }
    }
}

// const outputPath = path.join(process.cwd(), "swagger.json")
// fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2), "utf-8")

// console.log(`Swagger spec đã được tạo tại: ${outputPath}`)

export default swaggerSpec
