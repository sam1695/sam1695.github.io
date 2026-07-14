# Understanding Unitree G1 Joint Movements - Roll, Pitch, and Yaw 

Many of the G1's joints have names ending in roll, pitch, or yaw. These terms describe the joint's axis of rotation. 

A basic example of roll, pitch, and yaw would be an airplane:

- Roll - wing up / wing down
- Pitch - nose up / nose down
- Yaw - nose turns left / right

The same thing applies to the robot joints.

## Roll

Roll is rotation side-to-side around the front-to-back axis.

Examples:

- Lifting your arm out to the side.
- Leaning your body left or right.
- Tilting your foot inward or outward.

```
Front View

     \ O /
      \|/

Arm lifted sideways = ShoulderRoll
```

On the G1:

- `LeftShoulderRoll`
- `RightShoulderRoll`
- `WaistRoll`
- `LeftHipRoll`
- `RightAnkleRoll`

---

## Pitch

Pitch is rotation forward and backward around the side-to-side axis.

Examples:

- Raising your arm straight in front of you.
- Swinging your leg forward while walking.
- Leaning your torso forward.

```
Side View

      O
     /|
    /
   /

Arm raised forward = ShoulderPitch
```

On the G1:

- `LeftShoulderPitch`
- `RightShoulderPitch`
- `WaistPitch`
- `LeftHipPitch`
- `RightAnklePitch`

---


## Yaw

Yaw is rotation around the vertical axis.

Examples:

- Turning your head left or right.
- Rotating your arm while keeping it at shoulder height.
- Twisting your waist.

```
Top View

      ^
      |
  <---O--->
      |

Turning left/right = Yaw
```

On the G1:

- `LeftShoulderYaw`
- `RightShoulderYaw`
- `WaistYaw`
- `LeftHipYaw`

---

## Visualizing the Shoulder

The shoulder is one of the easiest places to understand all three rotations.

```
                 Shoulder

                  O
                 /|\
                / | \


Roll:
Move arm out to the side and back down.

Pitch:
Move arm forward/backward.

Yaw:
Rotate the upper arm left/right without lifting it much.
```

---

<!-- ## Why This Matters

When creating robot motions, you'll often combine multiple rotations to make movements.

For example, a wave might use:

- Shoulder Pitch - raise the arm
- Shoulder Roll - move the arm slightly away from the body
- Elbow - bend the arm
- Shoulder Yaw - rotate the arm  -->

It is important to understand how the joint movements combine to create actions. The next time you get stuck, think of roll, pitch, and yaw, and then make small changes to the joints until you get the movement you want.