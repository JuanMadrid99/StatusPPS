import { comprobarUsuario } from '../models/authMod.js';

const login = async (req, res) => {
    try {
        const { nickname, psw } = req.body;
        const { usuario, admon, tipo } = await comprobarUsuario(nickname, psw);
        if (usuario) {
            console.log("Usuario autenticado");
        
            req.session.admin = admon;
            req.session.user = nickname;
            req.session.tipo = tipo.trim()

        
            req.session.save(err => {
                if (err) {
                    console.error('Error al guardar la sesión:', err);
                    res.status(500).redirect('/');
                    return;
                }
                if (req.session.admin) {
                    res.redirect('/pansucursal');
                } else {
                    res.redirect('/sucursales');
                }
            });
        } else {
        
            console.log("El usuario no existe o las credenciales son incorrectas");
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.redirect('/');
    }
};

const logout = async (req, res) => {
    console.log('Sessión Destruida');
    await req.session.destroy()
    res.redirect('/')
}

const user = async (req, res) => {
    const user = {
        username: req.session.user,
        isAdmin: req.session.admin,
        tipo: req.session.tipo,
        id: 0
    };
    if (req.session.admin == undefined) {
        return res.json(user);
    } else {
        if (req.session.admin == true) {
            if (req.session.tipo === 'Super Administrador') {
                user.id = 1
                return res.json(user);
            }
            else {
                user.id = 2
                return res.json(user);
            }
        } else {
            if (req.session.tipo === 'Aplicativo') {
                user.id = 3
                return res.json(user);
            }
            else {
                user.id = 4
                return res.json(user);
            }
        }
    };
}

export const methods = {
    login, logout, user
}