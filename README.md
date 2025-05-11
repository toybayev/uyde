# uyde

# Activate virtual env
venv\Scripts\activate
source .venv/bin/activate 

# test
docker compose exec backend python manage.py test uyde_core
# test show apis
docker compose exec backend python manage.py test -v 2

# check redis cache:
1) docker exec -ti redis_container_id bash
2) redis-cli -n 1