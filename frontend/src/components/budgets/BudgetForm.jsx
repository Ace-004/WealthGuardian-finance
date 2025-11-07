import { useState } from "react";
import { categories } from "../../constants/categories";
import { formatCurrency } from "../../utils/formatCurrency";
import Button from "../common/Button";

export default function BudgetForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    category: initialData?.category || "",
    monthlyLimit: initialData?.monthlyLimit || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      monthlyLimit: parseFloat(formData.monthlyLimit),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg p-3
            focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
          required
        >
          <option value="">Select a category</option>
          {categories
            .filter((cat) => cat.type === "expense")
            .map((category) => (
              <option
                key={category.id}
                value={category.name}
                className="bg-slate-800"
              >
                {category.name}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Monthly Limit
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400">$</span>
          </div>
          <input
            type="number"
            value={formData.monthlyLimit}
            onChange={(e) =>
              setFormData({ ...formData, monthlyLimit: e.target.value })
            }
            className="w-full bg-slate-800/50 border border-slate-700 text-white pl-8 rounded-lg p-3
              focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            placeholder="0.00"
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {initialData ? "Update" : "Add"} Budget
        </Button>
      </div>
    </form>
  );
}
