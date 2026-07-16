import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { courseService } from "../../services/funvalApi";
import useApi from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import ConfirmModal from "../../components/common/ConfirmModal";
import Spinner from "../../components/common/Spinners";

export default function Courses() {
  const { showToast } = useToast();

  const {
    data: courses,
    loading: loadingList,
    execute: fetchCourses,
  } = useApi(courseService.list);

  const { loading: loadingCreate, execute: createCourse } = useApi(courseService.create);
  const { loading: loadingUpdate, execute: updateCourse } = useApi(courseService.update);
  const { loading: loadingDelete, execute: deleteCourse } = useApi(courseService.delete);

  const [formData, setFormData] = useState({ name: "", duration: "", price: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", duration: "", price: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateCourse(editingId, formData);
        showToast("Curso actualizado", "success");
      } else {
        await createCourse(formData);
        showToast("Curso creado", "success");
      }
      resetForm();
      fetchCourses();
    } catch (err) {
      showToast(err.response?.data?.detail || "No se pudo guardar el curso", "error");
    }
  };

  const handleEdit = (course) => {
    setEditingId(course.id);
    setFormData({
      name: course.name,
      duration: course.duration,
      price: course.price,
    });
    setShowForm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCourse(courseToDelete.id);
      showToast("Curso eliminado", "success");
      setCourseToDelete(null);
      fetchCourses();
    } catch (err) {
      showToast(err.response?.data?.detail || "No se pudo eliminar el curso", "error");
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
          <h1 className="text-headline-lg text-on-surface">Cursos</h1>
          <p className="text-body-sm text-on-surface-variant">
            Gestiona los cursos disponibles para los estudiantes.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center justify-center gap-stack-sm px-stack-md py-stack-sm bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Crear Curso
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
            placeholder="Nombre del curso"
            required
            className="p-stack-sm text-body-md bg-surface-low text-on-surface border border-outline rounded-lg outline-none focus:border-primary"
          />
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="Duración (ej: 8 semanas)"
            required
            className="p-stack-sm text-body-md bg-surface-low text-on-surface border border-outline rounded-lg outline-none focus:border-primary"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Precio"
            required
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
                  <th className="px-stack-md py-stack-sm">Duración</th>
                  <th className="px-stack-md py-stack-sm">Precio</th>
                  <th className="px-stack-md py-stack-sm text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {(courses || []).map((course) => (
                  <tr key={course.id} className="hover:bg-surface-container-low">
                    <td className="px-stack-md py-stack-sm text-body-sm font-semibold">
                      <div className="flex items-center gap-stack-sm">
                        <span className="material-symbols-outlined text-primary">school</span>
                        {course.name}
                      </div>
                    </td>
                    <td className="px-stack-md py-stack-sm text-body-sm text-on-surface-variant">
                      {course.duration}
                    </td>
                    <td className="px-stack-md py-stack-sm text-body-sm text-on-surface-variant">
                      {course.price}
                    </td>
                    <td className="px-stack-md py-stack-sm text-right whitespace-nowrap">
                      <button onClick={() => handleEdit(course)} className="text-primary p-1 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </button>
                      <button onClick={() => setCourseToDelete(course)} className="text-error p-1 cursor-pointer">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
                {courses?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-stack-md py-stack-lg text-center text-on-surface-variant text-body-sm">
                      No hay cursos registrados todavía
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!courseToDelete}
        title="¿Eliminar curso?"
        message={`Esta acción eliminará "${courseToDelete?.name}". No se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCourseToDelete(null)}
        isLoading={loadingDelete}
      />
    </div>
  );
}