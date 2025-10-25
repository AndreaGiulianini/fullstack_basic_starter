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
WATCH_MODE=false
CLEAN_BUILD=false

# Function to display help
show_help() {
    echo -e "${BLUE}Docker Compose Starter Script${NC}"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -e, --env ENVIRONMENT    Set environment (development|production) [default: development]"
    echo "  -w, --watch             Enable watch mode for development"
    echo "  -c, --clean             Clean build (remove existing containers and images)"
    echo "  -h, --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                      # Start in development mode"
    echo "  $0 -e production        # Start in production mode"
    echo "  $0 -w                   # Start in development with watch mode"
    echo "  $0 -e production -c     # Clean build in production mode"
    echo ""
}

# Function to validate environment
validate_environment() {
    if [[ ! -f "compose_override/${ENVIRONMENT}.yaml" ]]; then
        echo -e "${RED}Error: compose_override/${ENVIRONMENT}.yaml not found!${NC}"
        echo -e "${YELLOW}Available environments:${NC}"
        ls compose_override/*.yaml 2>/dev/null | sed 's/compose_override\///g' | sed 's/\.yaml//g' | sed 's/^/  - /'
        exit 1
    fi
}

# Function to clean up existing containers and images
clean_build() {
    echo -e "${YELLOW}Cleaning up existing containers and images...${NC}"
    docker compose $COMPOSE_FLAGS down --volumes --remove-orphans
    docker system prune -f
    echo -e "${GREEN}Cleanup completed!${NC}"
}

# Function to setup compose files
setup_compose_files() {
    echo -e "${BLUE}Configuring compose files for ${ENVIRONMENT} environment...${NC}"
    
    # Set compose files array
    COMPOSE_FILES=("compose.yaml" "compose_override/${ENVIRONMENT}.yaml")
    
    # Build the -f flags
    COMPOSE_FLAGS=""
    for file in "${COMPOSE_FILES[@]}"; do
        COMPOSE_FLAGS="$COMPOSE_FLAGS -f $file"
    done
    
    echo -e "${GREEN}Using compose files: ${COMPOSE_FILES[*]}${NC}"
}

# Function to start services
start_services() {
    echo -e "${BLUE}Starting services...${NC}"
    
    if [[ "$WATCH_MODE" == true && "$ENVIRONMENT" == "development" ]]; then
        echo -e "${YELLOW}Starting in watch mode for development...${NC}"
        docker compose $COMPOSE_FLAGS down && docker compose $COMPOSE_FLAGS watch
    else
        echo -e "${YELLOW}Starting with build...${NC}"
        docker compose $COMPOSE_FLAGS down && docker compose $COMPOSE_FLAGS up --build
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--env)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -w|--watch)
            WATCH_MODE=true
            shift
            ;;
        -c|--clean)
            CLEAN_BUILD=true
            shift
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

# Main execution
echo -e "${BLUE}=== Docker Compose Starter ===${NC}"
echo -e "Environment: ${GREEN}${ENVIRONMENT}${NC}"
echo -e "Watch mode: ${GREEN}${WATCH_MODE}${NC}"
echo -e "Clean build: ${GREEN}${CLEAN_BUILD}${NC}"
echo ""

# Validate environment
validate_environment

# Setup compose files
setup_compose_files

# Clean build if requested
if [[ "$CLEAN_BUILD" == true ]]; then
    clean_build
fi

# Start services
start_services

