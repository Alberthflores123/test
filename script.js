const questions = [
    { id: 1, question: "¿Cómo es mi nombre y apellido completo?", type: "text" },
    { id: 2, question: "¿Cuándo cumplo años?", type: "text" },
    { id: 3, question: "¿Cuántos años tengo?", type: "text" },
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

// Calcular puntaje
function calculateScore() {
    let correct = 0;
    let total = 10;
    
    const q1 = userAnswers[1]?.toLowerCase().trim() || '';
    if (correctAnswers[1].some(a => q1.includes(a.toLowerCase()))) correct++;
    
    const q2 = userAnswers[2]?.toLowerCase().trim() || '';
    if (correctAnswers[2].some(a => q2.includes(a.toLowerCase()))) correct++;
    
    if (userAnswers[3] == correctAnswers[3]) correct++;
    
    const q4 = userAnswers[4]?.toLowerCase().trim() || '';
    if (correctAnswers[4].some(a => q4.includes(a.toLowerCase()))) correct++;
    
    const q5 = userAnswers[5]?.toLowerCase().trim() || '';
    if (correctAnswers[5].some(a => q5.includes(a.toLowerCase()))) correct++;
    
    const q6 = userAnswers[6]?.toLowerCase().trim() || '';
    if (correctAnswers[6].some(a => q6.includes(a.toLowerCase()))) correct++;
    
    const q7 = userAnswers[7]?.toLowerCase().trim() || '';
    if (correctAnswers[7].some(a => q7.includes(a.toLowerCase()))) correct++;
    
    const q8 = userAnswers[8]?.toLowerCase().trim() || '';
    if (correctAnswers[8].some(a => q8.includes(a.toLowerCase()))) correct++;
    
    if (correctAnswers[9](userAnswers[9])) correct++;
    
    const q10 = userAnswers[10]?.toLowerCase().trim() || '';
    if (correctAnswers[10].some(a => q10.includes(a.toLowerCase()))) correct++;
    
    return { correct, total, percentage: Math.round((correct / total) * 100) };
}

function checkAnswer(id, answer) {
    const userAnswer = String(answer).toLowerCase().trim();
    
    if (id === 9) {
        return correctAnswers[9](userAnswer);
    }
    
    if (Array.isArray(correctAnswers[id])) {
        return correctAnswers[id].some(a => userAnswer.includes(a.toLowerCase()));
    }
    
    return userAnswer === String(correctAnswers[id]);
}

// Enviar datos con EmailJS
function sendData() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    const score = calculateScore();
    
    // Construir el mensaje en HTML
    const preguntas = [
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
    
    let htmlMessage = `
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
    
    preguntas.forEach((q, index) => {
        const answer = answers[index + 1] || 'No respondida';
        const isCorrect = checkAnswer(index + 1, answer);
        htmlMessage += `
            <p>
                <strong>${q}</strong><br>
                ${answer}
                ${isCorrect ? ' ✅' : ' ❌'}
            </p>
            <hr>
        `;
    });
    
    if (answers[11]) {
        htmlMessage += `
            <p><strong>📎 Imagen de depósito:</strong><br>
            <img src="${answers[11]}" style="max-width: 500px; border: 1px solid #ddd; border-radius: 8px; margin-top: 10px;"></p>
        `;
    } else {
        htmlMessage += `<p><strong>📎 Imagen de depósito:</strong> No se subió imagen</p>`;
    }
    
    // Enviar con EmailJS
    const templateParams = {
        to_email: 'silvestrefloresalberthmarcelo@gmail.com',
        from_name: 'Test del Amigo Falso',
        subject: '🎯 Test del Amigo Falso - Nuevas Respuestas',
        message_html: htmlMessage,
        score_percentage: score.percentage,
        score_correct: score.correct,
        score_total: score.total
    };
    
    console.log('📤 Enviando correo con EmailJS...');
    console.log('Service ID:', 'service_dg51pjm');
    console.log('Template ID:', 'template_pyxj2aq');
    
    emailjs.send(
        'service_dg51pjm',   // ← TU SERVICE ID
        'template_pyxj2aq',  // ← TU TEMPLATE ID
        templateParams
    )
    .then(function(response) {
        console.log('✅ Correo enviado:', response);
        const messageDiv = document.getElementById('message');
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
    }, function(error) {
        console.error('❌ Error detallado:', error);
        const messageDiv = document.getElementById('message');
        messageDiv.className = 'message error';
        messageDiv.innerHTML = `
            <p>❌ Error al enviar el correo</p>
            <p style="font-size: 0.9em; color: #666;">${error.text || error.message || 'Error desconocido'}</p>
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;">Verifica que el Service ID y Public Key sean correctos</p>
        `;
        messageDiv.style.display = 'block';
        submitBtn.textContent = 'Enviar Respuestas';
        submitBtn.disabled = false;
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
        
        const totalQuestions = 10;
        let answered = 0;
        for (let i = 1; i <= totalQuestions; i++) {
            if (answers[i]) answered++;
        }
        
        if (answered < totalQuestions) {
            alert(`Faltan ${totalQuestions - answered} preguntas por responder.`);
            return;
        }
        
        sendData();
    });
});

// Cargar EmailJS
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
script.onload = function() {
    emailjs.init('ApP-3ysBP9MxV7e5V'); // ← TU PUBLIC KEY
    console.log('✅ EmailJS inicializado');
};
document.head.appendChild(script);