import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryService } from "../../services/funvalApi";
import useApi from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import ConfirmModal from "../../components/common/ConfirmModal";
import Spinner from "../../components/common/Spinners";



function getCategoryIcon(name = "") {
  const value = name.toLowerCase();
  if (value.includes("educ") || value.includes("tutor") || value.includes("acad")) return "school";
  if (value.includes("ambient") || value.includes("eco") || value.includes("recicl")) return "eco";
  if (value.includes("social") || value.includes("comunit") || value.includes("asistenc")) return "volunteer_activism";
  if (value.includes("deport")) return "sports_soccer";
  if (value.includes("salud") || value.includes("medic")) return "medical_services";
  if (value.includes("cultur") || value.includes("arte")) return "palette";
  return "category";
}

export default function Categories() {
  const { showToast } = useToast();

  // Criterio: Listado
  const {
    data: categories,
    loading: loadingList,
    execute: fetchCategories,
  } = useApi(categoryService.list);

  // Criterio: Crear, Update, Delete
  const { loading: loadingCreate, execute: createCategory } = useApi(
    categoryService.create,
  );
  const { loading: loadingUpdate, execute: updateCategory } = useApi(
    categoryService.update,
  );
  const { loading: loadingDelete, execute: deleteCategory } = useApi(
    categoryService.delete,
  );

  const [formData, setFormData] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Criterio: Listado
  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  // Maneja tanto Crear como Editar
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        showToast("Categoría actualizada", "success");
      } else {
        await createCategory(formData);
        showToast("Categoría creada", "success");
      }
      resetForm();
      fetchCategories();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "No se pudo guardar la categoría",
        "error",
      );
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setShowForm(true);
  };

  // Criterio: Eliminar
  const handleDeleteConfirm = async () => {
    try {
      await deleteCategory(categoryToDelete.id);
      showToast("Categoría eliminada", "success");
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      showToast(
        err.response?.data?.detail || "No se pudo eliminar la categoría",
        "error",
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background p-stack-lg">
      <Link
        to="/dashboard-admin"
        className="inline-flex items-center gap-stack-sm text-primary text-label-md hover:underline mb-stack-md"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver al Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-stack-sm mb-stack-lg">
        <div>
          <h1 className="text-headline-lg text-on-surface">
            Categorías de Servicio
          </h1>
          <p className="text-body-sm text-on-surface-variant">
            Gestiona los tipos de actividades disponibles para los estudiantes.
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center justify-center gap-stack-sm px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Crear Categoría
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-stack-sm mb-stack-lg bg-surface border border-outline-variant rounded-lg p-stack-md"
        >
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nombre de la categoría"
            required
            className="p-stack-sm text-body-md bg-surface-low text-on-surface border border-outline rounded-lg outline-none focus:border-primary"
          />
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Descripción"
            className="p-stack-sm text-body-md bg-surface-low text-on-surface border border-outline rounded-lg outline-none focus:border-primary"
          />
          <div className="flex gap-stack-sm">
            <button
              type="submit"
              disabled={loadingCreate || loadingUpdate}
              className="px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg text-label-md cursor-pointer disabled:opacity-50"
            >
              {editingId ? "Guardar cambios" : "Crear"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-stack-md py-stack-sm border border-outline rounded-lg text-label-md cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loadingList ? (
        <Spinner fullScreen={false} />
      ) : (
        <div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-label-sm uppercase">
                <tr>
                  <th className="px-stack-md py-stack-sm">Nombre</th>
                  <th className="px-stack-md py-stack-sm">Descripción</th>
                  <th className="px-stack-md py-stack-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {(categories || []).map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-surface-container-low"
                  >
                    <td className="px-stack-md py-stack-sm text-body-sm font-semibold">
                      <div className="flex items-center gap-stack-sm">
                        <span className="material-symbols-outlined text-primary">
                          {getCategoryIcon(category.name)}
                        </span>
                        {category.name}
                      </div>
                    </td>
                    <td className="px-stack-md py-stack-sm text-body-sm text-on-surface-variant">
                      {category.description}
                    </td>
                    <td className="px-stack-md py-stack-sm text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(category)}
                        className="text-primary p-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(category)}
                        className="text-error p-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
                {categories?.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-stack-md py-stack-lg text-center text-on-surface-variant text-body-sm"
                    >
                      No hay categorías registradas todavía
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="¿Eliminar categoría?"
        message={`Esta acción eliminará "${categoryToDelete?.name}". No se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCategoryToDelete(null)}
        isLoading={loadingDelete}
      />
    </div>
  );
}