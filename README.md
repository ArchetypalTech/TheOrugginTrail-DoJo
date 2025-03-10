<p align="center">
  <h1 align="center">The Oruggin Trail</h1>
</p>
<p align="center">
A Dojo based Zork inspired composable fully onchain text adventure engine.
</p>
<p align="center">
What lies ahead, is anyone's guess...
</p>

<p align="center" style="max-width: 50%;">
    <img src="https://github.com/ArchetypalTech/TheOrugginTrail/assets/983878/b90bcc55-2ba1-4564-94e1-d08184c1e49c"/></a>
</p>

## ⚡ Setup

#### 📦 Install the repo with [Bun](https://bun.sh)

Clone the repository, then install dependencies with [Bun](https://bun.sh)

```bash
bun install
```

### 💕 Quickstart installer:

Automated installer for installing [scarb](https://github.com/software-mansion/scarb) and [dojo](https://book.dojoengine.org/getting-started#install-using-asdf) using [asdf](https://asdf-vm.com/) and [homebrew](https://brew.sh/).

```bash
bun run quickstart
```

### 🕹️ Run development mode:

Local development:

```bash
bun run dev
```

Slot development:

```bash
bun run dev:slot
```

### 🗺️ World deployment:

Initial deployments start with an empty world, use the editor at `http://localhost:5173/editor` to create and publish a world.

### 🔧 Manual dependency installation:

```bash
brew install asdf
asdf plugin add scarb
asdf plugin add dojo https://github.com/dojoengine/asdf-dojo

asdf install scarb <version>
asdf install dojo <version>
```

### 📦 Packages

This is a monorepo containing the following packages:

| **Package** | **Description** |
| ----------- | --------------- |
| `client`    | Game client     |
| `contracts` | Dojo contracts  |

![ad_2_final](https://github.com/ArchetypalTech/TheOrugginTrail/assets/983878/b90bcc55-2ba1-4564-94e1-d08184c1e49c)
