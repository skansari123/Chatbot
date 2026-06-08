// 1. GitHub se HTML aur CSS structure khinchne ka code
fetch('https://skansari123.github.io/Chatbot/index.html')
    .then(response => response.text())
    .then(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        
        // Styles inject karna
        const styles = doc.querySelectorAll('style');
        styles.forEach(s => document.head.insertAdjacentHTML('beforeend', s.outerHTML));
        
        // HTML elements ko client ki site par jodna
        const icon = doc.getElementById('db-chat-icon');
        const box = doc.getElementById('db-chat-box');
        
        if(icon && box) {
            document.body.appendChild(icon);
            document.body.appendChild(box);
            
            // 2. Open/Close Logic (Full Screen Open Hoga)
            icon.addEventListener('click', () => {
                box.style.display = 'flex';
            });
            
            document.getElementById('db-close-btn').addEventListener('click', () => {
                box.style.display = 'none';
            });
            
            // 3. Clear Chat Functionality
            document.getElementById('db-clear-btn').addEventListener('click', () => {
                document.getElementById('chat-box').innerHTML = '<div class="msg bot">Chat cleared. How can I help?</div>';
            });
            
            // 4. Asli Chat Logic (Message send karna aur Val town se reply lana)
            const BACKEND = "https://sarifeen272--acaf97cc62f811f1828a1607ee4eb77e.web.val.run";
            
            async function sendMessage() {
                const input = document.getElementById('user-input');
                const chatBox = document.getElementById('chat-box');
                if(!input.value.trim()) return;
                
                chatBox.innerHTML += `<div class="msg user">${input.value}</div>`;
                const msg = input.value;
                input.value = "";
                chatBox.scrollTop = chatBox.scrollHeight;
                
                // Typing Wave Effect
                const waveDiv = document.createElement('div');
                waveDiv.className = 'msg bot';
                waveDiv.innerHTML = '<span class="wave-dot"></span><span class="wave-dot"></span><span class="wave-dot"></span>';
                chatBox.appendChild(waveDiv);
                chatBox.scrollTop = chatBox.scrollHeight;
                
                try {
                    const res = await fetch(`${BACKEND}/chat`, { 
                        method: 'POST', 
                        body: JSON.stringify({ message: msg }), 
                        headers:{'Content-Type':'application/json'}
                    });
                    const resData = await res.json();
                    waveDiv.remove();
                    chatBox.innerHTML += `<div class="msg bot">${resData.reply}</div>`;
                } catch(err) {
                    waveDiv.remove();
                    chatBox.innerHTML += `<div class="msg bot">Sorry, network issue hai. Please try again!</div>`;
                }
                chatBox.scrollTop = chatBox.scrollHeight;
            }
            
            // Button click aur Enter key dono par message send ho
            document.getElementById('db-send-btn').addEventListener('click', sendMessage);
            document.getElementById('user-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }
    })
    .catch(err => console.error("Chatbot load nahi ho paya:", err));
