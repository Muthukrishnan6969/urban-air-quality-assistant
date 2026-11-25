# Urban Air Quality Assistant

Know your air. Plan your day.

**Live app:** https://urban-air-quality-assistant.rifegiant3.chatgpt.site

A responsive web application that translates city air quality forecasts into understandable pollutant readings and practical outdoor activity guidance. Built with AI-assisted development for Challenge 6: Urban Air Quality Assistant.

## Features

- Worldwide city search with region/country disambiguation, including Tirupur.
- Browser location lookup with permission and an alternative city search.
- Current model US AQI, six-category interpretation, and forecast validity time.
- PM2.5, PM10, NO2, O3, SO2, and CO concentrations in µg/m³.
- Next 24 hourly AQI values in an accessible SVG chart.
- Outdoor planner finding the lowest average AQI for contiguous one- or two-hour activities, with sensitive-group guidance and high-pollution cautions.
- Up to six saved places stored locally in the browser.
- Explicitly labelled demo data for presentations without an API connection.
- Responsive desktop/mobile layout, keyboard controls, and status announcements.

## Run locally

Requires Python 3 to serve the site; Node.js 18+ to run optional checks. No package installation or API key is needed for the non-commercial free Open-Meteo endpoints.

```sh
npm start
```

Open http://localhost:4173. Alternatively:

```sh
python3 -m http.server 4173 --directory dist
```

Do not open index.html directly using file://; JavaScript modules need HTTP.

```sh
npm test
npm run check
```

## Architecture

The static frontend uses HTML, CSS, and native JavaScript modules. `dist/app.js` handles API calls and UI state; `dist/air.js` provides category definitions, deterministic demo data, and the forecast-window algorithm. There is no backend, database, login, or embedded credential. The only optional remote visual dependency is Google Fonts; system fonts remain available offline.

## Data and interpretation

City search uses the [Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api). Air quality uses [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api), powered by [Copernicus Atmosphere Monitoring Service (CAMS)](https://atmosphere.copernicus.eu/). Data attribution follows Open-Meteo's documented CC BY 4.0 requirements. Check their current terms and service tier before commercial use.

The dashboard explicitly uses **US AQI**, including for Indian cities. It is not India's CPCB AQI. Values are model forecasts, not nearby monitoring-station observations. Concentrations are not pollutant-specific AQI values. No local AQI calculation is performed. Category meanings and general guidance are based on [AirNow](https://www.airnow.gov/aqi/aqi-basics/).

The planner scans the next available 24 hourly slots and selects the contiguous interval with the lowest mean AQI, choosing the earliest on ties. It rejects missing/invalid data and non-contiguous intervals. It does not optimize weather, daylight, routes, or personal medical suitability. A low relative value does not guarantee safe air; local advisories take priority. Current and hourly values may differ because of different forecast time steps. Demo mode is synthetic and clearly labelled.

## Privacy and reliability

Search terms are sent to Open-Meteo. With explicit browser permission, coordinates are sent to its air quality API. Saved places are kept in localStorage on the current browser, with a session fallback when storage is blocked. API failures display an error and offer demo mode; they never silently substitute demo readings. New location requests invalidate older pending forecast results. No analytics are included.

## Deploy on GitHub Pages

1. Create a **public** GitHub repository named `urban-air-quality-assistant`.
2. Upload this project source, excluding ZIP files and local Git metadata. Keep the `dist` folder.
3. In repository Settings → Pages, choose GitHub Actions as the source.
4. The included `.github/workflows/pages.yml` deploys `dist` on manual dispatch after Pages is enabled.
5. Run the Deploy GitHub Pages workflow manually from Actions. After it succeeds, copy the Pages URL from Settings → Pages.

The workflow requires GitHub Pages to be enabled on the repository.

## Verification

Automated tests cover all six AQI category boundaries, unavailable data, contiguous multi-hour selection, earliest ties, and complete demo data. Browser QA verified demo mode, city search, real model forecasts for Delhi and Tirupur, saved places, planner changes, and mobile/desktop layouts.

## Submission

See `SUBMISSION.md` for the form answers and `DEMO-SCRIPT.md` for a suggested recording. Keep the repository below 10 MB. Do not commit the demo video; submit a separate accessible YouTube or Drive link.

## AI assistance

OpenAI Codex assisted with application design, source implementation, API integration, testing, and documentation. Runtime activity guidance is deterministic; no generative AI inference service is connected to the application.
