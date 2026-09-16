---
title: LLM Fingerprinting & Digital Watermarking
description: Research on identifying the source model of AI-generated text from model-specific linguistic patterns.
date: 2025-04-01
skills: [Python, NLP, BERT, LLMs, Data Analysis]
github: https://github.com/yuan25j/IdiosyncrasiesInLLMs
demo: https://drive.google.com/file/d/156Fwo-ZKqDqlGk6fFZYVAlACrRr3nh2i/view?usp=sharing
featured: false
category: research
problem: AI-generated text usually does not include reliable source attribution, making it difficult to determine which language model produced a document.
outcome: The classification approach achieved more than 97% accuracy identifying the model that generated a given text sample.
---

## Approach

The project examined whether different language models leave measurable linguistic signatures in their generated text. We generated and transformed model outputs, extracted features, and trained a BERT-based classifier to distinguish between source models.

## Relevance

Model attribution has applications in digital watermarking, copyright protection, provenance, and analysis of AI-generated content.
