curl -X POST https://accounts.spotify.com/api/token \
  -d grant_type=authorization_code \
  -d code=AQCGJuTktGXWuArEW_LUeGdFNjd0wGaB_hiA8AA5dPlwyiQWEl089FUcY_9fJnTlnQc5-NudJwMRGzhSVwgvIkVn2hvPdQ4yHinxPjkIhXW-JI8rqJZFL5YgPqGnG9Ok1vzN5IX7Z_MYCLCke_QRrc9WiVKOAtFSEULTIYChPu48UPGn6XubevuKa0RV7YyrMu1f1Oi4tF4wb4gVDAnDeyBmX9MELLSyzHa_3B3e5CMYf2rqZeCEgfGqVHbB7VvsAaaOaw \
  -d redirect_uri=http://127.0.0.1:5173/callback \
  -d client_id=02b60ec693e04348aa44672244510a80 \
  -d client_secret=7b65e4d57aae41c9aa67fcc993ad1677