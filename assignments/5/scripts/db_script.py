import requests
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = os.getenv("MOVIE_API_KEY")

title = "over the hedge"

url = f"http://www.omdbapi.com/?apikey={API_KEY}&t={title}"

response = requests.get(url).json()

print(response)