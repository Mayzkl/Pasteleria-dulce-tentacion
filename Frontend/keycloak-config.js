import Keycloak from 'https://cdn.jsdelivr.net/npm/keycloak-js@26.2.1/+esm';
const USUARIO_KEY = "usuario_dulce_tentacion";

// Crear instancia de Keycloak
const keycloak = new Keycloak({
    url: "http://localhost:8080",        
    realm: "dulce-tentacion",            
    clientId: "pasteleria-frontend"      
});

window.keycloak = keycloak;

// Guardar usuario en localStorage a partir del token
function guardarUsuarioDesdeKeycloak() {
    const tokenParsed = keycloak.tokenParsed || {};
    const roles = tokenParsed.realm_access?.roles || [];

    const usuario = {
        userID : tokenParsed.sub, 
        nombre: tokenParsed.preferred_username || "Usuario",
        email: tokenParsed.email || "",
        roles: roles,
        rol: roles.includes("admin") ? "admin" : "cliente"
    };

    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

// Promesa global para que navbar.js pueda esperar
window.keycloakReady = keycloak
    .init({
        onLoad: "check-sso",    
        pkceMethod: "S256"
    })
    .then((authenticated) => {
        console.log("Keycloak autenticado:", authenticated);
        if (authenticated) {
            guardarUsuarioDesdeKeycloak();
        } else {
            localStorage.removeItem(USUARIO_KEY);
        }
    })
    .catch((err) => {
        console.error("Error inicializando Keycloak", err);
    });
