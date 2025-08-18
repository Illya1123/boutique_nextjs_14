export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-100 text-center">
      <h2 className="text-3xl font-semibold mb-8">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        <div className="p-6 bg-white rounded-lg shadow">Feature 1</div>
        <div className="p-6 bg-white rounded-lg shadow">Feature 2</div>
        <div className="p-6 bg-white rounded-lg shadow">Feature 3</div>
      </div>
    </section>
  );
}
