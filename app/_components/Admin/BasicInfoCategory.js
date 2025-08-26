'use client'
function BasicInfoCategory({ newCategory, setNewCategory }) {
    return ( 
        <div className="grid grid-cols-1 mb-4">
            <input
                type="text"
                placeholder="Name"
                className="border p-2 rounded w-full"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            />
        </div>
     );
}

export default BasicInfoCategory;