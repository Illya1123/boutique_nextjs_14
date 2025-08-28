'use client'

import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

export default function ApiDocs() {
    return (
        <div className="w-full h-screen">
            <SwaggerUI url="/api/admin/docs" />
        </div>
    )
}
