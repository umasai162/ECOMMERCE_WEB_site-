# System Architecture Diagram

This diagram provides a simplified view of how the E-commerce application and its AI Assistant Agent are structured and how they interact.

```mermaid
graph TD
    %% User and Frontend
    User([End User]) -->|Interacts| UI[React Frontend + Agent Widget]
    
    %% API Gateway and Backend
    UI -->|HTTP Requests| API[FastAPI Backend]
    
    subgraph "Backend Services"
        API -->|Route: /api| Core[Core E-commerce Service]
        API -->|Route: /agent| Agent[AI Agent Service]
        
        %% Agent Orchestration
        subgraph "LangGraph Agent Workflow"
            Agent <-->|Step 1: Parse & Decide| Brain[Gemini 2.5 LLM]
            Agent -->|Step 2: Execute| Tools[Agent Tools]
        end
        
        %% Tool Interactions
        Tools -->|Query/Update| Core
        
        %% Functional Modules
        Core --- Auth[Authentication]
        Core --- Prod[Product Catalog]
        Core --- Orders[Order Management]
    end
    
    %% Data Layer
    subgraph "Persistence Layer"
        Core -->|Read/Write| DB[(PostgreSQL - Neon)]
        Agent -->|Save History| DB
    end

    %% Styles
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef db fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px;
    
    class UI frontend;
    class API,Core,Agent,Tools,Auth,Prod,Orders backend;
    class Brain ai;
    class DB db;
```

## Component Breakdowns

### 1. **React Frontend**
The user interface built with React, featuring a dedicated **Agent Widget** for natural language shopping assistance.

### 2. **FastAPI Backend**
A unified backend serving both core e-commerce REST APIs and the intelligent agent endpoints.

### 3. **AI Agent Service (LangGraph)**
Orchestrates the conversation flow using **LangGraph**. It manages state, maintains conversation history, and handles the logic for when to call external LLMs or internal tools.

### 4. **Agent Tools**
Bridge the GAP between the LLM and the application's data. Tools include:
- **Search Products**: Queries the database for relevant items.
- **Manage Cart**: Adds or removes items from the user's active session.
- **Checkout**: Finalizes the order process.

### 5. **PostgreSQL (Neon DB)**
The central source of truth, storing:
- **Core Data**: Users, Product Catalog, and Orders.
- **Agent Data**: Conversational history and session metadata for context-aware interactions.

### 6. **Gemini 2.5 LLM**
The brain behind the agent, responsible for understanding user intent and generating human-like responses.
