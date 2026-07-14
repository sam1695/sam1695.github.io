# G1 Remote Development Setup (VS Code & SSH Guide)

This guide walks you through setting up Visual Studio Code (VS Code) on your personal PC to write, edit, and debug code directly on the Unitree G1 robot using an SSH connection.

---

## Why Use VS Code Remote-SSH?

While tools like NoMachine provide a full remote desktop experience it sometimes feel laggy and take a while to set up. 

Using VS Code with the Remote - SSH extension gives you the ability to:

- Write code inside your local VS Code instance.
- Edit files that live on the G1.
- Run terminals on the robot.
- Install and use VS Code extensions as if the code were local.
- Avoid graphical desktop overhead while maintaining a smooth development experience.

---

# Step 1: Install VS Code and the Remote Extension

## 1. Install Visual Studio Code

Download and install Visual Studio Code from:

https://code.visualstudio.com/

---

## 2. Install the Remote - SSH Extension

1. Open **VS Code**.
2. Click the **Extensions** icon on the left sidebar.
   - Keyboard shortcut:
     - **Windows/Linux:** `Ctrl + Shift + X`
     - **macOS:** `Cmd + Shift + X`
3. Search for:

```
Remote - SSH
```

4. Ensure the publisher is **Microsoft**.
5. Click **Install**.

---

# Step 2: Verify Your Network Connection

Before connecting through VS Code, verify your computer can communicate with the robot.

## 1. Connect the Ethernet Cable

Connect an Ethernet cable from your PC directly to the Ethernet port on the back of the G1's neck.

---

## 2. Verify Your Static IP Configuration

Configure your Ethernet adapter with a static IP similar to:

| Setting | Value |
|---------|-------|
| PC IP Address | `192.168.123.XXX` (example: `192.168.123.37`) |
| Subnet Mask | `255.255.255.0` |

---

## 3. Test Connectivity

Open a terminal (or Command Prompt on Windows) and run:

```bash
ping 192.168.123.164
```

If you receive replies similar to:

```text
Reply from 192.168.123.164 ...
```

then your network connection is working and you're ready to continue.

---

# Step 3: Connect VS Code to the Robot

## 1. Open the Remote Connection Menu

Inside VS Code, locate the **Remote Indicator** in the lower-left corner of the window.

It appears as:

```
><
```

Click this icon.

---

## 2. Connect to a Host

From the command palette that appears, select:

```
Connect to Host...
```

---

## 3. Add a New SSH Host

Choose:

```
Add New SSH Host...
```

---

## 4. Enter the SSH Command

Type the following exactly:

```text
ssh unitree@192.168.123.164
```

Press **Enter**.

---

## 5. Save the SSH Configuration

VS Code will ask where to save the SSH configuration.

Choose your default user SSH config file (typically the first option).

---

## 6. Connect

A notification will appear indicating the host has been added.

Click:

```
Connect
```

---

# Step 4: Work Inside the Robot Environment

A new VS Code window will automatically open.

---

## Select the Platform

If prompted for the remote operating system, select:

```
Linux
```

---

## Enter the Password

When prompted, enter:

```text
123
```

---

## Open Your Project Folder

1. Click **Open Folder** in the Explorer.
2. Browse the G1's Linux filesystem.
3. Open your desired project directory, for example:

```text
/home/unitree/
```

---

## Open a Remote Terminal

From the top menu, select:

```
Terminal → New Terminal
```

This terminal runs **directly on the G1**, allowing you to:

- Run Python scripts
- Compile ROS 2 packages
- Build C++ projects
- Launch nodes
- Execute shell commands

without leaving VS Code.

---

# ⚠️ Safety Reminder

Before executing or testing **any operational node or motion script** from your remote terminal:

- Ensure the G1 has sufficient clearance around all joints.
- Confirm the robot is in a safe operating environment.
- Verify no people or obstacles are within the robot's movement range.

Always prioritize safety before running code that commands physical motion.