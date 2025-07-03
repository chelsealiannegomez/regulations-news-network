from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from vector_search import demonstrate_search

app = FastAPI()

class QueryParams(BaseModel):
    query: str

@app.post("/recommendation_model")
async def get_recommendation(data: QueryParams):
    if not data.query:
        raise HTTPException(status_code=400, detail="Query missing")
    results = demonstrate_search(data.query)
    return {"results": results}