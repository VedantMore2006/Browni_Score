import requests
import time

BASE_URL = "http://localhost:8000"

def run_tests():
    print("--- Starting End-to-End API Tests ---")
    
    # Wait for server to be ready
    try:
        requests.get(f"{BASE_URL}/docs")
    except requests.ConnectionError:
        print("Server not running on port 8000!")
        return

    # 1. Seed the DB
    print("\n1. Seeding the DB...")
    res = requests.post(f"{BASE_URL}/admin/seed-members")
    if res.status_code == 200:
        print("✅ DB Seeded successfully:", res.json())
    elif res.status_code == 400:
        print("✅ DB already seeded")
    else:
        print("❌ Seed failed:", res.status_code, res.text)
        
    # 2. Login
    print("\n2. Logging in as Admin...")
    res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "password"})
    if res.status_code == 401:
        res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "admin"})
    if res.status_code == 401:
        res = requests.post(f"{BASE_URL}/auth/login", json={"username": "admin", "password": "hunter123"})
    if res.status_code == 200:
        token = res.json().get("access_token")
        print("✅ Logged in. Token received.")
    else:
        print("❌ Login failed:", res.status_code, res.text)
        return
        
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Fetch Members
    print("\n3. Fetching members...")
    res = requests.get(f"{BASE_URL}/members", headers=headers)
    if res.status_code == 200:
        members = res.json()
        print(f"✅ Fetched {len(members)} members.")
    else:
        print("❌ Fetch members failed:", res.status_code, res.text)
        
    # 4. Fetch Projects
    print("\n4. Fetching projects...")
    res = requests.get(f"{BASE_URL}/projects", headers=headers)
    if res.status_code == 200:
        projects = res.json()
        print(f"✅ Fetched {len(projects)} projects.")
        project_id = projects[0]["id"] if projects else None
    else:
        print("❌ Fetch projects failed:", res.status_code, res.text)
        project_id = None
        
    # 5. Create a Project if none
    if not project_id:
        print("\nCreating a project...")
        res = requests.post(f"{BASE_URL}/projects", json={"name": "Vitals Portal UI", "description": "Phase 4 Wiring", "lead_id": members[0]["id"]}, headers=headers)
        if res.status_code == 200:
            project_id = res.json()["id"]
            print("✅ Created project:", project_id)
        else:
            print("❌ Create project failed:", res.status_code, res.text)
            
    # 6. Create a Task
    if project_id:
        print("\n6. Creating a task...")
        payload = {
            "title": "Wire Login Page",
            "description": "Implement api.js in login.html",
            "type": "feature",
            "points": 500,
            "status": "completed",
            "assigned_to": members[1]["id"],
            "project_id": project_id
        }
        res = requests.post(f"{BASE_URL}/tasks", json=payload, headers=headers)
        if res.status_code == 200:
            task_id = res.json()["id"]
            print("✅ Created task:", task_id)
        else:
            print("❌ Create task failed:", res.status_code, res.text)
            task_id = None
            
        # 7. Rate Task
        if task_id:
            print("\n7. Rating the task...")
            payload = {
                "rating": "exceeds"
            }
            res = requests.post(f"{BASE_URL}/tasks/{task_id}/rate", json=payload, headers=headers)
            if res.status_code == 200:
                print("✅ Task rated. Earned points:", res.json().get("earned_points", 0))
            else:
                print("❌ Rate task failed:", res.status_code, res.text)
                
    # 8. Check Leaderboard
    print("\n8. Checking leaderboard...")
    res = requests.get(f"{BASE_URL}/leaderboard/weekly", headers=headers)
    if res.status_code == 200:
        lb = res.json()
        print(f"✅ Leaderboard fetched. Top member: {lb[0]['name'] if lb else 'None'}")
    else:
        print("❌ Leaderboard failed:", res.status_code, res.text)

if __name__ == "__main__":
    run_tests()
