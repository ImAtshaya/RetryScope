from fastapi import FastAPI

app = FastAPI(title="RetryScope")


@app.get("/health")
def health_check():
    return {"status": "ok"}