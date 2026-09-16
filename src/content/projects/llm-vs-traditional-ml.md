---
title: Comparative Analysis of LLM Performance vs Traditional ML Techniques
description: An empirical comparison of large language models and conventional machine-learning methods for text classification.
date: 2025-05-01
skills: [Python, LLMs, Logistic Regression, SVM, Random Forest, Data Analysis]
featured: false
category: research
problem: It is not always clear whether an LLM provides enough classification benefit to justify its additional complexity compared with established machine-learning models.
outcome: Compared model performance using F1 score, precision, and recall, then analyzed the trade-offs and common causes of misclassification.
---

## Approach

We evaluated large language models alongside logistic regression, support vector machines, and random forests on the same text-classification task. Each model was measured with consistent evaluation criteria so that differences in precision, recall, and F1 score could be compared directly.

## Analysis

Beyond aggregate scores, the project examined incorrectly classified examples to identify where each approach performed well and where its assumptions or representation produced errors.
