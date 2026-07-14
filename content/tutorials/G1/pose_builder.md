# G1 Pose Builder

An interactive command-line tool for manually posing the Unitree G1's arms and waist, and saving those poses to a library (`poses.json`) for later playback. Built on the `arm_sdk` low-level interface, with all real-time control and smooth interpolation handled by `WaistArmController`.

## WARNING - Everything Is Radians!!!

Every joint value in this tool — `set`, `add`, and the raw values inside `poses.json` — is in **radians**, not degrees. This is the single most important thing to understand before you touch the keyboard.

**Move in small increments.** Start with values like `0.1` or `0.2`, watch what happens, and build up from there. Do not guess a "big" number because it felt right for degrees.

### Why this matters — a true story

Late one night in the lab, in the run-up to a halftime show where the robot was performing, a teammate was using Pose Builder and forgot the values were in radians. He entered a value that he thought was a small adjustment. It wasn't. The robot's arm shot up and completed a full rotation, swinging around and slamming behind its head at full speed. It happened almost instantly — one loud bang, and the arm was somewhere it should never have been.

This isn't hypothetical, and it isn't just "someone else's mistake" — it's happened more than once on our team. The scratch on the right side of the Stoke's Robotics logo exists because someone (misjudging a radian) did something similar.

**Rules of thumb:**
- `π ≈ 3.14`, and a full rotation is `2π ≈ 6.28`. A value like `3` or `5` is NOT small — it's most of a rotation.
- If you mean "a little bit," that's on the order of `0.1`–`0.3` radians, not `1` or `2`.
- Use `add` for incremental nudges instead of guessing an absolute value with `set`.
- Always know how far the joint currently is from your target before committing — check with `show` first.
- If you're unsure what a number "looks like" in real life, convert to degrees in your head (`radians × 57.3 = degrees`) before entering it.
- Stand clear, and know where the robot's arm will end up before you press Enter.

Radians are unforgiving. A number that looks small on a screen can mean the robot's arm crossing 90+ degrees of travel in a fraction of a second. Take it slow, especially the first time you're testing a new pose.

## Scope: Arms and Waist Only

This tool controls **arm joints only** (shoulders, elbows, wrists) plus a **waist yaw** shortcut. It does **not** touch the legs, and the legs should never be wired into this tool.

### Why the legs are off-limits

One of our teammates spent two weeks building out leg control for this kind of pose tool — only to find out afterward that we weren't allowed to modify leg behavior at all. Save yourself the two weeks: legs are out of scope for Pose Builder, full stop. If you're thinking about extending this tool to include leg joints, stop and check with the team first — there's almost certainly a reason it hasn't been done already.

### Why the waist is safety-locked

The waist yaw shortcuts (`waist`, `left`, `right`, `center`) are the only waist motion exposed here, and that's intentional. The waist mechanism is a safety-critical joint: if it fails or is driven incorrectly, the robot can fold in half at the waist. That is exactly as dangerous as it sounds, and not something to test casually or push past small increments. Treat waist commands with the same caution as arm commands — small values, watch the robot, no surprises.

## Requirements

- Unitree G1 robot, powered on and connected via a valid network interface
- `unitree_sdk2py` installed and importable
- Robot in a state where `arm_sdk` low-level control is safe to enable (arms clear of obstructions/people)
- Python 3 with `numpy`

## Running It

```bash
python3 pose_builder.py <networkInterface>
```

Example:

```bash
python3 pose_builder.py eth0
```

The script will:
1. Prompt you to press Enter before initializing anything.
2. Connect to the robot and wait for the first low-state message.
3. Capture the robot's **current** joint positions as the "initial pose" (this is what `initial` and program exit will return to).
4. Enable arm SDK control.
5. Print the joint reference, current pose, and full command list.

**Before you press Enter to start:** make sure the robot's arms have clearance to move, and that someone is ready to watch the robot the whole time you're issuing commands.

## Joint Indices

```
LEFT ARM:                    RIGHT ARM:
 0: Shoulder Pitch            7: Shoulder Pitch
 1: Shoulder Roll             8: Shoulder Roll
 2: Shoulder Yaw              9: Shoulder Yaw
 3: Elbow                    10: Elbow
 4: Wrist Roll               11: Wrist Roll
 5: Wrist Pitch              12: Wrist Pitch
 6: Wrist Yaw                13: Wrist Yaw

WAIST:
14: Waist Yaw
```

## Commands

### Joint control
| Command | Description |
|---|---|
| `set <joint#> <value>` | Set a joint to an absolute value, in **radians** |
| `add <joint#> <value>` | Nudge a joint by a relative value (can be negative), in **radians** — prefer this over `set` when you're not 100% sure of the current position |
| `mirror` | Copy the left arm's pose to the right arm (mirrored) |

### Waist shortcuts
| Command | Description |
|---|---|
| `waist <angle_degrees>` | Set waist yaw — this one takes **degrees**, converted internally to radians |
| `left` | Rotate waist 90° left |
| `right` | Rotate waist 90° right |
| `center` | Return waist to 0° |

### Poses
| Command | Description |
|---|---|
| `save <name> [description]` | Save the current pose under a name |
| `load <name>` | Smoothly move the robot to a saved pose |
| `poses` | List all saved poses |
| `delete <name>` | Delete a saved pose |
| `rename <old> <new>` | Rename a saved pose |

### Display
| Command | Description |
|---|---|
| `show` | Print current joint values (radians) and waist angle (degrees) |
| `joints` | Print the joint index reference |

### Other
| Command | Description |
|---|---|
| `zero` | Move all 15 joints to 0 |
| `initial` | Return to the position captured at startup |
| `help` | Print the full command reference |
| `quit` / `exit` / `q` | Return to initial position, disable control, and exit |

## Examples

```
set 0 0.5             # left shoulder pitch to 0.5 rad — a modest, safe test move
add 3 0.1             # nudge left elbow by +0.1 rad
waist 90               # waist to 90 degrees (this command takes degrees)
save wave left arm raised in wave
load wave              # move to the saved "wave" pose
```

## Safety Checklist Before Every Session

- [ ] Confirm you're entering **radians** for `set`/`add` (everything except `waist`, `left`, `right`, `center`).
- [ ] Start every new movement with a small test value and observe before going further.
- [ ] Keep the area around the robot's arms clear.
- [ ] Never wire leg joints into this tool.
- [ ] Never bypass the waist yaw shortcut to drive the waist mechanism directly.
- [ ] Someone is watching the robot the entire time commands are being issued — not just the terminal.

Poses are stored in `poses.json` at the path defined by `POSES_FILE` at the top of the script — back this file up if you build a library you care about, since a corrupted file will simply reset to empty rather than crash the tool.