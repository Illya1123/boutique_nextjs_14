export default function ProductsSection() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-semibold text-center mb-8">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        <div className="p-6 border rounded-lg">Product 1</div>
        <div className="p-6 border rounded-lg">Product 2</div>
        <div className="p-6 border rounded-lg">Product 3</div>
        <div className="p-6 border rounded-lg">Product 4</div>
      </div>
    </section>
  );
}
