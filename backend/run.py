import os
from pathlib import Path

import uvicorn


BACKEND_DIR = Path(__file__).resolve().parent

def start():
    # Uvicorn's reload child imports ``app.main`` from the process working
    # directory.  Make this independent of the terminal's current folder.
    os.chdir(BACKEND_DIR)
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        # The React application is configured to call port 8000.
        port=8000,
        # Development server: reload application code after a saved change.
        reload=True,
        reload_dirs=[str(BACKEND_DIR)],
    )
    

if __name__ == "__main__":
    start()
