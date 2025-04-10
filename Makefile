audit:
	docker compose run --rm frontend-build sh -c "npm audit"

audit-fix:
	docker compose run --rm frontend-build sh -c "npm audit fix"

build:
	docker compose run --rm frontend-build sh -c "npm install -g npm@latest && npm install && npm run build"

up:
	make build && docker compose up -d caddy

restart:
	docker compose restart caddy

logs:
	docker compose logs -f caddy

ps:
	docker compose ps -a 
