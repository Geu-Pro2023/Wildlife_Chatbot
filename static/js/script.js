document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const newChatBtn = document.getElementById('new-chat-btn');
    const searchBtn = document.getElementById('search-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const upgradeBtn = document.getElementById('upgrade-btn');
    const settingsBtn = document.getElementById('settings-btn');
    const messageForm = document.getElementById('message-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');

    // Event Listeners
    newChatBtn.addEventListener('click', createNewChat);
    messageForm.addEventListener('submit', sendMessage);
    upgradeBtn?.addEventListener('click', showUpgradeModal);
    settingsBtn.addEventListener('click', showSettingsModal);
    clearAllBtn.addEventListener('click', clearAllConversations);

    // Initialize
    initConversationEvents();

    function createNewChat(e) {
        e.preventDefault();
        fetch('/chat/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.redirect) {
                    window.location.href = data.redirect;
                }
            })
            .catch(error => {
                showSnackbar('Error creating new chat', 'error');
                console.error('Error:', error);
            });
    }

    function sendMessage(e) {
        e.preventDefault();
        const message = userInput.value.trim();
        const conversationId = document.getElementById('conversation-id').value;

        if (!message) return;

        // Add user message to UI
        addMessageToUI('user', message);
        userInput.value = '';

        // Show typing indicator
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Send to server
        fetch('/send_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_input: message,
                conversation_id: conversationId
            })
        })
            .then(response => response.json())
            .then(data => {
                typingIndicator.style.display = 'none';
                if (data.ai_response) {
                    addMessageToUI('ai', data.ai_response);
                }
            })
            .catch(error => {
                typingIndicator.style.display = 'none';
                addMessageToUI('ai', "Sorry, I'm having trouble connecting. Please try again.");
                console.error('Error:', error);
            });
    }

    function addMessageToUI(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showUpgradeModal() {
        document.getElementById('upgradeModal').style.display = 'block';
        document.getElementById('upgrade-form').addEventListener('submit', handleUpgrade);
    }

    function handleUpgrade(e) {
        e.preventDefault();
        const answer = document.getElementById('quiz-answer').value;
        const questionId = document.getElementById('quiz-question-id').value;

        fetch('/upgrade', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quiz_answer: answer,
                question_id: questionId
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    showSnackbar(data.message, 'success');
                    document.getElementById('upgradeModal').style.display = 'none';
                    window.location.reload();
                } else if (data.error) {
                    showSnackbar(data.error, 'error');
                }
            })
            .catch(error => {
                showSnackbar('Error processing upgrade', 'error');
                console.error('Error:', error);
            });
    }

    function showSettingsModal() {
        const modal = document.getElementById('settingsModal');
        modal.style.display = 'block';
        document.getElementById('settings-form').addEventListener('submit', handleSettings);
    }

    function handleSettings(e) {
        e.preventDefault();
        const showPopup = document.getElementById('show-popup').checked;

        fetch('/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                show_welcome_popup: showPopup
            })
        })
            .then(response => response.json())
            .then(data => {
                showSnackbar(data.message, 'success');
                document.getElementById('settingsModal').style.display = 'none';
            })
            .catch(error => {
                showSnackbar('Error saving settings', 'error');
                console.error('Error:', error);
            });
    }

    function clearAllConversations() {
        if (confirm('Are you sure you want to clear all conversations?')) {
            fetch('/chat/clear_all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then(data => {
                    showSnackbar(data.message, 'success');
                    window.location.href = '/';
                })
                .catch(error => {
                    showSnackbar('Error clearing conversations', 'error');
                    console.error('Error:', error);
                });
        }
    }

    function initConversationEvents() {
        document.querySelectorAll('.edit-chat-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const convId = this.getAttribute('data-conversation-id');
                const convTitle = this.closest('.conversation-item').querySelector('.conversation-title').textContent;
                showRenameModal(convId, convTitle);
            });
        });

        document.querySelectorAll('.delete-chat-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const convId = this.getAttribute('data-conversation-id');
                if (confirm('Are you sure you want to delete this conversation?')) {
                    fetch(`/chat/${convId}/delete`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            showSnackbar(data.message, 'success');
                            window.location.href = '/';
                        })
                        .catch(error => {
                            showSnackbar('Error deleting conversation', 'error');
                            console.error('Error:', error);
                        });
                }
            });
        });
    }

    function showRenameModal(convId, currentTitle) {
        const modal = document.getElementById('renameModal');
        document.getElementById('rename-conversation-id').value = convId;
        document.getElementById('new-conversation-title').value = currentTitle;
        modal.style.display = 'block';

        document.getElementById('rename-form').addEventListener('submit', function (e) {
            e.preventDefault();
            const newTitle = document.getElementById('new-conversation-title').value;

            fetch(`/chat/${convId}/rename`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    new_title: newTitle
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message) {
                        showSnackbar(data.message, 'success');
                        modal.style.display = 'none';
                        window.location.reload();
                    }
                })
                .catch(error => {
                    showSnackbar('Error renaming conversation', 'error');
                    console.error('Error:', error);
                });
        });
    }

    function showSnackbar(message, type) {
        const snackbar = document.getElementById('snackbar');
        snackbar.textContent = message;
        snackbar.className = 'snackbar show ' + type;
        setTimeout(() => {
            snackbar.className = 'snackbar';
        }, 3000);
    }

    // Close modals when clicking X
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });
});