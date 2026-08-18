const questions = [
    { id: 1, question: "¿Cómo es mi nombre y apellido completo?", type: "text" },
    { id: 2, question: "¿Cuándo cumplo años?", type: "text" },
    { id: 3, question: "¿Cuántos años tengo?", type: "number" },
    { id: 4, question: "¿Cuál es mi color favorito?", type: "text" },
    { id: 5, question: "¿Cuál es mi anime favorito?", type: "text" },
    { id: 6, question: "¿Cuál es mi personaje de anime favorito?", type: "text" },
    { id: 7, question: "¿Cuál es mi género de anime favorito?", type: "text" },
    { id: 8, question: "¿Cuál es mi juego favorito?", type: "text" },
    { id: 9, question: "Del 1 al 10, ¿qué tan buen amigo soy?", type: "number" },
    { id: 10, question: "Adjunta una imagen de un depósito de 100 soles a mi cuenta bancaria", type: "file" }
];

let currentQuestion = 0;
const answers = {};

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
    const answered = Object.keys(answers).length;
    const total = questions.length;
    // No actualizamos la barra de progreso aquí para mantener la posición de la pregunta actual
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
        
        if (!input || !input.value) {
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
        
        // Verificar que todas las preguntas estén respondidas
        const totalQuestions = questions.length;
        const answeredCount = Object.keys(answers).length;
        
        if (answeredCount < totalQuestions) {
            alert(`Faltan ${totalQuestions - answeredCount} preguntas por responder.`);
            return;
        }
        
        // Enviar datos al servidor
        sendData();
    });
});

// Enviar datos al servidor
function sendData() {
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers)
    })
    .then(response => response.json())
    .then(data => {
        const messageDiv = document.getElementById('message');
        if (data.success) {
            messageDiv.className = 'message success';
            messageDiv.textContent = '✅ ¡Respuestas enviadas correctamente a tu correo!';
            messageDiv.style.display = 'block';
            submitBtn.textContent = '✅ Enviado';
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
        messageDiv.textContent = '❌ Error de conexión. Asegúrate de que el servidor esté corriendo.';
        messageDiv.style.display = 'block';
        submitBtn.textContent = 'Enviar Respuestas';
        submitBtn.disabled = false;
        console.error('Error:', error);
    });
}