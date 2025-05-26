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

| Method | Endpoint         | Description           |
|--------|-----------------|----------------------|
| GET    | /api/items      | Retrieve all items    |
| GET    | /api/items/:id  | Get item by ID       |
| POST   | /api/items      | Create a new item    |
| PUT    | /api/items/:id  | Update an item       |
| DELETE | /api/items/:id  | Delete an item       |

## 📝 Data Structure

```json
{
  "id": "item123",
  "name": "Toolbox",
  "description": "Metal toolbox containing hand tools",
  "children": [
    {
      "id": "item456",
      "name": "Hammer",
      "description": "Steel hammer"
    },
    {
      "id": "item789",
      "name": "Screwdriver Set",
      "description": "Set of flat and Phillips screwdrivers"
    }
  ]
}
```

## 🎯 Use Cases

- **Warehouse Management**: Track items and their components
- **Assembly Management**: Manage product assembly hierarchies
- **Kit Management**: Track items that are sold together
- **Educational Purpose**: Learn about recursive data structures in full-stack applications

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Basic CRUD operations
- ✅ Recursive item support
- ✅ Monorepo setup

### Phase 2 (Upcoming)
- ⬜ User authentication
- ⬜ Role-based access control
- ⬜ Bulk import/export
- ⬜ Advanced search and filtering

### Phase 3 (Future)
- ⬜ Drag-and-drop UI
- ⬜ Real-time collaboration
- ⬜ Activity logging
- ⬜ Analytics dashboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.



