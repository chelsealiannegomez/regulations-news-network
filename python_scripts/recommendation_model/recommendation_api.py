from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from vector_search import demonstrate_search

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
    "https://regulations-news-network.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow only these origins
    allow_credentials=True,
    allow_methods=["*"],    # allow all methods (GET, POST, etc)
    allow_headers=["*"],    # allow all headers
)

class QueryParams(BaseModel):
    query: str

@app.post("/recommendation_model")
async def get_recommendation(data: QueryParams):
    if not data.query:
        raise HTTPException(status_code=400, detail="Query missing")
    results = demonstrate_search(data.query)
    return {"results": results}