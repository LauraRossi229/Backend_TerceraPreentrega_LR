import { generateToken } from "../utils/jwt.js";

export const renderLoginView = async (req, res) => {
    res.render('login');
};
export const postLogin = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Usuario invalido" })
        }
        // Obtén los datos del usuario autenticado
        const { first_name, last_name, email } = req.user;
        // Recupera el cartID asociado al usuario desde la base de datos
        const cartID = req.user.cart;
        console.log('cart:', cartID)
    /*
        Si siguen con sesiones en BDD, esto no se bora. Si usan JWT si
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
            res.status(200).send({mensaje: "Usuario logueado"})
        }*/
      
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000 //12hs en ms
        })
       // res.status(200).send({ payload: req.user })
        // Renderiza la vista de login
        res.redirect(`/api/products?first_name=${first_name}&last_name=${last_name}&email=${email}`);
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
};

export const postRegister = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(400).send({ mensaje: "Usuario ya existente" })
        }
    
        res.status(200).send({ mensaje: 'Usuario registrado' })
       // res.render('register');
    } catch (error) {
        res.status(500).send({ mensaje: `Error al registrar usuario ${error}` })
    }
};

export const logout = async (req, res) => {
    if (req.session.login) {
        req.session.destroy()
    }
    res.clearCookie('jwtCookie')
    //res.status(200).send({ resultado: 'Usuario deslogueado' })
    res.redirect('/api/sessions/login?mensaje=Usuario%20deslogueado');
}

export const getTestJWT = async (req, res) => {
    console.log(req)
    res.send(req.user)
};

export const getCurrent = async (req, res) => {
    res.send(req.user)
};

export const getGithubCallback = async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Usuario logueado' })
}

export const getGithub = async (req, res) => {

}