import urllib.request
import urllib.error
import json
import time
import subprocess
import os

BASE_URL = "http://127.0.0.1:8000"

def create_student():
    data = json.dumps({
        "name": "Persistence Test Student",
        "age": 18,
        "grade": "12th Grade",
        "location": "Test City",
        "interests": ["Testing", "MongoDB"]
    }).encode('utf-8')
    req = urllib.request.Request(f"{BASE_URL}/student/", data=data, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode())['_id']

def verify_student_exists(student_id):
    req = urllib.request.Request(f"{BASE_URL}/student/")
    with urllib.request.urlopen(req) as response:
        students = json.loads(response.read().decode())
        return any(s.get('_id') == student_id for s in students)

print("Starting persistence test...")

# 1. Create a record
print("Creating test student...")
student_id = create_student()
print(f"Created student with ID: {student_id}")

# 2. Verify it exists
print("Verifying student exists via API...")
exists = verify_student_exists(student_id)
assert exists, "Student was not found after creation!"
print("Success: Student found.")

# 3. Restart the backend
print("Restarting backend server to verify persistence...")
# Find the process using port 8000
try:
    cmd = 'netstat -ano | findstr :8000'
    output = subprocess.check_output(cmd, shell=True).decode()
    for line in output.split('\n'):
        if 'LISTENING' in line:
            pid = line.strip().split()[-1]
            subprocess.call(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            break
except Exception as e:
    print("Could not kill backend:", e)

time.sleep(2)

# Start backend again
proc = subprocess.Popen(['python', '-m', 'uvicorn', 'backend.main:app', '--port', '8000'], cwd=os.getcwd(), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
time.sleep(4) # Wait for it to start

# 4. Verify it still exists
print("Verifying student STILL exists after restart...")
try:
    exists_after_restart = verify_student_exists(student_id)
    assert exists_after_restart, "Student was LOST after restart!"
    print("Success: Student survived restart!")
    print("MONGODB PERSISTENCE FULLY VERIFIED.")
finally:
    proc.kill()
