# RetryScope

> **Pre-deployment retry-storm risk analyzer for microservice architectures**

RetryScope is a research-oriented prototype that helps analyze how retry policies and injected service failures can amplify failures in a microservice architecture **before deployment**.

The system models a service topology, injects faults, runs a simulation, analyzes retry/failure behavior, estimates risk, and provides recommendations and visualizations.

---

## Overview

In distributed microservice systems, retries can improve reliability when used carefully. However, aggressive or poorly configured retries can amplify traffic and failures, contributing to **retry storms** and **cascading failures**.

RetryScope explores this problem through a controlled simulation workflow:

```text
Service Topology
       ↓
Fault Injection
       ↓
Simulation
       ↓
Risk Analysis
       ↓
Recommendations
       ↓
Visualizations / Comparison / Report
```

The goal is to identify potential retry-related risk using simulated scenarios rather than waiting for failures to occur in a production environment.

---

## Key Features

* **Topology Designer** — model service relationships and dependencies.
* **Fault Injection** — configure simulated service failures and timeout conditions.
* **Simulation Engine** — execute controlled retry/failure scenarios.
* **Risk Prediction** — analyze simulation metrics and classify retry-storm risk.
* **Recommendation Engine** — generate recommendations based on analyzed risk factors.
* **Result Persistence** — store simulation, risk, and recommendation results using PostgreSQL.
* **Visualizations** — inspect retry amplification, failures, request outcomes, and risk factors.
* **Comparison** — compare simulation scenarios and their configuration/results.
* **Report** — generate a structured project analysis report.
* **Testing** — backend functionality is covered with Pytest tests.
* **Load Testing** — Locust configuration is included for experimental load testing.

---

## Technology Stack

### Backend

* Python
* FastAPI
* Uvicorn
* SimPy
* NetworkX
* PostgreSQL
* Pytest
* Locust

### Frontend

* React
* Vite
* JavaScript / JSX
* CSS

---

## Architecture

```text
┌───────────────────────────────┐
│         React Frontend        │
│                               │
│ Topology │ Fault Injection    │
│ Simulation │ Risk Prediction  │
│ Visualizations │ Comparison   │
│ Export / Report               │
└───────────────┬───────────────┘
                │ REST API
                ▼
┌───────────────────────────────┐
│           FastAPI             │
│                               │
│ Topology API                  │
│ Fault Injection API           │
│ Simulation API                │
│ Result API                    │
│ Report API                    │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       Simulation / Analysis   │
│                               │
│ NetworkX → Service topology   │
│ SimPy    → Simulation         │
│ Fault Injection               │
│ Risk Analysis                 │
│ Recommendations               │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│          PostgreSQL           │
│ Simulation / Risk /           │
│ Recommendation Results        │
└───────────────────────────────┘
```

---

## Project Structure

```text
RetryScope/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes/
│   │   ├── database/
│   │   │   ├── models/
│   │   │   └── repositories/
│   │   ├── engines/
│   │   │   ├── fault_injection/
│   │   │   ├── recommendation/
│   │   │   ├── risk/
│   │   │   ├── simulation/
│   │   │   └── topology/
│   │   ├── schemas/
│   │   └── main.py
│   │
│   ├── locust/
│   └── tests/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── utils/
│
├── docs/
├── experiments/
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure the following are installed:

* Python 3.10+
* Node.js and npm
* PostgreSQL
* Git

### Backend Setup

From the project root:

```bash
cd C:\Users\ajay0\Desktop\RetryScope
```

Activate the existing project virtual environment:

```bash
.venv\Scripts\activate
```

Then enter the backend directory:

```bash
cd backend
```

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

FastAPI interactive documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

### Frontend Setup

Open another terminal:

```bash
cd C:\Users\ajay0\Desktop\RetryScope\frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

For a production build:

```bash
npm run build
```

---

## Database

RetryScope includes a PostgreSQL persistence layer for storing simulation-related results.

Configure the local database connection using the project's environment configuration.

**Do not commit real credentials or `.env` files.**

Use `.env.example` as the template for required environment variables.

---

## Running Tests

From the backend directory:

```bash
cd backend
pytest
```

The test suite covers areas including:

* Health endpoint
* Topology
* Fault injection
* Simulation repositories
* Risk analysis
* Recommendation logic
* PostgreSQL integration

---

## Load Testing

A Locust configuration is included under:

```text
backend/locust/
```

It can be used for experimental API/load-testing scenarios.

---

## Example Workflow

A typical RetryScope analysis follows this process:

1. Define a microservice topology.
2. Configure service dependencies.
3. Select a fault scenario.
4. Configure retry behavior.
5. Run the simulation.
6. Collect failure and retry metrics.
7. Analyze retry amplification and related risk factors.
8. Generate a risk assessment.
9. Generate recommendations.
10. Review visualizations and comparison/report information.

---

## Research Prototype

RetryScope is a **research/academic prototype**, not a production observability or traffic-management platform.

It operates on simulated scenarios to study retry-storm and cascading-failure behavior before deployment.

It does not replace production monitoring, distributed tracing, service-mesh controls, circuit breakers, or incident-response systems.

---

## Current Limitations

* Simulation results depend on the configured topology and simulation parameters.
* The project is intended for controlled experimentation rather than production traffic.
* Some frontend analysis/comparison views are still evolving as part of the research prototype.
* Risk classification and recommendations should be interpreted in the context of the simulated scenario.

---

## Future Improvements

Potential future work includes:

* More detailed retry-policy models
* Additional fault types
* More realistic workload models
* Expanded service-dependency analysis
* More advanced risk-calibration experiments
* Additional visualization and reporting capabilities
* Larger-scale experimental evaluation
* Integration with real-world microservice test environments

---

## Project Status

RetryScope has progressed beyond the initial project foundation and currently contains an integrated backend, frontend, simulation/analysis components, persistence layer, testing, and experimental load-testing support.

The project is being developed as a final-year academic/research project.

---

## Author

**ImAtshaya**

GitHub: [@ImAtshaya](https://github.com/ImAtshaya)

---

## License

No open-source license has been selected yet.
