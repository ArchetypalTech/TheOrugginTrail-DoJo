<p align="center">
  <h1 align="center">ZORG Contracts</h1>
</p>
<p align="center">
Dojo smart contracts powering the onchain mechanics of The Oruggin Trail.
</p>
<p align="center">
Where the adventure truly lives...
</p>

## ⚡ Setup

#### 📦 Install dependencies

```bash
bun install
```

### 🚀 Deployment and Management

Deploy contracts to slot:

```bash
bun run slot:deploy
```

Upgrade existing slot deployment:

```bash
bun run slot:upgrade
```

Watch for contract changes:

```bash
bun run slot:watch
```

### 🏗️ Architecture

This package contains the Cairo smart contracts that power The Oruggin Trail's onchain mechanics using the Dojo engine. The contracts define the game's core systems, entities, and logic.

### 🛠️ Technologies

| **Technology** | **Purpose**               |
| -------------- | ------------------------- |
| Dojo           | Onchain game engine       |
| Cairo          | Smart contract language   |
| StarkNet       | Layer 2 scaling solution  |
| Scarb          | Package manager for Cairo |
