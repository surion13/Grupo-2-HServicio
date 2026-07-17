import axios from 'axios'

const BASE_URL = ""

const prefijoApi='/api/v1'

const ENDPOINTS = {
    AUTH:`${prefijoApi}/auth`,
    PROFILE:`${prefijoApi}/profile`,
    USERS:`${prefijoApi}/users`,
    CATEGORIES:`${prefijoApi}/categories`,
    COUNTRIES:`${prefijoApi}/countries`,
    COURSES:`${prefijoApi}/courses`,
    REPORTS:`${prefijoApi}/reports`,
    COMPASS:`${prefijoApi}/compass`,
    DASHBOARD:`${prefijoApi}/dashboard`,
    ENUMS:`${prefijoApi}/enums`,
    HEALTH:`${prefijoApi}/health`
}

// 1. Configuración de la instancia base de Axios
const funvalServices = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // 👈 CRUCIAL: Envía y recibe la cookie HTTPOnly, Requisito tecnico 1
    headers: {
        'Content-Type': 'application/json'
    }
})

// 2. Módulo de Autenticación (Auth)


// 3. Módulo de Perfil (Profile)
export const profileService = {
    getMe: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.PROFILE}/me`)
        return response.data
    },
    updateProfile: async (profileData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.PROFILE}/me`, profileData)
        return response.data
    },
    changePassword: async (passwordData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.PROFILE}/password`, passwordData)
        return response.data
    }
}

// 4. Módulo de Usuarios (Users)
export const userService = {
    list: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.USERS}/`)
        return response.data
    },
    create: async (userData) => {
        const response = await funvalServices.post(`${ENDPOINTS.USERS}/`, userData)
        return response.data
    },
    bulkCreate: async (csvFormData) => {
        const response = await funvalServices.post(`${ENDPOINTS.USERS}/bulk`, csvFormData, {
            headers: { 'Content-Type': 'multipart/form-data' } // Requerido para archivos CSV
        })
        return response.data
    },
    listInDebt: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.USERS}/in-debt`)
        return response.data
    },
    delete: async (userId) => {
        const response = await funvalServices.delete(`${ENDPOINTS.USERS}/${userId}`)
        return response.data
    }
}

// 5. Módulo de Categorías (Categories)
export const categoryService = {
    list: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.CATEGORIES}/`)
        return response.data
    },
    create: async (categoryData) => {
        const response = await funvalServices.post(`${ENDPOINTS.CATEGORIES}/`, categoryData)
        return response.data
    },
    update: async (categoryId, categoryData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.CATEGORIES}/${categoryId}`, categoryData)
        return response.data
    },
    delete: async (categoryId) => {
        const response = await funvalServices.delete(`${ENDPOINTS.CATEGORIES}/${categoryId}`)
        return response.data
    }
}

// 6. Módulo de Países (Countries)
export const countryService = {
    list: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COUNTRIES}/`)
        return response.data
    },
    create: async (countryData) => {
        const response = await funvalServices.post(`${ENDPOINTS.COUNTRIES}/`, countryData)
        return response.data
    },
    getById: async (countryId) => {
        const response = await funvalServices.get(`${ENDPOINTS.COUNTRIES}/${countryId}`)
        return response.data
    },
    update: async (countryId, countryData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.COUNTRIES}/${countryId}`, countryData)
        return response.data
    },
    delete: async (countryId) => {
        const response = await funvalServices.delete(`${ENDPOINTS.COUNTRIES}/${countryId}`)
        return response.data
    }
}

// 7. Módulo de Cursos (Courses)
export const courseService = {
    list: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COURSES}/`)
        return response.data
    },
    create: async (courseData) => {
        const response = await funvalServices.post(`${ENDPOINTS.COURSES}/`, courseData)
        return response.data
    },
    getById: async (courseId) => {
        const response = await funvalServices.get(`${ENDPOINTS.COURSES}/${courseId}`)
        return response.data
    },
    update: async (courseId, courseData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.COURSES}/${courseId}`, courseData)
        return response.data
    },
    delete: async (courseId) => {
        const response = await funvalServices.delete(`${ENDPOINTS.COURSES}/${courseId}`)
        return response.data
    }
}

// 8. Módulo de Reportes (Reports)
export const reportService = {
    submit: async (formData) => {
        const response = await funvalServices.post(`${ENDPOINTS.REPORTS}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
        return response.data
    },
    list: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.REPORTS}/`)
        return response.data
    },
    update: async (reportId, formData) => {
        const response = await funvalServices.patch(`${ENDPOINTS.REPORTS}/${reportId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        return response.data
    },
    uploadPdf: async (formData) => {
        const response = await funvalServices.post(`${ENDPOINTS.REPORTS}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Requerido para transferir archivos binary/multipart
            }
        });
        return response.data;
    },
    getEvidenceLink: async (reportId) => {
        const response = await funvalServices.get(`${ENDPOINTS.REPORTS}/${reportId}/evidence`)
        return response.data
    },
    streamEvidencePdf: async (reportId) => {
        const response = await funvalServices.get(`${ENDPOINTS.REPORTS}/${reportId}/evidence/stream`, {
            responseType: 'blob' // Requerido para manejar la descarga/stream de archivos binarios como PDF
        })
        return response.data
    },
    review: async (reportId, reviewPayload) => {
        const response = await funvalServices.patch(`${ENDPOINTS.REPORTS}/${reportId}/review`, reviewPayload)
        return response.data
    }
}

// 9. Módulo de Brújula (Compass)
export const compassService = {
    listCategories: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COMPASS}/categories`)
        return response.data
    },
    getProfile: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COMPASS}/profile`)
        return response.data
    },
    createProfile: async (profileData) => {
        const response = await funvalServices.post(`${ENDPOINTS.COMPASS}/profile`, profileData)
        return response.data
    },
    updateProfile: async (profileData) => {
        const response = await funvalServices.put(`${ENDPOINTS.COMPASS}/profile`, profileData)
        return response.data
    },
    listGoals: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COMPASS}/goals`)
        return response.data
    },
    createGoal: async (goalData) => {
        const response = await funvalServices.post(`${ENDPOINTS.COMPASS}/goals`, goalData)
        return response.data
    },
    updateGoal: async (goalId, goalData) => {
        const response = await funvalServices.put(`${ENDPOINTS.COMPASS}/goals/${goalId}`, goalData)
        return response.data
    },
    deleteGoal: async (goalId) => {
        const response = await funvalServices.delete(`${ENDPOINTS.COMPASS}/goals/${goalId}`)
        return response.data
    },
    exportPdf: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.COMPASS}/export`, {
            responseType: 'blob'
        })
        return response.data
    }
}

// 10. Módulo de Estadísticas (Dashboard)
export const dashboardService = {
    getStats: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.DASHBOARD}/stats`)
        return response.data
    }
}

// 11. Módulo de Enumeraciones (Enums)
export const enumService = {
    getRoles: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.ENUMS}/roles`)
        return response.data
    },
    getReportStatuses: async () => {
        const response = await funvalServices.get(`${ENDPOINTS.ENUMS}/report-statuses`)
        return response.data
    }
}

// 12. Módulo del Estado del Servidor (Health Check)
export const healthService = {
    check: async () => {
        const response = await funvalServices.get(ENDPOINTS.HEALTH)
        return response.data
    }
}