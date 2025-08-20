export default function NotAdminPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Bạn không phải admin</h1>
      <p>Bạn sẽ được chuyển hướng về trang chính.</p>
      <a href="/" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Quay về trang chủ
      </a>
    </div>
  )
}
