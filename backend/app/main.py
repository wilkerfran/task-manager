from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, tasks, labels

app = FastAPI(
    title="Task Manager API",
    version="1.0.0",
    description="API do gestor de tarefas",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(labels.router)

@app.get("/health")
def health():
    return {"status": "ok"}