from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from vector_search import articles_per_page, articles_per_page_by_date

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
    locations: str

class DateParams(BaseModel):
    page_num: int
    num_articles_per_page: int
    locations: str
    
@app.post("/page_ordered_articles")
async def get_page_ordered_articles(data: QueryParams):
    if not data.query:
        raise HTTPException(status_code=400, detail="Query missing")
    if not data.page_num:
        raise HTTPException(status_code=400, detail="Page number missing")
    if not data.num_articles_per_page:
        raise HTTPException(status_code=400, detail="Number of articles per page missing")
    if not data.locations:
        raise HTTPException(status_code=400, detail="Locations missing")
    results, total_articles = articles_per_page(data.page_num, data.num_articles_per_page, data.query, data.locations)
    return {"results": results, "total_articles": total_articles}


@app.post("/page_date_articles")
async def get_page_ordered_articles(data: DateParams):
    if not data.page_num:
        raise HTTPException(status_code=400, detail="Page number missing")
    if not data.num_articles_per_page:
        raise HTTPException(status_code=400, detail="Number of articles per page missing")
    if not data.locations:
        raise HTTPException(status_code=400, detail="Locations missing")
    results, total_articles = articles_per_page_by_date(data.page_num, data.num_articles_per_page, data.locations)
    return {"results": results, "total_articles": total_articles}