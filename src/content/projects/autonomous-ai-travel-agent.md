---
title: Autonomous AI Travel Agent
description: A Streamlit app that turns a plain-language trip request into a day-by-day itinerary, itemized fees, and a map colored by day.
date: 2026-09-01
skills: [Python, Streamlit, Gemini, smolagents, Folium]
github: https://github.com/yuan25j/autonomous-ai-travel-agent
demo: https://autonomous-ai-travel-agent-yuan.streamlit.app/
featured: true
category: software
problem: Planning a trip from a single sentence means assembling an itinerary, a budget, and a map, and keeping hotel and activity pins readable when several days share one destination.
outcome: A local Streamlit app plans the trip with a Gemini-backed agent, estimates flight and hotel costs, itemizes extra fees, and draws a Folium map whose activity pins follow the color of each day.
---

## Approach

I built a Python agent with smolagents that calls tools for places, OpenStreetMap Nominatim geocoding, a seasonal weather estimate, and a simulated flight-and-hotel total checked against the traveler's budget. Restaurant, weather, and fare data are deterministic mocks so the planner can run without live booking APIs. Park passes, tickets, and parking stay on their own fee lines.

The Streamlit interface shows the day-by-day plan and a Folium map. Hotels and airports keep one pin color. Restaurants and other stops use the color of the day they are visited. Offline unit tests cover the planner without calling Gemini.
