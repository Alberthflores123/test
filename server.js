const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(__dirname)); // Sirve archivos estáticos

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'silvestrefloresalberthmarcelo@gmail.com',
        pass: process.env.EMAIL_PASS || 'jowsomhsroxxfqom'
    }
});

// Ruta principal - REDIRIGE A LOGIN
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta para login.html
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Ruta para index.html
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para enviar correos
app.post('/send-email', async (req, res) => {
    try {
        const answers = req.body;
        
        // Construir el cuerpo del correo
        let emailBody = '<h1>📋 Resultados del Test del Amigo Falso</h1><br>';
        
        const questions = [
            "¿Cómo es mi nombre y apellido completo?",
            "¿Cuándo cumplo años?",
            "¿Cuántos años tengo?",
            "¿Cuál es mi color favorito?",
            "¿Cuál es mi anime favorito?",
            "¿Cuál es mi personaje de anime favorito?",
            "¿Cuál es mi género de anime favorito?",
            "¿Cuál es mi juego favorito?",
            "Del 1 al 10, ¿qué tan buen amigo soy?"
        ];
        
        // Agregar respuestas de texto
        questions.forEach((q, index) => {
            const answer = answers[index + 1] || 'No respondida';
            emailBody += `<p><strong>${q}</strong><br>${answer}</p><hr>`;
        });
        
        // Agregar imagen si existe
        if (answers[10]) {
            emailBody += `<p><strong>Imagen de depósito:</strong><br>`;
            emailBody += `<img src="${answers[10]}" style="max-width: 500px; border: 1px solid #ddd; border-radius: 8px;"></p>`;
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER || 'silvestrefloresalberthmarcelo@gmail.com',
            to: 'silvestrefloresalberthmarcelo@gmail.com',
            subject: '🎯 Test del Amigo Falso - Nuevas Respuestas',
            html: emailBody
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});