# G1 Remote Desktop Setup (NoMachine)

This guide walks you through setting up a remote desktop connection to the Unitree G1 robot using NoMachine. You will need a direct ethernet connection. 
 
NoMachine streams the robot's internal desktop directly onto your PC screen. This allows you to interact with the G1's environment (opening terminals, managing files, and running scripts) in real-time using your own laptop just as though you had a physical monitor plugged directly into the robot.

---

## Step 1: Download NoMachine & Prepare the Robot

1. **Download NoMachine:** Download and install NoMachine on your personal computer from the official website:
    [https://www.nomachine.com/](https://www.nomachine.com/)
2. **Physical Setup:** 
   * Connect an Ethernet cable directly from your PC into any of the two available Ethernet ports located on the back of the G1's neck.
   * Turn on the G1. 
   * *Safety Note:* It is highly recommended to suspend the G1 from its gantry with its feet touching the ground before powering it on. 

---

## Step 2: Configure Your PC Network Settings

To communicate with the robot's onboard network, you must manually assign a static IP address to your PC's Ethernet interface.

1. Open your PC's network connections or adapter settings.
2. Select your **Ethernet** adapter and choose to configure its properties (specifically **IPv4** settings).
3. Change the IP assignment from automatic (DHCP) to **Manual / Static**.
4. Configure the settings exactly as follows:
   * **IP Address:** `192.168.123.XXX` (Replace `XXX` with any number between 2 and 254, such as `37`, ensuring it does not conflict with existing G1 hardware addresses).
   * **Subnet Mask:** `255.255.255.0`
   * **Gateway:** *Leave blank*

---

## Step 3: Connect to the G1 Computer & Launch NoMachine

1. Open a **Terminal** (macOS/Linux) or **Command Prompt** (Windows) on your PC.
2. Log into the G1's onboard computer via SSH by entering:
   ```bash
   ssh unitree@192.168.123.164
3. When prompted for a password, enter 123
4. When asked which ROS version to use, enter 1 (roxy)
5. Type ./nomachine.sh and press enter. This will launch the NoMachine script, allowing you to connect to the NoMachine application on your computer. If you are asked for a password, it will be 123. 


## Using NoMachine

1. Launch your NoMachine application from your laptop. 
2. Click the ubuntu option 
3. You will be prompted for a username and password (unitree and 123). 
4. You might get a message saying you do not have a display, and ask if you'd like to create one now. Click yes. 
5. There are additional messages relating to more settings. Once you get through them you can interface directly with the robot's computer. 


