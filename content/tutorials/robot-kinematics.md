# Robot Kinematics: Forward & Inverse Solutions

Robot kinematics is the study of how robot mechanisms move. It maps the relationship between the joint angles (joint space) and the operational posture of the end-effector (task space).

```
   Joint Space (theta_1, theta_2)  ====== Forward Kinematics =====>  Task Space (x, y, z)
   Joint Space (theta_1, theta_2)  <===== Inverse Kinematics =====  Task Space (x, y, z)
```

---

## 1. Denavit-Hartenberg (DH) Convention

The Denavit-Hartenberg convention is standard in robotics for representing joint frames and linking coordinate systems together. For every link $i$, we define four parameters:

- **Link length ($a_i$)**: Distance along $x_i$ axis from $z_{i-1}$ to $z_i$.
- **Link twist ($\alpha_i$)**: Angle around $x_i$ axis from $z_{i-1}$ to $z_i$.
- **Joint offset ($d_i$)**: Distance along $z_{i-1}$ axis from $x_{i-1}$ to $x_i$.
- **Joint angle ($\theta_i$)**: Angle around $z_{i-1}$ axis from $x_{i-1}$ to $x_i$.

Here is an example DH table for a simple 2-DOF planar manipulator:

| Link $i$ | $d_i$ (offset) | $\theta_i$ (angle) | $a_i$ (length) | $\alpha_i$ (twist) |
|:---:|:---:|:---:|:---:|:---:|
| 1 | 0 | $\theta_1$ | $L_1$ | 0 |
| 2 | 0 | $\theta_2$ | $L_2$ | 0 |

---

## 2. Forward Kinematics (Analytical)

For a 2-DOF planar robot arm, we can compute the end-effector position $(x, y)$ analytically using basic trigonometry:

$$x = L_1 \cos(\theta_1) + L_2 \cos(\theta_1 + \theta_2)$$
$$y = L_1 \sin(\theta_1) + L_2 \sin(\theta_1 + \theta_2)$$

### Python Implementation

Here is a simple python solver for calculating the forward kinematics:

```python
import numpy as np

def forward_kinematics(theta1, theta2, L1=1.0, L2=1.0):
    """
    Computes (x, y) coordinates of the end effector.
    Parameters are in radians.
    """
    x = L1 * np.cos(theta1) + L2 * np.cos(theta1 + theta2)
    y = L1 * np.sin(theta1) + L2 * np.sin(theta1 + theta2)
    return x, y

# Test coordinate calculation
t1, t2 = np.radians(30), np.radians(45)
x, y = forward_kinematics(t1, t2)
print(f"End Effector Position: X={x:.3f}, Y={y:.3f}")
```

---

## 3. Inverse Kinematics (Geometric Approach)

Inverse kinematics (IK) is significantly harder than forward kinematics. Given target coordinates $(X_G, Y_G)$, we need to solve for $\theta_1$ and $\theta_2$.

Using the law of cosines, we can find the elbow angle $\theta_2$:

$$\cos(\theta_2) = \frac{X_G^2 + Y_G^2 - L_1^2 - L_2^2}{2 L_1 L_2}$$

Therefore, we get two possible solutions (elbow up and elbow down):

$$\theta_2 = \pm \arccos\left(\cos(\theta_2)\right)$$

Once $\theta_2$ is determined, we solve for the shoulder angle $\theta_1$:

$$\theta_1 = \text{atan2}(Y_G, X_G) - \text{atan2}\left(L_2 \sin(\theta_2), L_1 + L_2 \cos(\theta_2)\right)$$

```python
def inverse_kinematics(x, y, L1=1.0, L2=1.0):
    """
    Computes joint angles for a 2-DOF planar arm.
    Returns (theta1, theta2) in radians.
    """
    # Distance to target
    d_sq = x**2 + y**2
    
    # Check if target is reachable
    if d_sq > (L1 + L2)**2 or d_sq < abs(L1 - L2)**2:
        raise ValueError("Target coordinate is out of robot arm reach!")
        
    # Solve for theta2 (elbow up/down: choosing elbow down '+')
    cos_t2 = (d_sq - L1**2 - L2**2) / (2 * L1 * L2)
    # Clip cos value to prevent float inaccuracy out-of-bounds
    cos_t2 = np.clip(cos_t2, -1.0, 1.0)
    theta2 = np.arccos(cos_t2)
    
    # Solve for theta1
    theta1 = np.arctan2(y, x) - np.arctan2(L2 * np.sin(theta2), L1 + L2 * cos_t2)
    
    return np.degrees(theta1), np.degrees(theta2)

# Verify Solver
deg1, deg2 = inverse_kinematics(1.0, 1.0)
print(f"Required joint angles: Shoulder={deg1:.2f}°, Elbow={deg2:.2f}°")
```

---

## 4. Singularities & Design Limits

A **singularity** occurs when the Jacobian matrix loses rank, meaning the robot arm loses one or more degrees of freedom. In a 2-DOF planar arm, this happens when:
- $\theta_2 = 0^\circ$ (Fully extended straight out)
- $\theta_2 = 180^\circ$ (Fully folded back on itself)

At these configurations, the robot cannot move in certain direction vectors no matter how fast the joint actuators rotate! Always check for singularities inside your trajectory planner.
