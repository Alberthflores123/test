const questions = [
    { id: 1, question: "¿Cómo es mi nombre y apellido completo?", type: "text" },
    { id: 2, question: "¿Cuándo cumplo años?", type: "text" },
    { id: 3, question: "¿Cuántos años tengo?", type: "text" }, // ✅ CAMBIADO A TEXT
    { id: 4, question: "¿Cuál es mi color favorito?", type: "text" },
    { id: 5, question: "¿Cuál es mi anime favorito?", type: "text" },
    { id: 6, question: "¿Cuál es mi personaje de anime favorito?", type: "text" },
    { id: 7, question: "¿Cuál es mi género de anime favorito?", type: "text" },
    { id: 8, question: "¿Cuál es mi juego favorito?", type: "text" },
    { id: 9, question: "Del 1 al 10, ¿qué tan buen amigo soy?", type: "number" },
    { id: 10, question: "¿Qué tipo de mujeres me gustan?", type: "text" },
    { id: 11, question: "Adjunta una imagen de un depósito de 100 soles a mi cuenta bancaria (OPCIONAL)", type: "file" }
];

// RESPUESTAS CORRECTAS
const correctAnswers = {
    1: ["alberth marcelo silvestre flores", "alberthmarcelosilvestreflores", "marcelo silvestre", "alberth flores"],
    2: ["26/12", "26-12", "26 de diciembre", "diciembre 26"],
    3: "18",
    4: ["negro", "black"],
    5: ["gotoubun no hanayome", "las quintillizas", "the quintessential quintuplets", "quintillizas"],
    6: ["miku nakano", "miku"],
    7: ["yuri", "gl"],
    8: ["genshin impact", "genshin"],
    9: function(value) { return parseInt(value) >= 5; },
    10: ["milf", "culonas", "tetonas", "pequeñas", "tiernas", "culona", "tetona", "pequeña", "tierna"]
};

let currentQuestion = 0;
const answers = {};
let userAnswers = {};

// Verificar login
if (!localStorage.getItem('loggedIn')) {
    window.location.href = 'login.html';
}

// Función para renderizar preguntas
function renderQuestions() {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
        const div = document.createElement('div');
        div.className = `question-container ${index === 0 ? 'active' : ''}`;
        div.id = `question-${index}`;
        
        let inputHTML = '';
        if (q.type === 'file') {
            inputHTML = `
                <div class="form-group">
                    <label for="q${q.id}">${q.question}</label>
                    <input type="file" id="q${q.id}" accept="image/*" onchange="handleFileUpload(event, ${q.id})">
                    <div class="file-name" id="fileName-${q.id}"></div>
                    <p style="font-size: 0.9em; color: #666; margin-top: 5px;">📌 Esta pregunta es opcional</p>
                </div>
            `;
        } else {
            inputHTML = `
                <div class="form-group">
                    <label for="q${q.id}">${q.question}</label>
                    <input type="${q.type}" id="q${q.id}" 
                           ${q.type === 'number' ? 'min="1" max="10"' : ''}
                           onchange="saveAnswer(${q.id}, this.value)">
                </div>
            `;
        }
        
        div.innerHTML = `
            <h3>Pregunta ${index + 1} de ${questions.length}</h3>
            ${inputHTML}
        `;
        
        container.appendChild(div);
    });
}

// Guardar respuestas
function saveAnswer(id, value) {
    answers[id] = value;
    userAnswers[id] = value;
    updateProgress();
}

// Manejar archivos
function handleFileUpload(event, id) {
    const file = event.target.files[0];
    if (file) {
        const fileName = document.getElementById(`fileName-${id}`);
        fileName.textContent = `📎 ${file.name}`;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            answers[id] = e.target.result;
            userAnswers[id] = 'Imagen subida';
            updateProgress();
        };
        reader.readAsDataURL(file);
    }
}

// Navegación entre preguntas
function showQuestion(index) {
    const containers = document.querySelectorAll('.question-container');
    containers.forEach((el, i) => {
        el.classList.toggle('active', i === index);
    });
    
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'inline-block' : 'none';
    
    const progress = ((index + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = `Pregunta ${index + 1} de ${questions.length}`;
}

function updateProgress() {
    // No actualizamos la barra de progreso aquí para mantener la posición de la pregunta actual
}

// Calcular puntaje
function calculateScore() {
    let correct = 0;
    let total = 10; // Las primeras 10 preguntas cuentan (la 11 es opcional)
    
    // Pregunta 1: Nombre
    const q1 = userAnswers[1]?.toLowerCase().trim() || '';
    if (correctAnswers[1].some(a => q1.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 2: Fecha
    const q2 = userAnswers[2]?.toLowerCase().trim() || '';
    if (correctAnswers[2].some(a => q2.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 3: Edad
    if (userAnswers[3] == correctAnswers[3]) correct++;
    
    // Pregunta 4: Color favorito
    const q4 = userAnswers[4]?.toLowerCase().trim() || '';
    if (correctAnswers[4].some(a => q4.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 5: Anime favorito
    const q5 = userAnswers[5]?.toLowerCase().trim() || '';
    if (correctAnswers[5].some(a => q5.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 6: Personaje favorito
    const q6 = userAnswers[6]?.toLowerCase().trim() || '';
    if (correctAnswers[6].some(a => q6.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 7: Género de anime favorito (YURI o GL)
    const q7 = userAnswers[7]?.toLowerCase().trim() || '';
    if (correctAnswers[7].some(a => q7.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 8: Juego favorito
    const q8 = userAnswers[8]?.toLowerCase().trim() || '';
    if (correctAnswers[8].some(a => q8.includes(a.toLowerCase()))) correct++;
    
    // Pregunta 9: Calificación (>= 5)
    if (correctAnswers[9](userAnswers[9])) correct++;
    
    // Pregunta 10: Tipo de mujeres
    const q10 = userAnswers[10]?.toLowerCase().trim() || '';
    if (correctAnswers[10].some(a => q10.includes(a.toLowerCase()))) correct++;
    
    return { correct, total, percentage: Math.round((correct / total) * 100) };
}

// Enviar datos al servidor
function sendData() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Calcular puntaje
    const score = calculateScore();
    
    // Añadir puntaje a las respuestas
    const dataToSend = {
        ...answers,
        score: score
    };
    
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.innerHTML = `
                <h2>📊 ¡Resultados!</h2>
                <p style="font-size: 3em; margin: 20px 0;">${score.percentage}%</p>
                <p>Acertaste ${score.correct} de ${score.total} preguntas</p>
                <p style="margin-top: 10px;">✅ Respuestas enviadas correctamente a tu correo</p>
                ${score.percentage >= 70 ? '<p style="color: #28a745; font-weight: bold;">🎉 ¡Eres un gran amigo!</p>' : '<p style="color: #dc3545; font-weight: bold;">😅 ¡Necesitas conocerme mejor!</p>'}
            `;
            messageDiv.style.display = 'block';
            submitBtn.textContent = '✅ Enviado';
            document.querySelector('.form-actions').style.display = 'none';
        } else {
            messageDiv.className = 'message error';
            messageDiv.textContent = '❌ Error al enviar: ' + data.message;
            messageDiv.style.display = 'block';
            submitBtn.textContent = 'Enviar Respuestas';
            submitBtn.disabled = false;
        }
    })
    .catch(error => {
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.textContent = '❌ Error de conexión: ' + error.message;
        messageDiv.style.display = 'block';
        submitBtn.textContent = 'Enviar Respuestas';
        submitBtn.disabled = false;
        console.error('Error:', error);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    renderQuestions();
    showQuestion(0);
    
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    });
    
    document.getElementById('nextBtn').addEventListener('click', () => {
        const currentId = questions[currentQuestion].id;
        const input = document.getElementById(`q${currentId}`);
        
        // Solo validar si no es la pregunta 11 (imagen, que es opcional)
        if (currentId !== 11 && (!input || !input.value)) {
            alert('Por favor responde esta pregunta antes de continuar.');
            return;
        }
        
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    });
    
    document.getElementById('quizForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Verificar que todas las preguntas estén respondidas (excepto la 11 que es opcional)
        const totalQuestions = 10; // Solo las primeras 10 son obligatorias
        let answered = 0;
        for (let i = 1; i <= totalQuestions; i++) {
            if (answers[i]) answered++;
        }
        
        if (answered < totalQuestions) {
            alert(`Faltan ${totalQuestions - answered} preguntas por responder.`);
            return;
        }
        
        // Enviar datos al servidor
        sendData();
    });
});