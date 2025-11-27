#!/bin/bash

set -eu

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
ENVIRONMENT="development"
CREATE_MIGRATION=false
MIGRATION_NAME=""

# Function to display help
show_help() {
    echo -e "${BLUE}Database Migration Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT    Set environment (development|production) [default: development]"
    echo "  -c, --create NAME        Create a new migration with the specified name"
    echo "  -h, --help               Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                       # Apply pending migrations"
    echo "  $0 -c AddNewFeature      # Create a new migration named 'AddNewFeature'"
    echo "  $0 -e production         # Apply migrations in production environment"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -c|--create)
            CREATE_MIGRATION=true
            MIGRATION_NAME="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            show_help
            exit 1
            ;;
    esac
done

# Set compose files
COMPOSE_CMD="docker compose -f compose.yaml -f compose_override/${ENVIRONMENT}.yaml"

echo -e "${BLUE}=== Database Migration Script ===${NC}"
echo -e "Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo ""

# Wait for the database to be ready
echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
until docker exec postgres_db pg_isready -U "${DB_USER:-postgres}" > /dev/null 2>&1; do
    echo -e "${YELLOW}PostgreSQL is unavailable - sleeping${NC}"
    sleep 2
done
echo -e "${GREEN}PostgreSQL is ready!${NC}"

if [[ "$CREATE_MIGRATION" == true ]]; then
    # Create a new migration
    if [[ -z "$MIGRATION_NAME" ]]; then
        echo -e "${RED}Error: Migration name is required when using -c/--create${NC}"
        exit 1
    fi
    echo -e "${BLUE}Creating new migration: ${MIGRATION_NAME}...${NC}"
    $COMPOSE_CMD exec -T api dotnet ef migrations add "$MIGRATION_NAME" --project Api.Infrastructure --startup-project Api
    echo -e "${GREEN}Migration '${MIGRATION_NAME}' created successfully!${NC}"
else
    # Apply pending migrations
    echo -e "${BLUE}Applying pending EF Core migrations...${NC}"
    $COMPOSE_CMD exec -T api dotnet ef database update --project Api.Infrastructure --startup-project Api
    echo -e "${GREEN}Database migration completed successfully!${NC}"
fi
