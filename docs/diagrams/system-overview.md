# Student Result Management System - Main Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🎨 Frontend
    participant B as ⚙️ Backend
    participant D as 🗄️ Database
    
    U->>F: Fill Student Form
    F->>B: POST /api/students/create
    B->>B: Validate Data
    B->>D: Save Student
    D->>B: Return Success
    B->>F: JSON Response
    F->>U: Show Success Message