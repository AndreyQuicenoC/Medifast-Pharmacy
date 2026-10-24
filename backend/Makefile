.PHONY: install install-dev lint format test coverage security complexity docs ci quality

install:
	python -m pip install --upgrade pip
	pip install -r requirements.txt

install-dev: install
	pip install -r requirements-dev.txt

lint:
	ruff check apps config tests scripts/deploy scripts/setup
	ruff format --check apps config tests scripts/deploy scripts/setup

format:
	ruff format apps config tests scripts/deploy scripts/setup
	ruff check --fix apps config tests scripts/deploy scripts/setup

test:
	pytest

coverage:
	pytest --cov=apps --cov=config --cov-report=term-missing --cov-fail-under=68

security:
	bandit -r apps config -c pyproject.toml -x apps/operations/views.py -x apps/identity/views.py -x apps/operations/estadisticas_views.py
	pip-audit -r requirements.txt

complexity:
	radon cc apps config -a -nb --total-average

docs:
	interrogate apps config -c pyproject.toml

django-check:
	python manage.py check
	python manage.py migrate --noinput

quality: lint django-check test coverage security complexity docs

ci: quality
