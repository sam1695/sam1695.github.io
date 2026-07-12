# Getting Started with ROS 2 (Robot Operating System)

Welcome to the Robotics Lab! This tutorial covers the fundamental building blocks of **ROS 2 (Humble/Iron)**. ROS 2 is a middleware suite designed to handle communication between different components of a robotic system (sensors, actuators, path planners, etc.).

---

## 1. Core ROS 2 Concepts

Before we write code, you need to understand the four primary communication paradigms in ROS 2:

1. **Nodes**: A node is a single process that performs a specific robotic task (e.g., parsing LiDAR data, running controller algorithms).
2. **Topics**: Nodes publish and subscribe to messages via topics. This is a **one-to-many, asynchronous** communication channel.
3. **Services**: Nodes can communicate using a Request-Response model. This is **synchronous** and best for quick command operations.
4. **Actions**: Actions are used for long-running tasks. They have three parts: Goal request, feedback updates, and final result response.

```
+------------------+                    +------------------+
|                  |     Topic Msg      |                  |
|    Publisher     |------------------->|    Subscriber    |
|       Node       |                    |       Node       |
|                  |                    |                  |
+------------------+                    +------------------+
```

---

## 2. Setting Up Your ROS 2 Workspace

We use `colcon` as the build system. Follow these commands to set up a new workspace:

```bash
# Create the directory structure
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# Create a Python package
ros2 pkg create --build-type ament_python my_first_package --dependencies rclpy std_msgs
```

Go back to the root of your workspace and compile:

```bash
cd ~/ros2_ws
colcon build --symlink-install
```

Always remember to source your new workspace before running packages:

```bash
source install/setup.bash
```

---

## 3. Creating a Publisher Node

Here is a simple python node that publishes string messages to a topic. Create a file named `talker.py` in your package folder:

```python
import rclpy
from rclpy.node import Node
from std_msgs.msg import String

class TalkerNode(Node):
    def __init__(self):
        super().__init__('talker_node')
        self.publisher_ = self.create_publisher(String, 'chatter', 10)
        self.timer = self.create_timer(1.0, self.timer_callback)
        self.i = 0

    def timer_callback(self):
        msg = String()
        msg.data = f'Hello Robotics Lab! Count: {self.i}'
        self.publisher_.publish(msg)
        self.get_logger().info(f'Publishing: "{msg.data}"')
        self.i += 1

def main(args=None):
    rclpy.init(args=args)
    talker = TalkerNode()
    try:
        rclpy.spin(talker)
    except KeyboardInterrupt:
        pass
    finally:
        talker.destroy_node()
        rclpy.shutdown()

if __name__ == '__main__':
    main()
```

### Key Highlights of the Code
- `rclpy.node.Node` handles all node registration behind the scenes.
- `create_publisher` sets up a topic named `chatter` of type `String` with a queue size of `10`.
- `rclpy.spin` keeps the process alive, handling timer events in the background.

---

## 4. Testing Your Implementation

Open two terminals. In Terminal 1, run your publisher:

```bash
ros2 run my_first_package talker
```

In Terminal 2, you can use the built-in ROS 2 command line tools to verify the topic messages:

```bash
ros2 topic list
ros2 topic echo /chatter
```

You should see the messages printing out every second. Congratulations, your first ROS 2 node is online!
