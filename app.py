import os
import pickle
import random
import json
import numpy as np
import torch
from flask import Flask, render_template, request, jsonify, session, url_for
from transformers import BertTokenizer, BertModel
from tensorflow.keras.models import load_model
from tensorflow.keras.optimizers import Adam

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Configuration
MODEL_PATH = 'models/wildlife_chatbot_model.h5'
INTENTS_FILE = 'Wildlifebot_Catergory.json'
WORDS_FILE = 'wildlife_words.pkl'
CLASSES_FILE = 'wildlife_classes.pkl'

# Quiz Questions
QUIZ_QUESTIONS = [
    {"id": 1, "question": "What is the largest land animal?", "answer": "elephant"},
    {"id": 2, "question": "Which big cat is known as the 'king of the jungle'?", "answer": "lion"},
    {"id": 3, "question": "What is the fastest land animal?", "answer": "cheetah"},
    {"id": 4, "question": "Which animal is known for its black and white stripes?", "answer": "zebra"},
]

def load_resources():
    """Load all required model files and resources"""
    try:
        resources = {
            'model': load_model(MODEL_PATH),
            'tokenizer': BertTokenizer.from_pretrained('bert-base-uncased'),
            'bert_model': BertModel.from_pretrained('bert-base-uncased'),
            'intents': json.load(open(INTENTS_FILE)),
            'words': pickle.load(open(WORDS_FILE, 'rb')),
            'classes': pickle.load(open(CLASSES_FILE, 'rb'))
        }
        resources['model'].compile(optimizer=Adam(), loss='categorical_crossentropy', metrics=['accuracy'])
        return resources
    except Exception as e:
        print(f"Error loading resources: {str(e)}")
        exit(1)

resources = load_resources()

def get_bert_embedding(sentence):
    inputs = resources['tokenizer'](sentence, return_tensors='pt', padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = resources['bert_model'](**inputs)
    return outputs.last_hidden_state.mean(dim=1).detach().numpy()

def predict_class(sentence):
    embedding = get_bert_embedding(sentence)
    pred = resources['model'].predict(embedding, verbose=0)
    results = [[i, r] for i, r in enumerate(pred[0]) if r > 0.5]
    results.sort(key=lambda x: x[1], reverse=True)
    return [{
        "Catergory": resources['classes'][r[0]],
        "probability": str(r[1]),
        "pattern": sentence
    } for r in results]

def get_response(intents_list):
    if not intents_list:
        return "I'm not sure about that wildlife topic. Could you be more specific?"
    tag = intents_list[0]['Catergory']
    for intent in resources['intents']['Catergory']:
        if tag in intent['tags']:
            return random.choice(intent['responses'])
    return "I don't have information on that specific topic."

@app.route('/')
def chat():
    if 'conversations' not in session:
        session['conversations'] = []
        session['show_welcome_popup'] = True
        session['is_upgraded'] = False
    
    current_conv_id = request.args.get('conversation_id')
    current_conversation = next((c for c in session['conversations'] if str(c['id']) == current_conv_id), None)
    messages = current_conversation['messages'] if current_conversation else []
    
    return render_template('chat.html',
        conversations=session['conversations'],
        current_conversation=current_conversation,
        messages=messages,
        show_welcome_popup_on_load=session['show_welcome_popup'],
        is_upgraded=session['is_upgraded'],
        quiz_question=random.choice(QUIZ_QUESTIONS))

@app.route('/chat/new', methods=['POST'])
def new_chat():
    if len(session.get('conversations', [])) >= 8:
        return jsonify({'error': 'Maximum 8 conversations allowed'}), 400
    
    new_id = max([c.get('id', 0) for c in session['conversations']], default=0) + 1
    new_conversation = {'id': new_id, 'title': f"Chat {new_id}", 'messages': []}
    session['conversations'].insert(0, new_conversation)
    session.modified = True
    return jsonify({'redirect': url_for('chat', conversation_id=new_id)})

@app.route('/send_message', methods=['POST'])
def send_message():
    data = request.get_json()
    user_input = data.get('user_input')
    conversation_id = data.get('conversation_id')
    
    if not user_input or not conversation_id:
        return jsonify({'error': 'Invalid request'}), 400
    
    conversation = next((c for c in session['conversations'] if str(c['id']) == conversation_id), None)
    if not conversation:
        return jsonify({'error': 'Conversation not found'}), 404
    
    conversation['messages'].append({'sender': 'user', 'content': user_input})
    
    ints = predict_class(user_input)
    ai_response = get_response(ints)
    conversation['messages'].append({'sender': 'ai', 'content': ai_response})
    
    session.modified = True
    return jsonify({
        'ai_response': ai_response,
        'category': ints[0]['Catergory'] if ints else 'Unknown',
        'confidence': f"{float(ints[0]['probability']):.0%}" if ints else '0%'
    })

@app.route('/upgrade', methods=['POST'])
def upgrade():
    data = request.get_json()
    if session.get('is_upgraded'):
        return jsonify({'error': 'Already upgraded'}), 400
    
    correct_answer = next((q['answer'] for q in QUIZ_QUESTIONS if q['id'] == data.get('question_id')), "elephant")
    if data.get('quiz_answer', '').lower() == correct_answer.lower():
        session['is_upgraded'] = True
        session.modified = True
        return jsonify({'message': 'Upgrade successful!'})
    return jsonify({'error': 'Incorrect answer'}), 400

@app.route('/settings', methods=['POST'])
def settings():
    data = request.get_json()
    session['show_welcome_popup'] = data.get('show_welcome_popup', True)
    session.modified = True
    return jsonify({'message': 'Settings updated'})

@app.route('/chat/<int:conversation_id>/rename', methods=['POST'])
def rename_conversation(conversation_id):
    data = request.get_json()
    new_title = data.get('new_title')
    if not new_title:
        return jsonify({'error': 'Title required'}), 400
    
    conversation = next((c for c in session['conversations'] if c['id'] == conversation_id), None)
    if not conversation:
        return jsonify({'error': 'Conversation not found'}), 404
    
    conversation['title'] = new_title
    session.modified = True
    return jsonify({'message': 'Renamed successfully', 'new_title': new_title})

@app.route('/chat/<int:conversation_id>/delete', methods=['POST'])
def delete_conversation(conversation_id):
    session['conversations'] = [c for c in session.get('conversations', []) if c['id'] != conversation_id]
    session.modified = True
    return jsonify({'message': 'Deleted successfully'})

@app.route('/chat/clear_all', methods=['POST'])
def clear_all_conversations():
    session['conversations'] = []
    session.modified = True
    return jsonify({'message': 'All conversations cleared'})

if __name__ == '__main__':
    os.makedirs('static/uploads', exist_ok=True)
    app.run(host='0.0.0.0', port=5000, debug=True)