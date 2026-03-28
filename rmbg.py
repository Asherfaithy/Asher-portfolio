import shutil
from gradio_client import Client, handle_file

print("Connecting to BriaAI RMBG HuggingFace Space...")
try:
    client = Client("briaai/BRIA-RMBG-1.4")
    print("Uploading image for background removal...")
    result = client.predict(
        handle_file('asher-photo.jpg'),
        api_name="/predict"
    )
    # The result is usually a tuple where [0] is the output PIL image
    # depending on the gradio interface API. 
    # Let's check the API spec if we can. Most return the file path directly.
    # BriaAI specifically returns the filepath string for the image output.
    if isinstance(result, tuple) or isinstance(result, list):
        out_path = result[0]
    else:
        out_path = result
    
    shutil.copy(out_path, 'asher-photo-nobg.png')
    print("Background removed successfully: asher-photo-nobg.png")
except Exception as e:
    print(f"Error during background removal: {e}")
