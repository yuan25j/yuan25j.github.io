---
title: Registration System
description: A full-stack check-in application that records users, visits, and timestamps.
date: 2023-03-01
skills: [Angular, TypeScript, RxJS, FastAPI, Python]
github: https://github.com/yuan25j/WebsiteRegistration
featured: true
problem: A fitness-center-style check-in flow needs reliable identity, time, and visit records without slowing down the user.
outcome: Built an observable-driven Angular experience connected to a Python API and local database.
---

## Approach

I designed the frontend around RxJS observables and connected it to a FastAPI backend responsible for user creation and check-in records. The separation kept UI state responsive while preserving visits in a local database.

## Result

The finished system demonstrates a clean API boundary and a practical end-to-end data flow from user interaction to persistent record.
