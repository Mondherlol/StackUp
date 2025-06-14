# StackUp

A modern, monorepo-based inventory management system that allows for recursive item relationships. Built with React and Node.js, StackUp provides an intuitive interface for managing complex, nested inventory structures—perfect for warehouses, workshops, or any scenario where items can contain other items.

## 🌟 Features

- **📦 Recursive Inventory Management**

  - Create and manage inventory items
  - Support for nested item hierarchies
  - Flexible item relationships

- **💻 Modern Tech Stack**

  - React-based frontend with modern UI/UX
  - Express.js backend with RESTful API
  - Monorepo structure using npm workspaces

- **🔄 Real-time Operations**
  - CRUD operations for all inventory items
  - Instant UI updates
  - Efficient state management

## 🛠 Tech Stack

### Frontend

- React
- Axios for API communication
- Modern UI components
- State management with React hooks

### Backend

- Node.js with Express
- RESTful API architecture
- MongoDB database (configurable)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- MongoDB (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/StackUp.git
   cd StackUp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development servers**

   ```bash
   # Start both frontend and backend
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`
   The backend API will be available at `http://localhost:5000`

## 📡 API Endpoints

The complete API documentation is available via Swagger UI at: `http://localhost:9091/api-docs`

The main API routes are:

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| GET    | /api/user      | User management      |
| GET    | /api/warehouse | Warehouse management |
| GET    | /api/bloc      | Block management     |
| GET    | /api/note      | Note management      |
| GET    | /api/tag       | Tag management       |

Each route has its own CRUD (Create, Read, Update, Delete) operations detailed in the Swagger documentation.

## 📝 Data Structure

```json
{
  "name": "Block name",
  "picture": "Image URL",
  "parent": "Parent block ID",
  "height": 100,
  "width": 50,
  "depth": 30,
  "weight": 25,
  "maxWeight": 100,
  "position": {
    "x": 0,
    "y": 0
  },
  "blocs": ["Sub-blocks IDs"],
  "tags": ["Tags IDs"],
  "customFields": [
    {
      "field": "Custom field ID",
      "value": "Field value"
    }
  ],
  "warehouse": "Warehouse ID",
  "notes": ["Notes IDs"],
  "addedBy": "User ID",
  "createdAt": "2024-03-21T10:00:00.000Z",
  "lastUpdate": "2024-03-21T10:00:00.000Z"
}
```

This structure represents a block in the system, which can contain other blocks (recursive structure) and be associated with tags, notes, and custom fields.

## 🎯 Use Cases

- **Warehouse Management**: Track items and their components
- **Assembly Management**: Manage product assembly hierarchies
- **Kit Management**: Track items that are sold together
- **Educational Purpose**: Learn about recursive data structures in full-stack applications

## 🗺 Roadmap

### Phase 1 (Completed)

- ✅ Basic CRUD operations for all entities
- ✅ User management system
- ✅ Warehouse management
- ✅ Block management with recursive structure
- ✅ Note system
- ✅ Tag system
- ✅ Custom fields support
- ✅ Position tracking for blocks
- ✅ Weight and dimension management

### Phase 2 (In Progress)

- ⬜ Advanced search and filtering
- ⬜ Bulk import/export functionality
- ⬜ Image optimization for block pictures
- ⬜ Enhanced custom fields management
- ⬜ Block movement history tracking
- ⬜ Warehouse capacity management
- ⬜ User roles and permissions system

### Phase 3 (Future)

- ⬜ Real-time collaboration features
- ⬜ Mobile application
- ⬜ QR code generation for blocks
- ⬜ Advanced analytics dashboard
- ⬜ Automated inventory suggestions
- ⬜ Integration with external systems
- ⬜ Multi-language support
- ⬜ API rate limiting and security enhancements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
