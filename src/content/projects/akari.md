---
title: Akari Light Up
description: A desktop implementation of the logic puzzle with responsive state and rule validation.
date: 2022-11-01
skills: [Java, JavaFX, MVC, Maven]
demo: https://youtu.be/WNIZWT8pEcY
featured: true
problem: The Akari puzzle requires immediate visual feedback while enforcing line-of-sight, wall, and illumination rules.
outcome: Shipped an interactive JavaFX game organized with the Model-View-Controller pattern.
---

## Approach

I separated puzzle rules and board state from the JavaFX presentation using MVC. Player actions update the model, which validates bulb placement and drives a clear visual response.

## Result

The project brought together object-oriented design, UI events, and non-trivial game logic in a maintainable desktop application.
