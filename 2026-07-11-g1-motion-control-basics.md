---
layout: default
title: "Getting Started: Unitree G1 Motion Control"
date: 2026-07-11
categories: [Motion Control]
---

{% include nav.html %}

If you're new to controlling the Unitree G1 humanoid robot, this post covers the basics of how custom movements are built using the Unitree SDK.

## The Big Picture

Every custom motion follows the same pattern:

1. **Define target poses** — arrays of joint angles (in radians) that describe where each joint should end up
2. **List which joints you're controlling** — not every motion needs all 29 degrees of freedom
3. **Write a timed sequence** — smoothly move from the current position into your pose, hold it, then return to neutral
4. **Tune your control gains** — `kp` (stiffness) and `kd` (damping) control how firm or soft the motion feels

## A Minimal Example

```python
if self.time_ < 3.0:
    # Ease into the pose
    ratio = self.time_ / 3.0
    target = ratio * self.pose[i]
elif self.time_ < 6.0:
    # Hold the pose
    target = self.pose[i]
```

## Safety Reminders

- Always enable the arm SDK flag before sending commands
- Start with slow, small movements before scaling up
- Clear the workspace around the robot before testing
- Keep an emergency stop within reach

## Next Steps

Once you're comfortable with a simple pose-and-hold motion, try building a multi-stage sequence (prep → action → hold → release) or a cyclic motion using a sine wave for continuous movement.

*Video walkthrough coming soon — check back or ask in the lab channel if you want a live demo.*
