const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'usuario',
    password: 'contraseña',
    database: 'tu_base_de_datos'
})
connection.connect()

app.post('/recuperar', (req, res) => {
    const correo = req.body.correo
  connection.query('SELECT * FROM usuarios WHERE email = ?', [correo], (err, results) => {
    if (results.length > 0) {
    
    } else {
        res.send('Correo no encontrado')
    }
    })
})