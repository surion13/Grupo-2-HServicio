import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

// Rafa: Importación limpia del hook independiente de notificaciones Toast
import { useToast } from "../../hooks/useToast";

export default function Login() {
    const navigate = useNavigate();
    
    // Rafa: Consumo del hook global de notificaciones
    const { showToast } = useToast();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Rafa: Estado controlado para alternar la visibilidad de la contraseña de forma reactiva
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const { loading, error, login } = useContext(AuthContext);
    
    //Agregando logica try catch para que las Toast notifications funcionen dinamicamente
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            await login(email, password);
            // Si el login es exitoso, disparamos un Toast de éxito (verde)
            showToast("¡Inicio de sesión exitoso! Bienvenido.", "success");
            
            // Redirección tras inicio de sesión exitoso
            navigate("/redirect");
        } catch (error) {
            // Extraemos el mensaje real que viene desde funvalApi ("Invalid email or password")
            const apiMessage = error.response?.data?.detail || "Credenciales incorrectas";
            
            // CRÍTICO: Pasamos explícitamente el tipo "error" para que se pinte de color rojo
            showToast(apiMessage, "error");
        }
    }

    // Rafa: Función para autocompletar credenciales de prueba
    const selectTestCredentials = (testEmail, testPassword) => {
        setEmail(testEmail);
        setPassword(testPassword);
        showToast("Credenciales de prueba cargadas", "success");
    };

    // Rafa: modificando visibilidad de password para que se actualice:
    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    return (
        <article className="font-sans min-h-screen flex flex-col bg-background text-on-background">
            {/* <!-- Top Navigation Bar --> */}
            <header className="fixed top-0 w-full z-50 bg-surface flex items-center justify-between px-margin-mobile md:px-margin-desktop h-16">
                <div className="flex items-center gap-stack-sm">
                    <span className="material-symbols-outlined material-filled text-primary">shield</span>
                    <span className="font-headline-lg text-headline-lg font-bold text-primary">Acceso Seguro</span>
                </div>
            </header>

            <main className="grow flex items-center justify-center pt-24 pb-12 px-margin-mobile">
            
                {/* <!-- Login Card Container --> */}
                <div className="w-full max-w-110 bg-surface-low p-stack-lg md:p-10 rounded-lg login-card border border-outline-variant">
                    
                    {/* <!-- Header Section --> */}
                    <div className="text-center mb-stack-lg">
                        <h1 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface mb-stack-sm">Bienvenido</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">Accede a tu cuenta</p>
                    </div>
                    
                    {/* <!-- Form Section --> */}
                    <form onSubmit={handleSubmit} className="space-y-stack-lg">
                        {error ? <p className="rounded-lg py-2 bg-red-200 font-bold text-red-600 text-center">{error}</p> : ""}
                        {/* <!-- Email Field --> */}
                        <div className="space-y-stack-sm">
                            <label className="font-label-md text-label-md text-on-surface">Correo Electrónico</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <input value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-outline rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md outline-none" id="email" name="email" placeholder="nombre@empresa.com" required="" type="email"/>
                            </div>
                        </div>

                        {/* <!-- Password Field --> */}
                        <div className="space-y-stack-sm">
                            <div className="flex justify-between items-center">
                                <label className="font-label-md text-label-md text-on-surface">Contraseña</label>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                                    <span className="material-symbols-outlined text-[20px]">lock</span>
                                </div>

                                <input value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 pr-12 py-3 border border-outline rounded-lg bg-surface focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-body-md outline-none" id="password" name="password" placeholder="••••••••" required="" type={isPasswordVisible ? "text" : "password"}/>
                                
                                <button onClick={togglePasswordVisibility} className="cursor-pointer absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-primary transition-colors" type="button">
                                    <span className="material-symbols-outlined text-[20px]" id="password-toggle-icon">{isPasswordVisible ? "visibility_off" :"visibility"}</span>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Remember and Forgot --> */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer">
                                <input className="w-4 h-4 rounded border-outline text-primary focus:ring-primary" type="checkbox"/>
                                <span className="ml-2 font-label-md text-label-md text-on-surface-variant">Recordarme</span>
                            </label>
                            <a className="font-label-md text-label-md text-primary hover:underline transition-colors" href="#">¿Olvidaste tu contraseña?</a>
                        </div>

                        {/* <!-- Submit Button --> */}
                        <button className="cursor-pointer w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md hover:bg-opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2" type="submit">
                            {loading ? <span className="text-base">Espere estamos cargando</span>
                            :   <>
                                    <span>Entrar</span>
                                    <span className="material-symbols-outlined text-[18px]">login</span>
                                </>
                            }
                        </button>

                        {/* SECCIÓN DE CREDENCIALES DE PRUEBA */}
                        <div className="mt-4 p-4 bg-surface-container-low rounded-lg border border-outline-variant space-y-2">
                            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] text-primary">build</span>
                                Acceso de prueba rápido
                            </p>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => selectTestCredentials("admin@funval.com", "1234567890")}
                                    className="flex-1 py-1.5 px-3 text-xs font-medium bg-primary-container text-on-primary-container rounded-md hover:opacity-90 transition-opacity cursor-pointer border border-primary/20"
                                >
                                    🔑 Mod: Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => selectTestCredentials("jordan.travieso@funval.com", "PasswordSecure123!")}
                                    className="flex-1 py-1.5 px-3 text-xs font-medium bg-secondary-container text-on-secondary-container rounded-md hover:opacity-90 transition-opacity cursor-pointer border border-secondary/20"
                                >
                                    🎓 Mod: Estudiante
                                </button>
                            </div>
                        </div>

                        {/* <!-- Create Account Link --> */}
                        <div className="text-center mt-stack-lg pt-stack-md border-t border-surface-variant">
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                ¿No tienes una cuenta? 
                                <Link className="text-primary font-semibold hover:underline" href="#"> Crear cuenta</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </main>

            {/* <!-- Footer Section --> */}
            <footer className="w-full py-stack-lg bg-surface border-t border-surface-highest">
                <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop gap-stack-md">
                    <div className="font-label-md text-label-md font-semibold text-on-surface">
                        Enterprise Secure
                    </div>
                    <div className="font-label-sm text-label-sm text-secondary flex gap-stack-lg">
                        <Link className="hover:text-primary transition-colors" to="#">Privacidad</Link>
                        <Link className="hover:text-primary transition-colors" to="#">Términos</Link>
                        <Link className="hover:text-primary transition-colors" to="#">Soporte</Link>
                    </div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">
                        © 2024 Enterprise Secure. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        </article>
    );
}