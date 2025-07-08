from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from vector_search import demonstrate_search, articles_per_page

app = FastAPI()

origins = [
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
    "https://regulations-news-network.vercel.app",
    "https://regulations-news-networ-git-3d15f3-chelsealiannegomezs-projects.vercel.app/"
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
    page_num: int
    num_articles_per_page: int
    
@app.post("/page_ordered_articles")
async def get_page_ordered_articles(data: QueryParams):
    print(data)
    if not data.query:
        raise HTTPException(status_code=400, detail="Query missing")
    if not data.page_num:
        raise HTTPException(status_code=400, detail="Page number missing")
    if not data.num_articles_per_page:
        raise HTTPException(status_code=400, detail="Number of articles per page missing")
    results = articles_per_page(data.page_num, data.num_articles_per_page, data.query)
    return {"results": results}