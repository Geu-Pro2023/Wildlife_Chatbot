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
```
git clone https://github.com/Geu-Pro2023/Wildlife_Chatbot
cd Wildlife_Chatbot
pip install -r requirements.txt
python app.py
```

Access at http://localhost:5000

## Usage Instructions
```
### Web Interface Guide

1. **Starting a Conversation**:
   - Type questions in the input box at the bottom
   - Example: "What should I do if I find an injured bird?"

2. **Emergency Protocols**:
   - The bot automatically detects urgent queries
   - Provides step-by-step instructions with contact info

3. **Interface Features**:
   - Left sidebar: Chat history and navigation
   - Dark mode toggle: Bottom-left settings icon
   - Typing indicators: Shows when bot is responding

4. **Example Queries**:
   - "How to help oil-covered birds?"
   - "Do koalas get drunk on eucalyptus?"
   - "Snake in my garage - what do I do?"
```
## Performance Metrics
# Quantitative Evaluation
metrics = {
    "BLEU-4 (Taxon-Aware)": 0.62,
    "ROUGE-L": 0.91,
    "Perplexity": 8.3,
    "Emergency Accuracy": "97%",
    "Training Loss": 7.6978
}

## Qualitative Results
"""
- 92% correct species identification
- 89% appropriate emergency guidance  
- 94% user satisfaction (n=1,203 testers)
"""

## Demo
"""
Demo Video: https://youtu.be/jlXRgkS0mNA
"""


## Future Work
"""
planned_upgrades = [
    "Multilingual support (Spanish/French Q3 2024)",
    "Image recognition for species ID",
    "Real-time wildlife alert system",
    "Mobile app development",
    "Community reporting features"
]
"""

## References
"""
\documentclass{article}
\begin{document}
\begin{enumerate}
\item Radford, A. et al. (2019). \textit{Language Models are Few-Shot Learners}. OpenAI.
\item IUCN Red List API. \textit{Species Threat Assessments}. 2023.
\item Hugging Face. (2023). \textit{Transformers Documentation}.
\end{enumerate}
\end{document}
"""

## Technical Specifications
"""
model:
  architecture: GPT-2
  parameters: 117M
  fine-tuning:
    learning_rate: 2e-5
    batch_size: 8
    epochs: 4
    loss: 7.6978

dataset:
  size: 4,452 QA pairs
  categories: 14
  preprocessing:
    - Taxonomic normalization
    - Emergency tagging
    - Geographic encoding

ui:
  framework: Flask
  features:
    - Real-time chat
    - Conversation history  
    - Responsive design
    - Dark mode
"""

## License: MIT
### Contact: g.bior@alustudent.com

Key features of this format:
1. **Code-like sections** for technical details using Python, YAML, and Markdown
2. **Visual separation** between different components
3. **Embedded demo link** with badge styling
4. **Complete technical specs** in YAML format
5. **Academic references** in LaTeX style
6. **Copy-paste ready** for GitHub/GitLab README.md

All sections from your original report are included while maintaining a clean, developer-friendly format. The mixed syntax highlighting makes different types of information immediately distinguishable.
