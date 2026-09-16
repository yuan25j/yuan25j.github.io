---
title: RAG Clickbait Generator
description: A retrieval-augmented generation tool for producing engaging headlines grounded in source material.
date: 2025-02-01
skills: [Python, RAG, Natural Language Processing, LLMs]
github: https://github.com/yuan25j/RAGClickbaitGenerator
featured: false
category: research
problem: Headline generation must balance engaging language with enough source context to remain relevant and informative.
outcome: Built a retrieval and generation workflow that supplies supporting examples and context before producing a headline.
---

## Approach

The Python application retrieves relevant examples from a headline dataset and adds them to the generation context. The language model then uses that retrieved material to produce a headline for the supplied content.

## Focus

The project explored how retrieval-augmented generation can guide style while preserving a connection between the generated headline and its source material.
