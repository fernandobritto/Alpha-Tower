#!/bin/bash

# Alpha Tower Docker Management Script
# Usage: ./scripts/docker.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker and docker-compose are installed
check_dependencies() {
    log_info "Checking dependencies..."

    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    log_success "Dependencies check passed!"
}

# Development environment
dev_up() {
    log_info "Starting development environment..."
    cp .env.docker .env
    docker-compose up --build -d postgres redis

    log_info "Waiting for database to be ready..."
    sleep 10

    docker-compose up --build api
}

dev_down() {
    log_info "Stopping development environment..."
    docker-compose down
}

dev_restart() {
    log_info "Restarting development environment..."
    dev_down
    dev_up
}

# Production environment
prod_up() {
    log_info "Starting production environment..."
    docker-compose --profile production up --build -d
    log_success "Production environment started!"
}

prod_down() {
    log_info "Stopping production environment..."
    docker-compose --profile production down
}

# Database operations
db_migrate() {
    log_info "Running database migrations..."
    docker-compose exec api yarn database:run
    log_success "Migrations completed!"
}

db_seed() {
    log_info "Seeding database..."
    log_warning "No seed command configured yet."
}

db_backup() {
    log_info "Creating database backup..."
    BACKUP_FILE="backup/alpha_tower_$(date +%Y%m%d_%H%M%S).sql"
    mkdir -p backup
    docker-compose exec postgres pg_dump -U alpha_user alpha_tower > $BACKUP_FILE
    log_success "Database backup created: $BACKUP_FILE"
}

db_restore() {
    if [ -z "$1" ]; then
        log_error "Please specify backup file: ./scripts/docker.sh db:restore <backup_file>"
        exit 1
    fi

    log_info "Restoring database from $1..."
    docker-compose exec -T postgres psql -U alpha_user alpha_tower < $1
    log_success "Database restored from $1"
}

# Utility functions
logs() {
    SERVICE=${1:-api}
    log_info "Showing logs for $SERVICE..."
    docker-compose logs -f $SERVICE
}

shell() {
    SERVICE=${1:-api}
    log_info "Opening shell in $SERVICE container..."
    docker-compose exec $SERVICE sh
}

cleanup() {
    log_info "Cleaning up Docker resources..."
    docker-compose down
    docker system prune -f
    docker volume prune -f
    log_success "Cleanup completed!"
}

# Show help
show_help() {
    echo "Alpha Tower Docker Management Script"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Development Commands:"
    echo "  dev:up      Start development environment"
    echo "  dev:down    Stop development environment"
    echo "  dev:restart Restart development environment"
    echo ""
    echo "Production Commands:"
    echo "  prod:up     Start production environment"
    echo "  prod:down   Stop production environment"
    echo ""
    echo "Database Commands:"
    echo "  db:migrate  Run database migrations"
    echo "  db:seed     Seed database with initial data"
    echo "  db:backup   Create database backup"
    echo "  db:restore  Restore database from backup"
    echo ""
    echo "Utility Commands:"
    echo "  logs [service]   Show logs (default: api)"
    echo "  shell [service]  Open shell in container (default: api)"
    echo "  cleanup         Clean up Docker resources"
    echo "  help           Show this help message"
}

# Main command handler
main() {
    check_dependencies

    case "${1:-help}" in
        "dev:up")
            dev_up
            ;;
        "dev:down")
            dev_down
            ;;
        "dev:restart")
            dev_restart
            ;;
        "prod:up")
            prod_up
            ;;
        "prod:down")
            prod_down
            ;;
        "db:migrate")
            db_migrate
            ;;
        "db:seed")
            db_seed
            ;;
        "db:backup")
            db_backup
            ;;
        "db:restore")
            db_restore "$2"
            ;;
        "logs")
            logs "$2"
            ;;
        "shell")
            shell "$2"
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function with all arguments
main "$@"
