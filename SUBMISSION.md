# Submission form — Challenge 6

## Challenge
[Challenge 6] Urban Air Quality Assistant

## Public GitHub Repository Link
Paste the real public repository URL after uploading this source, for example in the format `https://github.com/YOUR-USERNAME/urban-air-quality-assistant`. Do not paste this placeholder or the localhost preview. Verify the repository opens while signed out. The source package is far below 10 MB; keep video files outside the repository.

## Project Deployed Link
Use the publicly accessible deployed URL returned after successful publication, or the GitHub Pages URL after the included workflow succeeds. Verify it opens without signing in. A localhost URL will not work for evaluators.

## Project Demo Video Submission
Record the flow in DEMO-SCRIPT.md. Upload it as an unlisted YouTube video or a Google Drive file with anyone-with-link viewing enabled, then paste its actual link. No video has been recorded or uploaded by the project code.

## Describe the changes/updates made in the deployed version
Initial release of Urban Air Quality Assistant: a responsive dashboard with worldwide city search, location-based forecasts, current model US AQI and category explanations, six pollutant readings, and a 24-hour AQI chart. The activity planner finds the lowest forecast AQI window for walking, running, or cycling and provides guidance for general and sensitive groups. Includes browser-local saved places, clearly labelled demo mode, API error handling, accessible controls, and mobile/desktop layouts. Forecast data is attributed to Open-Meteo and CAMS, and the interface distinguishes US AQI from India's CPCB AQI.

## Mention the Gen AI services utilized in the submission, and where did you utilize it?
OpenAI Codex was used as an AI coding assistant to develop the interface, integrate Open-Meteo geocoding and air quality APIs, implement forecast-based activity planning, write AQI and planning tests, and prepare documentation. It also helped verify the interface in the browser. The deployed app does not call a generative AI API: its recommendations use transparent rules based on forecast AQI and the selected activity/profile. Air quality data comes from Open-Meteo/CAMS, not from AI-generated readings.

## Before submitting
Check all three actual links while signed out. Keep GitHub public and under 10 MB; keep the video accessible. Review carefully because the instructions allow at most three submissions.
