## Simple PLY file loader
A simple web app, that loads PLY file and displays a point cloud defined in it. There is an option to load JSON file that defines color code of the point cloud.

### Requirements
`Python 3.7+`

### Running the code
In this folder do the following:
1. Create and activate virtual environment

```shell
python -m venv your_venv
source your_venv/bin/activate
python -m pip install -r requirements.txt
```
2. Run the server
```shell
uvicorn main:app
```
3. Navigate in the browser to `http://127.0.0.1:8000`