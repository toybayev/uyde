# uyde

# Activate virtual env
venv\Scripts\activate
source .venv/bin/activate 

# check redis cache:
1) docker exec -ti redis_container_id bash
2) redis-cli -n 1