curl -X POST http://localhost:5050/v1/audio/speech \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_api_key_here" \
  -d '{
    "input": "Hello, I am your AI assistant!",
    "voice": "alloy",
    "response_format": "mp3",
    "speed": 1.1
  }' \
  --output speech.mp3