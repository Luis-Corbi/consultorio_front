# consultorio-front
Windows
    py -m venv venv
    Activate : .\venv\scripts\activate
Linux
    python3 -m venv venv
    source venv/bin/activate
    
Then install the libraries

pip install -r requirements.txt
Execute

uvicorn app:app --reload