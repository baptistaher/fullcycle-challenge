# Communication Systems
This module explores different communication strategies between systems and services, focusing on protocols, patters, and trade-offs commonly used in distributed architectures.

The goal is to understand when and why to choose each communication model, considering aspects like performance, scalability, coupling, discoverability and developer experience.

## Included Technologies
### Consul
Service discovery and configuration management using **HashiCorp Consul**.
- Dynamic service registration
- Health checks
- Service-to-service discovery
- Infrastructure-level communication support

Use case:
Ideal for microservices environments where services need to discover each other dynamically without hardcoded addresses


## GraphQL
API communication using **GraphQL** as an alternative to REST
- Single endpoint for multiple resources
- Strongly typed schema
- Client-driven data fetching
- Reduced over-fetching and under-fetching
  
Use case:
Best suited for frontend-to-backend communication  where flexibility and optimized payloads are critical


## gRPC
High-performance communication using **gRPC** and **Protocol Buffers**
- Binary serialization (Protobuf)
- Contract-first APIs
- Bi-directional streaming
- Low latency and high throughput

Use case:
Excellent for service-to-service communication in microservices, especially in performance-sensitive systems.