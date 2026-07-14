# Unitree G1 Robot Motion Control Guide (Samantha Belano)

## Overview
This guide explains how to control the Unitree G1 humanoid robot's movements using the Unitree SDK. The example demonstrates a "dab" motion, but the principles apply to any custom movement.

---

## Code Structure

### 1. Imports and Constants

```python
from unitree_sdk2py.core.channel import ChannelPublisher, ChannelSubscriber
from unitree_sdk2py.idl.default import unitree_hg_msg_dds__LowCmd_
from unitree_sdk2py.idl.unitree_hg.msg.dds_ import LowCmd_, LowState_
```

**Key Constants:**
- `kPi = 3.141592654` - Full circle (180°)
- `kPi_2 = 1.57079632` - Quarter circle (90°)

---

## G1JointIndex Class

Defines all joint indices on the robot. The G1 has up to 29 degrees of freedom (DOF).

### Joint Categories:

**Legs (12 joints):**
- Each leg: Hip (Pitch/Roll/Yaw), Knee, Ankle (Pitch/Roll)
- Indices 0-11

**Waist (3 joints):**
- WaistYaw (12), WaistRoll (13), WaistPitch (14)
- Note: Locked on 23/29 DOF models

**Arms (14 joints):**
- Each arm: Shoulder (Pitch/Roll/Yaw), Elbow, Wrist (Roll/Pitch/Yaw)
- Left arm: 15-21
- Right arm: 22-28
- Note: Wrist Pitch/Yaw invalid on 23 DOF model

**Special:**
- `kNotUsedJoint = 29` - Used as arm SDK enable/disable flag

---

## Custom Class - Main Control Logic

### Constructor (`__init__`)

**Timing Parameters:**
```python
self.control_dt_ = 0.02      # Control loop interval (50 Hz)
self.duration_ = 2.0         # Base time unit for motion stages
self.time_ = 0.0             # Elapsed time tracker
```

**Control Parameters:**
```python
self.kp = 60.0               # Position gain (stiffness)
self.kd = 1.5                # Damping gain (resistance to velocity)
self.tau_ff = 0.0            # Feedforward torque
self.dq = 0.0                # Target velocity
```

**Motion Definition:**
```python
self.dab_pos = [...]         # Target joint positions (radians)
self.arm_joints = [...]      # List of joints to control
```

The `dab_pos` array contains target angles for each joint in the `arm_joints` list.

---

### Init() - Setup Communications

```python
def Init(self):
    # Publisher: Sends commands TO the robot
    self.arm_sdk_publisher = ChannelPublisher("rt/arm_sdk", LowCmd_)
    self.arm_sdk_publisher.Init()
    
    # Subscriber: Receives state FROM the robot
    self.lowstate_subscriber = ChannelSubscriber("rt/lowstate", LowState_)
    self.lowstate_subscriber.Init(self.LowStateHandler, 10)
```

**Key Channels:**
- `"rt/arm_sdk"` - Arm command channel
- `"rt/lowstate"` - Robot state feedback channel

---

### Start() - Begin Control Loop

```python
def Start(self):
    # Create control thread at specified interval
    self.lowCmdWriteThreadPtr = RecurrentThread(
        interval=self.control_dt_, 
        target=self.LowCmdWrite,
        name="control"
    )
    
    # Wait for first state update
    while self.first_update_low_state == False:
        time.sleep(1)
    
    # Start control loop
    self.lowCmdWriteThreadPtr.Start()
```

Waits until robot state is received before starting control.

---

### LowStateHandler() - State Callback

```python
def LowStateHandler(self, msg: LowState_):
    self.low_state = msg  # Store current robot state
    
    if self.first_update_low_state == False:
        self.first_update_low_state = True
```

Called automatically when new state data arrives. Provides current joint positions, velocities, and torques.

---

### LowCmdWrite() - Main Control Function

This function executes every `control_dt_` (0.02s). It implements a **staged motion sequence**:

#### **Stage 1: Move to Neutral (0 - 2s)**
```python
if self.time_ < self.duration_:
    ratio = np.clip(self.time_ / self.duration_, 0.0, 1.0)
    self.low_cmd.motor_cmd[joint].q = (1.0 - ratio) * current_position
```
Smoothly transitions from current position to zero (neutral).

#### **Stage 2: Execute Dab (2s - 5s)**
```python
elif self.time_ < self.duration_ * 2.5:
    ratio = np.clip((self.time_ - self.duration_) / (self.duration_ * 1.5), 0.0, 1.0)
    self.low_cmd.motor_cmd[joint].q = ratio * target + (1.0 - ratio) * current
```
Interpolates from current position to dab pose.

#### **Stage 3: Hold Pose (5s - 9s)**
```python
elif self.time_ < self.duration_ * 4.5:
    self.low_cmd.motor_cmd[joint].q = self.dab_pos[i]
```
Maintains the dab position.

#### **Stage 4: Return to Neutral (9s - 13s)**
```python
elif self.time_ < self.duration_ * 6.5:
    ratio = np.clip((time_elapsed) / (duration), 0.0, 1.0)
    self.low_cmd.motor_cmd[joint].q = (1.0 - ratio) * dab_position
```
Smoothly returns to neutral position.

#### **Stage 5: Release Control (13s - 15s)**
```python
elif self.time_ < self.duration_ * 7.5:
    ratio = np.clip((time_elapsed) / duration, 0.0, 1.0)
    self.low_cmd.motor_cmd[G1JointIndex.kNotUsedJoint].q = (1 - ratio)
```
Gradually disables arm SDK control.

---

## Motor Command Structure

Each motor command has these fields:

```python
self.low_cmd.motor_cmd[joint].q      # Target position (radians)
self.low_cmd.motor_cmd[joint].dq     # Target velocity (rad/s)
self.low_cmd.motor_cmd[joint].tau    # Feedforward torque (N⋅m)
self.low_cmd.motor_cmd[joint].kp     # Position gain
self.low_cmd.motor_cmd[joint].kd     # Damping gain
```

**Control Law:** `torque = kp * (q_target - q_actual) + kd * (dq_target - dq_actual) + tau`

---

## Creating Your Own Movements

### Step 1: Define Target Poses

Create arrays of joint angles for your desired poses:

```python
self.wave_pos = [
    kPi/2,      # LeftShoulderPitch: raised high
    kPi/4,      # LeftShoulderRoll: slightly out
    0.,         # LeftShoulderYaw: neutral
    -kPi/3,     # LeftElbow: bent
    0.,         # LeftWristRoll: neutral
    # ... continue for all joints
]
```

**Tips:**
- Use `kPi` for 180°, `kPi_2` for 90°
- Positive/negative depends on joint convention
- Test small movements first

### Step 2: Define Joint List

Specify which joints to control:

```python
self.controlled_joints = [
    G1JointIndex.LeftShoulderPitch,
    G1JointIndex.LeftShoulderRoll,
    # ... add joints you want to move
]
```

### Step 3: Create Motion Sequence

Design your timing stages:

```python
if self.time_ < 3.0:
    # Stage 1: Preparation
    ratio = self.time_ / 3.0
    target = ratio * self.pose1[i]
    
elif self.time_ < 6.0:
    # Stage 2: Main action
    ratio = (self.time_ - 3.0) / 3.0
    target = ratio * self.pose2[i] + (1 - ratio) * self.pose1[i]
    
elif self.time_ < 9.0:
    # Stage 3: Hold
    target = self.pose2[i]
```

### Step 4: Tune Control Parameters

Adjust for smoothness and safety:

```python
self.kp = 60.0    # Higher = stiffer (20-100 typical)
self.kd = 1.5     # Higher = more damped (0.5-5 typical)
self.duration_ = 2.0  # Slower = safer for testing
```

---

## Safety Considerations

1. **Always enable arm SDK:** Set `motor_cmd[kNotUsedJoint].q = 1` when controlling
2. **Smooth transitions:** Use `np.clip()` and linear interpolation
3. **Test incrementally:** Start with small movements
4. **Clear workspace:** Ensure no obstacles around robot
5. **Emergency stop:** Have a way to kill the program

---

## Advanced Techniques

### Cyclic Motions
```python
angle = amplitude * np.sin(2 * np.pi * frequency * self.time_)
self.low_cmd.motor_cmd[joint].q = base_angle + angle
```

### Velocity Control
```python
self.low_cmd.motor_cmd[joint].dq = 0.5  # rad/s
self.low_cmd.motor_cmd[joint].kd = 5.0  # Increase damping
```

### Multi-Pose Sequences
```python
poses = [pose1, pose2, pose3, pose4]
stage = int(self.time_ / stage_duration) % len(poses)
current_target = poses[stage]
```

### Coordinate Multiple Joints
```python
# Example: Make both arms mirror each other
left_angle = kPi/4
right_angle = -kPi/4  # Opposite sign for mirroring
```

---

## Debugging Tips

1. **Print current state:**
   ```python
   print(f"Joint {joint}: {self.low_state.motor_state[joint].q}")
   ```

2. **Verify timing:**
   ```python
   print(f"Time: {self.time_:.2f}, Stage: {current_stage}")
   ```

3. **Check interpolation:**
   ```python
   print(f"Ratio: {ratio:.2f}, Target: {target:.2f}")
   ```

4. **Monitor CRC errors:** If commands aren't executing, check CRC calculation

---

## Example: Creating a Wave Motion

```python
self.wave_sequence = [
    [0., 0., 0., 0., 0., 0., 0.],           # Neutral
    [kPi/2, 0., 0., -kPi/4, 0., 0., 0.],    # Arm up
    [kPi/2, kPi/6, 0., -kPi/4, 0., 0., 0.], # Tilt right
    [kPi/2, -kPi/6, 0., -kPi/4, 0., 0., 0.],# Tilt left
    [kPi/2, 0., 0., -kPi/4, 0., 0., 0.],    # Center
]

# In LowCmdWrite():
pose_index = int(self.time_ / 1.0) % len(self.wave_sequence)
next_index = (pose_index + 1) % len(self.wave_sequence)
phase = (self.time_ % 1.0)

for i, joint in enumerate(self.controlled_joints):
    current = self.wave_sequence[pose_index][i]
    next = self.wave_sequence[next_index][i]
    target = current * (1 - phase) + next * phase
    self.low_cmd.motor_cmd[joint].q = target
```

---

## Summary

The key to creating robot motions:
1. **Define poses** as arrays of joint angles
2. **Create timing stages** in `LowCmdWrite()`
3. **Interpolate smoothly** between poses using ratio calculations
4. **Test safely** with clear space and conservative parameters
5. **Iterate and refine** based on observed behavior

Use this dab example as a template, modify the poses and timing to create any movement you can imagine!