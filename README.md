# WildGuard: Wildlife Conservation Chatbot

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Dataset](#dataset)
- [Model Architecture](#model-architecture)
- [Installation](#installation)
- [Usage Instructions](#usage-instructions)
- [Performance Metrics](#performance-metrics)
- [Demo](#demo)
- [Future Work](#future-work)
- [References](#references)

## Project Overview
WildGuard is an AI-powered chatbot designed to provide accurate, accessible wildlife conservation information. Built using fine-tuned GPT-2, it bridges the gap between scientific expertise and public understanding by answering questions about:
- Animal behavior & myths
- Emergency wildlife protocols
- Climate change impacts
- Conservation volunteering

## Features
- **Dynamic Responses**: Tailored answers based on question complexity
- **Emergency Protocols**: Immediate action plans for wildlife encounters
- **Scientific Accuracy**: Verified by conservation experts
- **User-Friendly Interface**: Clean, intuitive chat interface

## Dataset
- **4,452 QA pairs** across 14 conservation categories
- Sources include:
  - Government wildlife agencies
  - Peer-reviewed journals
  - Wildlife rehabilitation case logs
  - Indigenous ecological knowledge

**Sample Data:**
| User Query | Bot Response |
|------------|--------------|
| "Can crocodiles cry?" | "They 'cry' to clean their eyes, not from sadness." |

## Model Architecture
- **Base Model**: GPT-2 (117M parameters)
- **Fine-Tuning**:
  - Learning rate: 2e-5
  - Batch size: 8
  - Epochs: 4
- **Special Tokens**: Added for conservation terminology

## Installation
```bash
git clone https://github.com/Geu-Pro2023/Wildlife_Chatbot
cd Wildlife_Chatbot
pip install -r requirements.txt
python app.py

Access at http://localhost:5000
