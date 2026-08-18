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
app.use(express.static(__dirname));

// Configuración del transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'silvestrefloresalberthmarcelo@gmail.com',
        pass: process.env.EMAIL_PASS || 'jowsomhsroxxfqom'
    }
});

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para enviar correos
app.post('/send-email', async (req, res) => {
    try {
        const data = req.body;
        const answers = data;
        const score = data.score || { correct: 0, total: 10, percentage: 0 };
        
        // Construir el cuerpo del correo
        let emailBody = `
            <h1>📋 Resultados del Test del Amigo Falso</h1>
            <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                <h2 style="font-size: 3em; margin: 0; color: ${score.percentage >= 70 ? '#28a745' : '#dc3545'}">${score.percentage}%</h2>
                <p style="font-size: 1.2em;">Acertaste ${score.correct} de ${score.total} preguntas</p>
                <p style="font-weight: bold; color: ${score.percentage >= 70 ? '#28a745' : '#dc3545'}">
                    ${score.percentage >= 70 ? '🎉 ¡Eres un gran amigo!' : '😅 ¡Necesitas conocerme mejor!'}
                </p>
            </div>
            <hr>
            <h3>📝 Respuestas detalladas:</h3>
            <br>
        `;
        
        const questions = [
            "¿Cómo es mi nombre y apellido completo?",
            "¿Cuándo cumplo años?",
            "¿Cuántos años tengo?",
            "¿Cuál es mi color favorito?",
            "¿Cuál es mi anime favorito?",
            "¿Cuál es mi personaje de anime favorito?",
            "¿Cuál es mi género de anime favorito?",
            "¿Cuál es mi juego favorito?",
            "Del 1 al 10, ¿qué tan buen amigo soy?",
            "¿Qué tipo de mujeres me gustan?"
        ];
        
        // Agregar respuestas de texto
        questions.forEach((q, index) => {
            const answer = answers[index + 1] || 'No respondida';
            const isCorrect = checkAnswer(index + 1, answer);
            emailBody += `
                <p>
                    <strong>${q}</strong><br>
                    ${answer}
                    ${isCorrect ? ' ✅' : ' ❌'}
                </p>
                <hr>
            `;
        });
        
        // Agregar información de la imagen si existe
        if (answers[11]) {
            emailBody += `
                <p><strong>📎 Imagen de depósito:</strong><br>
                <img src="${answers[11]}" style="max-width: 500px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;"></p>
            `;
        } else {
            emailBody += `<p><strong>📎 Imagen de depósito:</strong> No se subió imagen</p>`;
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

// Función para verificar respuestas
function checkAnswer(id, answer) {
    const correctAnswers = {
        1: ["alberth marcelo silvestre flores", "alberthmarcelosilvestreflores", "marcelo silvestre", "alberth flores"],
        2: ["26/12", "26-12", "26 de diciembre", "diciembre 26"],
        3: "18",
        4: ["negro", "black"],
        5: ["gotoubun no hanayome", "las quintillizas", "the quintessential quintuplets", "quintillizas"],
        6: ["miku nakano", "miku"],
        7: ["yuri", "gl"], // ¡NUEVO!
        8: ["genshin impact", "genshin"],
        9: function(value) { return parseInt(value) >= 5; },
        10: ["milf", "culonas", "tetonas", "pequeñas", "tiernas", "culona", "tetona", "pequeña", "tierna"]
    };
    
    const userAnswer = String(answer).toLowerCase().trim();
    
    if (id === 9) {
        return correctAnswers[9](userAnswer);
    }
    
    if (Array.isArray(correctAnswers[id])) {
        return correctAnswers[id].some(a => userAnswer.includes(a.toLowerCase()));
    }
    
    return userAnswer === String(correctAnswers[id]);
}

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});